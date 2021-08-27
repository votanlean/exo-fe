import { getAddress } from "utils/addressHelpers";
import multicall from 'utils/multicall';
import vault from 'config/abi/Vault.json';
import BigNumber from "bignumber.js";

export default async function fetchYieldFarms(yieldFarms: any[], chainId?: number) {
    const data = await Promise.all(yieldFarms.map(async (yieldFarm) => {

        const vaultCalls = [
            {
                address: getAddress(yieldFarm.address, chainId),
                name: "strategy",
                params: []
            },
            {
                address: getAddress(yieldFarm.address, chainId),
                name: 'underlyingBalanceWithInvestment',
            }
        ]

        const [
            vaultStrategyAddress,
            underlyingVaultBalance
        ] = await multicall(vault, vaultCalls, chainId);

        return {
            ...yieldFarm,
            strategy: {
                address: vaultStrategyAddress
            },
            underlyingVaultBalance: new BigNumber(underlyingVaultBalance).toJSON()
        }
    }));

    return data;
}
