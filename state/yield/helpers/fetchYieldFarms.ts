import { getAddress } from "utils/addressHelpers";

export default async function fetchYieldFarms(yieldFarms: any[], chainId?: number) {
	const data = await Promise.all(yieldFarms.map(async (yieldFarm) => {
		const calls = [
			{
				address: getAddress(yieldFarm.address, chainId),
				name: 'balanceOf',
				params: []
			}
		];

		return {
			...yieldFarm
		}
	}));

	return data;
}