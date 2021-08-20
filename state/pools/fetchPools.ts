import BigNumber from 'bignumber.js';
import tEXOABI from 'config/abi/TEXOToken.json';
import orchestratorABI from 'config/abi/TEXOOrchestrator.json';
import { multicallRetry } from 'utils/multicall';
import { getAddress } from 'utils/addressHelpers';
import contracts from 'config/constants/contracts';
import { getSeedingPools } from 'utils/poolHelpers';

export const fetchPoolsTotalStaking = async (chainId) => {
  const seedingPools = getSeedingPools(chainId);
  const seedingPoolCalls = seedingPools.map((seedingPool) => {
    return {
      address: getAddress(seedingPool.stakingToken.address, chainId),
      name: 'balanceOf',
      params: [getAddress(contracts.orchestrator, chainId)],
    };
  });

  const seedingPoolsTotalStaked = await multicallRetry(
    tEXOABI,
    seedingPoolCalls,
    chainId,
  );

  return seedingPools.map((p, index) => ({
    ...p,
    totalStaked: new BigNumber(seedingPoolsTotalStaked[index]).toJSON(),
  }));
};

export const fetchPoolsVolatileInfo = async (chainId) => {
  const seedingPools = getSeedingPools(chainId);
  const seedingPoolCalls = seedingPools.map((seedingPool) => ({
    address: getAddress(contracts.orchestrator, chainId),
    name: 'poolInfo',
    params: [seedingPool.id],
  }));
  const seedingPoolsVolatileInfo = await multicallRetry(
    orchestratorABI,
    seedingPoolCalls,
    chainId,
  );

  return seedingPools.map((p, index) => ({
    ...p,
    allocPoint: seedingPoolsVolatileInfo[index].allocPoint.toNumber(),
  }));
};
