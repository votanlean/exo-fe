import contracts from 'config/constants/contracts';
import { getAddress } from 'utils/addressHelpers';
import { multicallRetry } from 'utils/multicall';
import BigNumber from 'bignumber.js';
import erc20 from 'config/abi/erc20.json';
import orchestrator from 'config/abi/TEXOOrchestrator.json';

export default async function fetchAssetPoolInfo(
  yieldFarms: any[],
  chainId: number,
) {
  const data = await Promise.all(yieldFarms.map(async (yieldFarm) => {
    const orchestratorAddress = getAddress(contracts.orchestrator, chainId);

    const orchestratorCalls = [{
      address: orchestratorAddress,
      name: 'poolInfo',
      params: [yieldFarm.ecAssetPool.pid]
    }];

    const [
      poolInfo
    ] = await multicallRetry(orchestrator, orchestratorCalls, chainId);

    const erc20Calls = [{
      address: getAddress(yieldFarm.address, chainId),
      name: 'balanceOf',
      params: [orchestratorAddress]
    }];

    const [
      ecAssetBalanceInMc
    ] = await multicallRetry(erc20, erc20Calls, chainId);

    const allocPoint = new BigNumber(poolInfo.allocPoint._hex);

    return {
      ...yieldFarm,
      ecAssetPool: {
        ...yieldFarm.ecAssetPool,
        allocPoint: allocPoint.toNumber(),
      },
      ecAssetBalanceInMc: new BigNumber(ecAssetBalanceInMc).toNumber()
    }
  }));

  return data;
}