import { getAddress } from "utils/addressHelpers";
import multicall from "utils/multicall";
import erc20 from "config/abi/erc20.json";
import vault from "config/abi/Vault.json";
import orchestratorABI from "config/abi/TEXOOrchestrator.json";
import BigNumber from "bignumber.js";
import contracts from "config/constants/contracts";

export default async function fetchUserData(yieldFarms: any[], account: string, chainId: number) {
  const data = await Promise.all(
    yieldFarms.map(async (yieldFarm) => {
      const ercCalls = [
        {
          address: getAddress(yieldFarm.underlying.address, chainId),
          name: "balanceOf",
          params: [account],
        },
        {
          address: getAddress(yieldFarm.address, chainId),
          name: "balanceOf",
          params: [account],
        },
      ];

      const vaultCalls = [
        {
          address: getAddress(yieldFarm.address, chainId),
          name: "underlyingBalanceWithInvestmentForHolder",
          params: [account],
        },
        {
          address: getAddress(yieldFarm.address, chainId),
          name: "getPricePerFullShare",
        },
      ];

      const allowanceCall = [
        {
          address: getAddress(yieldFarm.underlying.address, chainId),
          name: "allowance",
          params: [account, getAddress(yieldFarm.address, chainId)],
        },
      ];

      const tEXOOrchestrator = [
        {
          address: getAddress(contracts.orchestrator, chainId),
          name: "userInfo",
          params: [yieldFarm.ecAssetPool.pid, account],
        },
        {
          address: getAddress(contracts.orchestrator, chainId),
          name: "pendingTEXO",
          params: [yieldFarm.ecAssetPool.pid, account],
        },
      ];

      const ecAssetAllowanceCall = [
        {
          address: getAddress(yieldFarm.address, chainId),
          name: "allowance",
          params: [account, getAddress(contracts.orchestrator, chainId)],
        },
      ];

      const [userUnderlyingBalance, userVaultBalance] = await multicall(erc20, ercCalls, chainId);

      const [userUnderlyingInVaultBalance, pricePerFullShare] = await multicall(
        vault,
        vaultCalls,
        chainId
      );

      const allowance = await multicall(erc20, allowanceCall, chainId);

      const userInfo = await multicall(orchestratorABI, tEXOOrchestrator, chainId);

      const ecAssetAllowance = await multicall(erc20, ecAssetAllowanceCall, chainId);

      return {
        ...yieldFarm,
        userData: {
          allowance: new BigNumber(allowance).toJSON(),
          balance: new BigNumber(userUnderlyingBalance).toJSON(),
          inVaultBalance: new BigNumber(userVaultBalance).toJSON(),
          stakedBalance: new BigNumber(userUnderlyingInVaultBalance).toJSON(),
          ecAssetStakedBalance: new BigNumber(userInfo[0]["amount"]._hex).toJSON(),
          ecAssetAllowance: new BigNumber(ecAssetAllowance[0]).toJSON(),
          tEXOEarned: new BigNumber(userInfo[1]).toJSON(),
          pricePerFullShare: new BigNumber(pricePerFullShare).toJSON(),
        },
      };
    })
  );

  return data;
}
