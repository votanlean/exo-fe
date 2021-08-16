import { getAddress } from "utils/addressHelpers";
import multicall from 'utils/multicall';
import erc20 from 'config/abi/erc20.json';
import vault from 'config/abi/Vault.json';
import BigNumber from "bignumber.js";

export default async function fetchYieldFarms(yieldFarms: any[], chainId?: number) {
	const data = await Promise.all(yieldFarms.map(async (yieldFarm) => {
		const ercCalls = [
			{
				address: getAddress(yieldFarm.underlying.address, chainId),
				name: 'balanceOf',
				params: [getAddress(yieldFarm.vaultAddress, chainId)]
			}
		];

		const vaultCalls = [
			{
				address: getAddress(yieldFarm.vaultAddress, chainId),
				name: "strategy",
				params: []
			}
		]

		const [
			underlyingVaultBalance
		] = await multicall(erc20, ercCalls, chainId);

		const [
			vaultStrategyAddress
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