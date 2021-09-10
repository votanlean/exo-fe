import BigNumber from "bignumber.js";
import lpAprs from 'config/constants/lpAprs.json';
import { STRATEGY_TYPES } from "config/constants/yieldFarms";
import { getBlockPerYear } from 'utils/getBlockPerYear';
import tokens from 'config/constants/tokens';
import { getAddress } from "utils/addressHelpers";
import { BIG_ZERO, normalizeTokenDecimal } from "utils/bigNumber";
import { getPoolApr } from "./apr";
import { convertAprToApy } from "utils/compoundApyHelpers";

const getPancakeswapYieldFarmAprHelper = (
  {
    yieldFarm,
    allTokenPrices,
    tEXOPerBlock,
    tEXOPrice,
    totalAllocPoint,
  }: any,
  chainId: number,
) => {
  const { strategy, underlyingVaultBalance, totalSupply, ecAssetBalanceInMc, ecAssetPool } = yieldFarm;
  const { cakePerBlock = BIG_ZERO, totalAllocPoint: strategyTotalAllocPoint, pool: strategyPool } = strategy;

  const farmWeight = strategyPool.allocPoint ? new BigNumber(strategyPool.allocPoint).div(
    new BigNumber(strategyTotalAllocPoint),
  ) : BIG_ZERO;

  let tokenPrice = 0;

  if (strategyPool.quoteTokenAddress) {
    if (allTokenPrices[strategyPool.quoteTokenAddress.toLowerCase()]) {
      tokenPrice = allTokenPrices[strategyPool.quoteTokenAddress.toLowerCase()];
    }

    if (strategyPool.quoteTokenAddress === getAddress(tokens.texo.address, chainId)) {
      tokenPrice = tEXOPrice;
    }
  }

  const totalLiquidity = new BigNumber(strategyPool.lpTotalInQuoteToken).times(tokenPrice);
  const lpPrice = totalLiquidity.div(normalizeTokenDecimal(new BigNumber(strategyPool.totalStaked)));

  // amount of LP in vault * LP price / total supply of ecAsset minted
  const ecAssetPrice = totalSupply ? new BigNumber(underlyingVaultBalance).times(lpPrice).div(totalSupply) : BIG_ZERO;

  const ecAssetPoolWeight = normalizeTokenDecimal(new BigNumber(ecAssetPool.allocPoint)
    .div(new BigNumber(totalAllocPoint))
    .times(new BigNumber(tEXOPerBlock)));

  return getYieldFarmApr(
    farmWeight,
    allTokenPrices[getAddress(tokens.cake.address, chainId).toLocaleLowerCase()], // cakePriceUsd, cake fixed address
    totalLiquidity, // poolLiquidityUsd
    strategyPool.lpToken,
    new BigNumber(cakePerBlock),
    ecAssetPrice.toNumber(),
    tEXOPrice,
    ecAssetBalanceInMc,
    ecAssetPoolWeight.toNumber(),
    chainId,
  )
}

const getNativeYieldFarmAprHelper = (
  {
    yieldFarm,
    allTokenPrices,
    tEXOPerBlock,
    tEXOPrice,
    totalAllocPoint,
  }: any,
  chainId: number,
) => {
  const { strategy, underlyingVaultBalance, totalSupply, ecAssetBalanceInMc, ecAssetPool } = yieldFarm;
  const { cakePerBlock: texoPerBlock = BIG_ZERO, totalAllocPoint: strategyTotalAllocPoint, pool: strategyPool } = strategy;

  const farmWeight = strategyPool.allocPoint ? new BigNumber(strategyPool.allocPoint).div(
    new BigNumber(strategyTotalAllocPoint),
  ) : BIG_ZERO;

  let tokenPrice = 0;

  if (strategyPool.quoteTokenAddress) {
    if (allTokenPrices[strategyPool.quoteTokenAddress.toLowerCase()]) {
      tokenPrice = allTokenPrices[strategyPool.quoteTokenAddress.toLowerCase()];
    }

    if (strategyPool.quoteTokenAddress === getAddress(tokens.texo.address, chainId)) {
      tokenPrice = tEXOPrice;
    }
  }

  const totalLiquidity = new BigNumber(strategyPool.lpTotalInQuoteToken).times(tokenPrice);
  const lpPrice = totalLiquidity.div(normalizeTokenDecimal(new BigNumber(strategyPool.totalStaked)));

  // amount of LP in vault * LP price / total supply of ecAsset minted
  const ecAssetPrice = totalSupply ? new BigNumber(underlyingVaultBalance).times(lpPrice).div(totalSupply) : BIG_ZERO;

  const ecAssetPoolWeight = normalizeTokenDecimal(new BigNumber(ecAssetPool.allocPoint)
    .div(new BigNumber(totalAllocPoint))
    .times(new BigNumber(tEXOPerBlock)));

  return getYieldFarmApr(
    farmWeight,
    new BigNumber(tEXOPrice), // cakePriceUsd, cake fixed address
    totalLiquidity, // poolLiquidityUsd
    strategyPool.lpToken,
    new BigNumber(texoPerBlock),
    ecAssetPrice.toNumber(),
    tEXOPrice,
    ecAssetBalanceInMc,
    ecAssetPoolWeight.toNumber(),
    chainId,
  )
}

const yieldFarmAprHelperIndex = {
  [STRATEGY_TYPES.PANCAKESWAP]: getPancakeswapYieldFarmAprHelper,
  [STRATEGY_TYPES.TEXO]: getNativeYieldFarmAprHelper,
}

export const getYieldFarmAprHelper = (
  data: any,
  chainId: number
) => {
  const { yieldFarm: { strategy } } = data;

  return yieldFarmAprHelperIndex[strategy.type] ?
    yieldFarmAprHelperIndex[strategy.type](data, chainId) :
    { apr: 0 };
}

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param tokenPriceUsd Cake price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @returns
 */
export const getYieldFarmApr = (
  poolWeight: BigNumber,
  tokenPriceUsd: BigNumber,
  poolLiquidityUsd: BigNumber,
  farmAddress: string,
  tokenPerBlock: BigNumber,
  assetTokenPrice: number, // stakingTokenPrice
  tEXOPrice: number, // rewardTokenPrice
  ecAssetBalanceInMc: number, // totalStaked
  ecAssetTokenPerBlock: number, // tokenPerBlock,
  chainId: number,
): { tokenRewardsApr: number; lpRewardsApr: number, tEXOApr: number, apr: number, apy: number } => {
  const blockPerYear = getBlockPerYear(chainId);

  const yearlyTokenRewardAllocation = tokenPerBlock
    .times(blockPerYear)
    .times(poolWeight)
  const tokenRewardsApr = yearlyTokenRewardAllocation.times(tokenPriceUsd).div(poolLiquidityUsd).times(100)

  let tokenRewardsAprAsNumber = null
  if (!tokenRewardsApr.isNaN() && tokenRewardsApr.isFinite()) {
    tokenRewardsAprAsNumber = tokenRewardsApr.toNumber()
  }
  const lpRewardsApr = lpAprs[farmAddress?.toLocaleLowerCase()] ?? 0

  const tEXOApr = getPoolApr(
    assetTokenPrice, // stakingTokenPrice
    tEXOPrice, // rewardTokenPrice
    ecAssetBalanceInMc, // totalStaked
    ecAssetTokenPerBlock, // tokenPerBlock,
    chainId
  );

  const apyData = {
    tokenPrice: 1,
    performanceFee: 0.8,
    lpRewardsApr,
    tokenRewardsAprAsNumber,
    tEXOApr,
    numberOfDays: 365,
  }

  const apy = convertAprToApy(apyData);

  return {
    tokenRewardsApr: tokenRewardsAprAsNumber,
    lpRewardsApr,
    tEXOApr,
    apr: (tokenRewardsAprAsNumber || 0) + lpRewardsApr + (tEXOApr || 0),
    apy
  }
}