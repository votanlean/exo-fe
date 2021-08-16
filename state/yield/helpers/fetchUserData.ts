import { getAddress } from "utils/addressHelpers";
import multicall from "utils/multicall";
import erc20 from 'config/abi/erc20.json';
import vault from 'config/abi/Vault.json';
import BigNumber from "bignumber.js";
import contracts from "config/constants/contracts";
import orchestratorABI from 'config/abi/TEXOOrchestrator.json';

export default async function fetchUserData(yieldFarms: any[], account: string, chainId: number) {
	const data = await Promise.all(yieldFarms.map(async (yieldFarm) => {
		const ercCalls = [
			{
				address: getAddress(yieldFarm.underlying.address, chainId),
				name: 'balanceOf',
				params: [account]
			},
			{
				address: getAddress(yieldFarm.vaultAddress, chainId),
				name: 'balanceOf',
				params: [account]
			}
		];

		const vaultCalls = [
			{
				address: getAddress(yieldFarm.vaultAddress, chainId),
				name: "underlyingBalanceWithInvestmentForHolder",
				params: [account]
			}
		];

		const userAllowance = await fetchYieldUserAllowance(account, yieldFarm, chainId);
		console.log('foo: ',userAllowance);

		const [
			userUnderlyingBalance,
			userVaultBalance
		] = await multicall(erc20, ercCalls, chainId);

		const [
			userUnderlyingInVaultBalance
		] = await multicall(vault, vaultCalls, chainId);

		return {
			...yieldFarm,
			userData: {
				balance: new BigNumber(userUnderlyingBalance).toJSON(),
				inVaultBalance: new BigNumber(userVaultBalance).toJSON(),
				stakedBalance: new BigNumber(userUnderlyingInVaultBalance).toJSON(),
			}
		}
	}));

	return data;
}

export const fetchYieldUserAllowance = async (account ,yieldFarm, chainId) => {
	const masterChefAddress = getAddress(contracts.orchestrator, chainId);

	const calls = [
		{
			address: masterChefAddress,
			name: 'userInfo',
			params: [yieldFarm.pid, account],
		}
	]

	const rawStakedBalances = await multicall(orchestratorABI, calls, chainId);
	const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
		return new BigNumber(stakedBalance[0]._hex).toJSON();
	});
	return parsedStakedBalances;
}