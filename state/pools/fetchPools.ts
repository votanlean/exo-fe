import BigNumber from 'bignumber.js';
import seedingPools from 'config/constants/seedingPools';
import tEXOABI from 'blockchain/build/TEXOToken.json';
import orchestratorABI from 'blockchain/build/TEXOOrchestrator.json';
import multicall from 'utils/multicall';
import { getAddress } from 'utils/addressHelpers';
import contracts from 'config/constants/contracts';

export const fetchPoolsTotalStaking = async () => {
  const seedingPoolCalls = seedingPools.map((seedingPool) => {
    return {
      address: getAddress(seedingPool.stakingToken.address),
      name: 'balanceOf',
      params: [getAddress(contracts.orchestrator)],
    }
  });

  const seedingPoolsTotalStaked = await multicall(tEXOABI.abi, seedingPoolCalls);

  return seedingPools.map((p, index) => ({
    ...p,
    totalStaked: new BigNumber(seedingPoolsTotalStaked[index]).toJSON(),
  }));
}

export const fetchPoolsVolatileInfo = async () => {
  const seedingPoolCalls = seedingPools.map((seedingPool) => ({
    address: getAddress(contracts.orchestrator),
    name: 'poolInfo',
    params: [seedingPool.id],
  }));

  const seedingPoolsVolatileInfo = await multicall(orchestratorABI.abi, seedingPoolCalls);

  return seedingPools.map((p, index) => ({
    ...p,
    allocPoint: seedingPoolsVolatileInfo[index].allocPoint.toNumber(),
  }));
}