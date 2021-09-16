import { getAddress } from "utils/addressHelpers";
import { multicallRetry } from 'utils/multicall';
import vault from 'config/abi/Vault.json';
import BigNumber from "bignumber.js";
import erc20 from 'config/abi/erc20.json';
import { BIG_TEN } from 'utils/bigNumber';


export default async function fetchYieldFarms(yieldFarms: any[], chainId?: number) {
  const data = await Promise.all(yieldFarms.map(async (yieldFarm) => {
    const vaultAddress = getAddress(yieldFarm.address, chainId);
    const lpAddress = getAddress(yieldFarm.underlying.address, chainId);
    const quoteAddress = getAddress(yieldFarm.underlying.quote.address,chainId);

    const vaultCalls = [
      {
        address: vaultAddress,
        name: "strategy",
      },
      {
        address: vaultAddress,
        name: 'underlyingBalanceWithInvestment',
      },
      {
        address: vaultAddress,
        name: 'totalSupply',
      }
    ];

    const erc20Calls = [
      //Total supply of LP token.
      {
        address: lpAddress,
        name: "totalSupply",
      },
      // Balance of token in the LP contract
      {
        address: quoteAddress,
        name: "balanceOf",
        params: [lpAddress]
      },
      {
        address: quoteAddress,
        name: "decimals"
      }
    ];

    const [
      vaultStrategyAddress,
      underlyingVaultBalance,
      totalSupply
    ] = await multicallRetry(vault, vaultCalls, chainId);

    const [
      lpTotalSupply,
      quoteTokenBalanceLP,
      quoteTokenDecimals,
    ] = await multicallRetry(erc20,erc20Calls,chainId);

    const lpTokenRatio = (new BigNumber(underlyingVaultBalance)).div(new BigNumber(lpTotalSupply));
    const quoteTokenBalanceLPDecimals = new BigNumber(quoteTokenBalanceLP).div(BIG_TEN.pow(quoteTokenDecimals));

    const quoteTokenAmountVault = quoteTokenBalanceLPDecimals.times(lpTokenRatio);
    const lpTotalInQuoteTokenVault = quoteTokenAmountVault.times(new BigNumber(2));

    return {
      ...yieldFarm,
      strategy: {
        ...yieldFarm.strategy,
        address: vaultStrategyAddress
      },
      underlyingVaultBalance: new BigNumber(underlyingVaultBalance).toNumber(),
      totalSupply: new BigNumber(totalSupply).toNumber(),
      lpTotalInQuoteTokenVault: lpTotalInQuoteTokenVault.toNumber()
    }
  }));

  return data;
}
