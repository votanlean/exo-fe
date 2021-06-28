import BigNumber from 'bignumber.js';
import tEXOABI from 'config/abi/TEXOToken.json';
import orchestratorABI from 'config/abi/TEXOOrchestrator.json';
import multicall from 'utils/multicall';
import { getAddress } from 'utils/addressHelpers';
import contracts from 'config/constants/contracts';
import { getSeedingPools } from 'utils/poolHelpers';
import { useNetwork } from 'state/hooks';

export const fetchPoolsTotalStaking = async (chainId) => {
  const seedingPools = getSeedingPools(chainId);
  const seedingPoolCalls = seedingPools.map((seedingPool) => {
    return {
      address: getAddress(seedingPool.stakingToken.address, chainId),
      name: 'balanceOf',
      params: [getAddress(contracts.orchestrator, chainId)],
    };
  });

  const seedingPoolsTotalStaked = await multicall(
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
  const seedingPoolsVolatileInfo = await multicall(
    orchestratorABI,
    seedingPoolCalls,
    chainId,
  );

  return seedingPools.map((p, index) => ({
    ...p,
    allocPoint: seedingPoolsVolatileInfo[index].allocPoint.toNumber(),
  }));
};
