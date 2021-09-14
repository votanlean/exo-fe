import { getAddress } from 'utils/addressHelpers';
import { multicallRetry } from 'utils/multicall';
import erc20 from 'config/abi/erc20.json';
import vault from 'config/abi/Vault.json';
import orchestratorABI from 'config/abi/TEXOOrchestrator.json';
import BigNumber from 'bignumber.js';
import contracts from 'config/constants/contracts';

export default async function fetchUserData(yieldFarms: any[], account: string, chainId: number) {
  const data = await Promise.all(
    yieldFarms.map(async (yieldFarm) => {
      const ercCalls = [
        {
          //Underlying token balance of the user
          address: getAddress(yieldFarm.underlying.address, chainId),
          name: "balanceOf",
          params: [account],
        },
        //ecASSET(vault) token balance of the user
        {
          address: getAddress(yieldFarm.address, chainId),
          name: "balanceOf",
          params: [account],
        },
        //Amount allowance of the vault contract with underlying token in the user.
        {
          address: getAddress(yieldFarm.underlying.address, chainId),
          name: 'allowance',
          params: [account, getAddress(yieldFarm.address, chainId)],
        },
        //Amount allowance of the orchestrator with ecASSET token in the user.
        {
          address: getAddress(yieldFarm.address, chainId),
          name: 'allowance',
          params: [account, getAddress(contracts.orchestrator, chainId)],
        }
      ];

      const vaultCalls = [
        //Amount underlying token which user has staked into the vault
        {
          address: getAddress(yieldFarm.address, chainId),
          name: "underlyingBalanceWithInvestmentForHolder",
          params: [account],
        },
        //Price of 1 underlying per full share.
        {
          address: getAddress(yieldFarm.address, chainId),
          name: "getPricePerFullShare",
        },
      ];

      const ecAssetCall = [
        //User info
        {
          address: getAddress(contracts.orchestrator, chainId),
          name: "userInfo",
          params: [yieldFarm.ecAssetPool.pid, account],
        },
        //userInfo of the pool(vaults) in the orchestrator
        {
          address: getAddress(contracts.orchestrator, chainId),
          name: "pendingTEXO",
          params: [yieldFarm.ecAssetPool.pid, account],
        },
      ];

      const [userUnderlyingBalance, userVaultBalance, allowance, ecAssetAllowance] = await multicallRetry(
        erc20,
        ercCalls,
        chainId,
      );

      const [userUnderlyingInVaultBalance, pricePerFullShare] = await multicallRetry(
        vault,
        vaultCalls,
        chainId
      );

      const [userInfo, pendingTEXO] = await multicallRetry(
        orchestratorABI,
        ecAssetCall,
        chainId,
      );

      return {
        ...yieldFarm,
        userData: {
          allowance: new BigNumber(allowance).toJSON(),
          balance: new BigNumber(userUnderlyingBalance).toJSON(),
          inVaultBalance: new BigNumber(userVaultBalance).toJSON(),
          stakedBalance: new BigNumber(userUnderlyingInVaultBalance).toJSON(),
          ecAssetStakedBalance: new BigNumber(userInfo["amount"]._hex).toJSON(),
          ecAssetAllowance: ecAssetAllowance[0].toString(),
          tEXOEarned: new BigNumber(pendingTEXO).toJSON(),
          pricePerFullShare: new BigNumber(pricePerFullShare).toJSON(),
        },
      };
    })
  );

  return data;
}