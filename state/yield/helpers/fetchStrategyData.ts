import { STRATEGY_TYPES } from 'config/constants/yieldFarms';
import { getAddress } from 'utils/addressHelpers';
import { multicallRetry } from 'utils/multicall';
import BigNumber from 'bignumber.js';
import { BIG_TEN, normalizeTokenDecimal } from 'utils/bigNumber';
import erc20 from 'config/abi/erc20.json';
import masterchief from 'config/abi/masterchef.json';
import TEXOOrchestrator from 'config/abi/TEXOOrchestrator.json';
import pair from 'config/abi/Pair.json';

const getPancakeswapStrategyData = async (strategy: any, chainId: number) => {
  const { rewardPool, pool } = strategy;
  const rewardPoolAddress = getAddress(rewardPool.address, chainId);
  const poolId = getAddress(pool.id, chainId);

  const masterchiefCalls = [
    {
      address: rewardPoolAddress,
      name: 'poolInfo',
      params: [poolId]
    },
    {
      address: rewardPoolAddress,
      name: 'totalAllocPoint',
    },
    {
      address: rewardPoolAddress,
      name: 'cakePerBlock',
    },
  ];

  const [
    poolInfo,
    totalAllocPoint,
    cakePerBlock
  ] = await multicallRetry(masterchief, masterchiefCalls, chainId);

  const [
    [quoteTokenAddress]
  ] = await multicallRetry(pair, [{
    address: poolInfo.lpToken,
    name: "token1"
  }], chainId)

  const erc20Calls = [
    // Balance of quote token on LP contract
    {
      address: quoteTokenAddress,
      name: 'balanceOf',
      params: [poolInfo.lpToken],
    },
    // Balance of LP tokens in the master chef contract
    {
      address: poolInfo.lpToken,
      name: 'balanceOf',
      params: [rewardPoolAddress],
    },
    // Total supply of LP tokens
    {
      address: poolInfo.lpToken,
      name: 'totalSupply',
    },
    // Quote token decimals
    {
      address: quoteTokenAddress,
      name: 'decimals',
    },
  ];

  const [quoteTokenBalanceLP, lpTokenBalanceMC, lpTotalSupply, quoteTokenDecimals] =
    await multicallRetry(erc20, erc20Calls, chainId)

  const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))

  const quoteTokenAmountTotal = new BigNumber(quoteTokenBalanceLP).div(BIG_TEN.pow(quoteTokenDecimals))
  const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio)
  const lpTotalInQuoteToken = quoteTokenAmountMc.times(new BigNumber(2))

  return {
    ...strategy,
    rewardPool,
    pool: {
      ...pool,
      lpToken: poolInfo.lpToken,
      allocPoint: poolInfo.allocPoint.toNumber(),
      lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
      quoteTokenAddress,
    },
    totalAllocPoint: new BigNumber(totalAllocPoint[0]._hex).toNumber(),
    cakePerBlock: normalizeTokenDecimal(new BigNumber(cakePerBlock)).toNumber(),
  }
}

const getOrchestratorStrategyData = async (strategy: any, chainId:number)=>{
  const { rewardPool, pool } = strategy;
  const rewardPoolAddress = getAddress(rewardPool.address, chainId);
  const poolId = getAddress(pool.id, chainId);

  const masterchiefCalls = [
    {
      address: rewardPoolAddress,
      name: 'poolInfo',
      params: [poolId]
    },
    {
      address: rewardPoolAddress,
      name: 'totalAllocPoint',
    },
    {
      address: rewardPoolAddress,
      name: 'tEXOPerBlock',
    },
  ];

  const [
    poolInfo,
    totalAllocPoint,
    tEXOPerBlock
  ] = await multicallRetry(TEXOOrchestrator, masterchiefCalls, chainId);

  const [
    [quoteTokenAddress]
  ] = await multicallRetry(pair, [{
    address: poolInfo.lpToken,
    name: "token1"
  }], chainId)

  const erc20Calls = [
    // Balance of quote token on LP contract
    {
      address: quoteTokenAddress,
      name: 'balanceOf',
      params: [poolInfo.lpToken],
    },
    // Balance of LP tokens in the master chef contract
    {
      address: poolInfo.lpToken,
      name: 'balanceOf',
      params: [rewardPoolAddress],
    },
    // Total supply of LP tokens
    {
      address: poolInfo.lpToken,
      name: 'totalSupply',
    },
    // Quote token decimals
    {
      address: quoteTokenAddress,
      name: 'decimals',
    },
  ];

  const [quoteTokenBalanceLP, lpTokenBalanceMC, lpTotalSupply, quoteTokenDecimals] =
  await multicallRetry(erc20, erc20Calls, chainId);

  const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(new BigNumber(lpTotalSupply))
  const quoteTokenAmountTotal = new BigNumber(quoteTokenBalanceLP).div(BIG_TEN.pow(quoteTokenDecimals))
  const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio)
  const lpTotalInQuoteToken = quoteTokenAmountMc.times(new BigNumber(2))

  return {
    ...strategy,
    rewardPool,
    pool: {
      ...pool,
      lpToken: poolInfo.lpToken,
      allocPoint: poolInfo.allocPoint.toNumber(),
      lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
      quoteTokenAddress,
    },
    totalAllocPoint: new BigNumber(totalAllocPoint[0]._hex).toNumber(),
    cakePerBlock: normalizeTokenDecimal(new BigNumber(tEXOPerBlock)).toNumber(),
  }
}

const strategyIndex = {
  [STRATEGY_TYPES.PANCAKESWAP]: getPancakeswapStrategyData,
  [STRATEGY_TYPES.TEXO]: getOrchestratorStrategyData
}

export default async function fetchStrategyData(
  yieldFarms: any[],
  chainId: number,
) {
  const data = await Promise.all(yieldFarms.map(async (yieldFarm) => {
    const { type, ...strategy } = yieldFarm.strategy;

    try {
      // const strategyData = await getPancakeswapStrategyData(strategy, chainId);
      const strategyData = strategyIndex[type] ? await strategyIndex[type](strategy, chainId) : {};
      console.log("strategyData: ", strategyData);

      return {
        ...yieldFarm,
        strategy: {
          type,
          ...strategy,
          ...strategyData
        }
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }));

  return data;
}
