import { getAddress } from "utils/addressHelpers";
import multicall from 'utils/multicall';
import vault from 'config/abi/Vault.json';
import BigNumber from "bignumber.js";

export default async function fetchYieldFarms(yieldFarms: any[], chainId?: number) {
  const data = await Promise.all(yieldFarms.map(async (yieldFarm) => {
    const vaultAddress = getAddress(yieldFarm.address, chainId);
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

    const [
      vaultStrategyAddress,
      underlyingVaultBalance,
      totalSupply
    ] = await multicall(vault, vaultCalls, chainId);

    return {
      ...yieldFarm,
      strategy: {
        ...yieldFarm.strategy,
        address: vaultStrategyAddress
      },
      underlyingVaultBalance: new BigNumber(underlyingVaultBalance).toNumber(),
      totalSupply: new BigNumber(totalSupply).toNumber(),
    }
  }));

  return data;
}
