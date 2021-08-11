import { getAddress } from "utils/addressHelpers";
import multicall from 'utils/multicall';
import erc20 from 'config/abi/erc20.json';
import BigNumber from "bignumber.js";

export default async function fetchYieldFarms(yieldFarms: any[], chainId?: number) {
	const data = await Promise.all(yieldFarms.map(async (yieldFarm) => {
		const calls = [
			{
				address: getAddress(yieldFarm.underlying.address, chainId),
				name: 'balanceOf',
				params: [getAddress(yieldFarm.vaultAddress, chainId)]
			}
		];

		const [
			underlyingVaultBalance
		] = await multicall(erc20, calls, chainId)

		return {
			...yieldFarm,
			underlyingVaultBalance: new BigNumber(underlyingVaultBalance).toJSON()
		}
	}));

	return data;
}