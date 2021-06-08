import BigNumber from 'bignumber.js';
import fAANGPools from 'config/constants/fAANGPools';
import fAANGABI from 'config/abi/FAANGToken.json';
import orchestratorABI from 'config/abi/FAANGOrchestrator.json';
import multicall from 'utils/multicall';
import { getAddress } from 'utils/addressHelpers';
import contracts from 'config/constants/contracts';

export const fetchFAANGPoolsTotalStaking = async () => {
  const fAANGPoolCalls = fAANGPools.map((pool) => {
    return {
      address: getAddress(pool.stakingToken.address),
      name: 'balanceOf',
      params: [getAddress(contracts.fAANGOrchestrator)],
    };
  });

  const fAANGPoolsTotalStaked = await multicall(fAANGABI, fAANGPoolCalls);
  return fAANGPools.map((p, index) => ({
    ...p,
    totalStaked: new BigNumber(fAANGPoolsTotalStaked[index]).toJSON(),
  }));
};

//TODO: may no need
export const fetchFAANGPoolsVolatileInfo = async () => {
  const fAANGPoolCalls = fAANGPools.map((pool) => ({
    address: getAddress(contracts.fAANGOrchestrator),
    name: 'poolInfo',
    params: [pool.id],
  }));

  const fAANGPoolsVolatileInfo = await multicall(
    orchestratorABI,
    fAANGPoolCalls,
  );

  return fAANGPools.map((p, index) => ({
    ...p,

    //FAANG pool don't have allocPoint
    // allocPoint: fAANGPoolsVolatileInfo[index].allocPoint.toNumber(),
  }));
};
