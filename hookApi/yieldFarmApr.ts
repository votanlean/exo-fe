import BigNumber from "bignumber.js";
import lpAprs from 'config/constants/lpAprs.json';
import { STRATEGY_TYPES } from "config/constants/yieldFarms";
import { getBlockPerYear } from 'utils/getBlockPerYear';
import tokens from 'config/constants/tokens';
import { getAddress } from "utils/addressHelpers";
import { BIG_ZERO, normalizeTokenDecimal } from "utils/bigNumber";
import { getPoolApr } from "./apr";

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

  const quoteTokenPrice = strategyPool.quoteTokenAddress ? allTokenPrices[strategyPool.quoteTokenAddress.toLowerCase()] : 0;
  const totalLiquidity = new BigNumber(strategyPool.lpTotalInQuoteToken).times(quoteTokenPrice);

  const ecAssetPrice = totalSupply ? new BigNumber(underlyingVaultBalance).times(quoteTokenPrice).div(totalSupply) : BIG_ZERO;

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

const yieldFarmAprHelperIndex = {
  [STRATEGY_TYPES.PANCAKESWAP]: getPancakeswapYieldFarmAprHelper
}

export const getYieldFarmAprHelper = (
  data: any,
  chainId: number
) => {
  const { yieldFarm: { strategy } } = data;

  return yieldFarmAprHelperIndex[strategy.type] ?
    yieldFarmAprHelperIndex[strategy.type](data, chainId) :
    0;
}

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param cakePriceUsd Cake price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @returns
 */
export const getYieldFarmApr = (
  poolWeight: BigNumber,
  cakePriceUsd: BigNumber,
  poolLiquidityUsd: BigNumber,
  farmAddress: string,
  cakePerBlock: BigNumber,
  assetTokenPrice: number, // stakingTokenPrice
  tEXOPrice: number, // rewardTokenPrice
  ecAssetBalanceInMc: number, // totalStaked
  ecAssetTokenPerBlock: number, // tokenPerBlock,
  chainId: number,
): { cakeRewardsApr: number; lpRewardsApr: number, tEXOApr: number, apr: number } => {
  const blockPerYear = getBlockPerYear(chainId);

  const yearlyCakeRewardAllocation = cakePerBlock
    .times(blockPerYear)
    .times(poolWeight)
  const cakeRewardsApr = yearlyCakeRewardAllocation.times(cakePriceUsd).div(poolLiquidityUsd).times(100)

  let cakeRewardsAprAsNumber = null
  if (!cakeRewardsApr.isNaN() && cakeRewardsApr.isFinite()) {
    cakeRewardsAprAsNumber = cakeRewardsApr.toNumber()
  }
  const lpRewardsApr = lpAprs[farmAddress?.toLocaleLowerCase()] ?? 0

  const tEXOApr = getPoolApr(
    assetTokenPrice, // stakingTokenPrice
    tEXOPrice, // rewardTokenPrice
    ecAssetBalanceInMc, // totalStaked
    ecAssetTokenPerBlock, // tokenPerBlock,
    chainId
  );

  return {
    cakeRewardsApr: cakeRewardsAprAsNumber,
    lpRewardsApr,
    tEXOApr,
    apr: (cakeRewardsAprAsNumber || 0) + lpRewardsApr + (tEXOApr || 0)
  }
}