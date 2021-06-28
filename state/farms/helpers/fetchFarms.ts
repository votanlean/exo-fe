import BigNumber from 'bignumber.js';
import erc20 from 'config/abi/erc20.json';
import orchestratorABI from 'config/abi/TEXOOrchestrator.json';
import multicall from 'utils/multicall';
import { BIG_TEN } from 'utils/bigNumber';
import { getAddress } from 'utils/addressHelpers';
import contracts from 'config/constants/contracts';

const fetchFarms = async (farmsToFetch: any[], chainId?: number) => {
  const data = await Promise.all(
    farmsToFetch.map(async (farmConfig) => {
      const lpAddress = getAddress(farmConfig.address, chainId);
      const calls = [
        // Balance of token in the LP contract
        {
          address: getAddress(farmConfig.token.address, chainId),
          name: 'balanceOf',
          params: [lpAddress],
        },
        // Balance of quote token on LP contract
        {
          address: getAddress(farmConfig.quoteToken.address, chainId),
          name: 'balanceOf',
          params: [lpAddress],
        },
        // Balance of LP tokens in the master chef contract
        {
          address: lpAddress,
          name: 'balanceOf',
          params: [getAddress(contracts.orchestrator, chainId)],
        },
        // Total supply of LP tokens
        {
          address: lpAddress,
          name: 'totalSupply',
        },
        // Token decimals
        {
          address: getAddress(farmConfig.token.address, chainId),
          name: 'decimals',
        },
        // Quote token decimals
        {
          address: getAddress(farmConfig.quoteToken.address, chainId),
          name: 'decimals',
        },
      ];

      const [
        tokenBalanceLP,
        quoteTokenBalanceLP,
        lpTokenBalanceMC,
        lpTotalSupply,
        tokenDecimals,
        quoteTokenDecimals,
      ] = await multicall(erc20, calls, chainId);

      // Ratio in % of LP tokens that are staked in the MC, vs the total number in circulation
      const lpTokenRatio = new BigNumber(lpTokenBalanceMC).div(
        new BigNumber(lpTotalSupply),
      );

      // Raw amount of token in the LP, including those not staked
      const tokenAmountTotal = new BigNumber(tokenBalanceLP).div(
        BIG_TEN.pow(tokenDecimals),
      );
      const quoteTokenAmountTotal = new BigNumber(quoteTokenBalanceLP).div(
        BIG_TEN.pow(quoteTokenDecimals),
      );

      // Amount of token in the LP that are staked in the MC (i.e amount of token * lp ratio)
      const tokenAmountMc = tokenAmountTotal.times(lpTokenRatio);
      const quoteTokenAmountMc = quoteTokenAmountTotal.times(lpTokenRatio);

      // Total staked in LP, in quote token value
      const lpTotalInQuoteToken = quoteTokenAmountMc.times(new BigNumber(2));

      const [info, totalAllocPoint] = await multicall(
        orchestratorABI,
        [
          {
            address: getAddress(contracts.orchestrator, chainId),
            name: 'poolInfo',
            params: [farmConfig.pid],
          },
          {
            address: getAddress(contracts.orchestrator, chainId),
            name: 'totalAllocPoint',
          },
        ],
        chainId,
      );

      const allocPoint = new BigNumber(info.allocPoint._hex);
      const poolWeight = allocPoint.div(new BigNumber(totalAllocPoint));

      return {
        ...farmConfig,
        tokenAmountMc: tokenAmountMc.toJSON(),
        quoteTokenAmountMc: quoteTokenAmountMc.toJSON(),
        tokenAmountTotal: tokenAmountTotal.toJSON(),
        quoteTokenAmountTotal: quoteTokenAmountTotal.toJSON(),
        lpTotalSupply: new BigNumber(lpTotalSupply).toJSON(),
        lpTotalInQuoteToken: lpTotalInQuoteToken.toJSON(),
        tokenPriceVsQuote: quoteTokenAmountTotal.div(tokenAmountTotal).toJSON(),
        poolWeight: poolWeight.toJSON(),
        allocPoint: new BigNumber(info.allocPoint._hex).toNumber(),
        totalStaked: new BigNumber(lpTokenBalanceMC).toJSON(),
      };
    }),
  );
  return data;
};

export default fetchFarms;
