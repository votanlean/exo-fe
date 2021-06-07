import BigNumber from 'bignumber.js';
import fAANGPools from 'config/constants/fAANGPools';
import fAANGABI from 'blockchain/build/FAANGToken.json';
import orchestratorABI from 'blockchain/build/FAANGOrchestrator.json';
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

  const fAANGPoolsTotalStaked = await multicall(fAANGABI.abi, fAANGPoolCalls);

  return fAANGPools.map((p, index) => ({
    ...p,
    totalStaked: new BigNumber(fAANGPoolsTotalStaked[index]).toJSON(),
  }));
};

export const fetchFAANGPoolsVolatileInfo = async () => {
  const fAANGPoolCalls = fAANGPools.map((pool) => ({
    address: getAddress(contracts.fAANGOrchestrator),
    name: 'poolInfo',
    params: [pool.id],
  }));

  const fAANGPoolsVolatileInfo = await multicall(
    orchestratorABI.abi,
    fAANGPoolCalls,
  );

  return fAANGPools.map((p, index) => ({
    ...p,
    allocPoint: fAANGPoolsVolatileInfo[index].allocPoint.toNumber(),
  }));
};
