import { getAddress } from "utils/addressHelpers";
import multicall from "utils/multicall";
import erc20 from 'config/abi/erc20.json';
import vault from 'config/abi/Vault.json';
import BigNumber from "bignumber.js";

export default async function fetchUserData(yieldFarms: any[], account: string, chainId: number) {
	const data = await Promise.all(yieldFarms.map(async (yieldFarm) => {
		const ercCalls = [
			{
				address: getAddress(yieldFarm.underlying.address, chainId),
				name: 'balanceOf',
				params: [account]
			},
			{
				address: getAddress(yieldFarm.address, chainId),
				name: 'balanceOf',
				params: [account]
			}
		];

		const vaultCalls = [
			{
				address: getAddress(yieldFarm.address, chainId),
				name: "underlyingBalanceWithInvestmentForHolder",
				params: [account]
			}
		];

		const allowanceCall = [
			{
				address: getAddress(yieldFarm.underlying.address, chainId),
				name: "allowance",
				params: [account, getAddress(yieldFarm.address, chainId)]
			}
		]

		const [
			userUnderlyingBalance,
			userVaultBalance
		] = await multicall(erc20, ercCalls, chainId);

		const [
			userUnderlyingInVaultBalance
		] = await multicall(vault, vaultCalls, chainId);

		const allowance = await multicall(erc20, allowanceCall, chainId);

		return {
			...yieldFarm,
			userData: {
				allowance: new BigNumber(allowance).toJSON(),
				balance: new BigNumber(userUnderlyingBalance).toJSON(),
				inVaultBalance: new BigNumber(userVaultBalance).toJSON(),
				stakedBalance: new BigNumber(userUnderlyingInVaultBalance).toJSON(),
			}
		}
	}));

	return data;
}
