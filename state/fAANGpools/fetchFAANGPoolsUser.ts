import fAANGOrchestratorABI from '../../config/abi/FAANGOrchestrator.json';
import erc20ABI from 'config/abi/erc20.json';
import multicall from 'utils/multicall';
import { getAddress } from 'utils/addressHelpers';
import BigNumber from 'bignumber.js';
import contracts from 'config/constants/contracts';
import { getFAANGPools } from 'utils/poolHelpers';

export const fetchFAANGPoolsAllowance = async (
  userAddress,
  chainId: number,
) => {
  const fAANGPools = getFAANGPools(chainId);
  const calls = fAANGPools.map((p) => ({
    address: getAddress(p.stakingToken.address),
    name: 'allowance',
    params: [userAddress, getAddress(contracts.fAANGOrchestrator)],
  }));

  const allowances = await multicall(erc20ABI, calls);

  return fAANGPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.id]: new BigNumber(allowances[index]).toJSON(),
    }),
    {},
  );
};

export const fetchFAANGUserBalances = async (userAddress, chainId: number) => {
  const fAANGPools = getFAANGPools(chainId);
  const calls = fAANGPools.map((p) => ({
    address: getAddress(p.stakingToken.address),
    name: 'balanceOf',
    params: [userAddress],
  }));

  const tokenBalancesRaw = await multicall(erc20ABI, calls);

  const tokenBalances = fAANGPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.id]: new BigNumber(tokenBalancesRaw[index]).toJSON(),
    }),
    {},
  );

  return tokenBalances;
};

export const fetchFAANGUserStakeBalances = async (
  userAddress,
  chainId: number,
) => {
  const fAANGPools = getFAANGPools(chainId);
  const calls = fAANGPools.map((p) => ({
    address: getAddress(contracts.fAANGOrchestrator),
    name: 'userInfo',
    params: [p.id, userAddress],
  }));

  const userInfo = await multicall(fAANGOrchestratorABI, calls);

  const stakedBalances = fAANGPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.id]: new BigNumber(userInfo[index].amount._hex).toJSON(),
    }),
    {},
  );

  return stakedBalances;
};

export const fetchFAANGUserPendingRewards = async (
  userAddress,
  chainId: number,
) => {
  const fAANGPools = getFAANGPools(chainId);
  const calls = fAANGPools.map((p) => ({
    address: getAddress(contracts.fAANGOrchestrator),
    name: 'pendingFAANG',
    params: [p.id, userAddress],
  }));

  const res = await multicall(fAANGOrchestratorABI, calls);

  const pendingRewards = fAANGPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.id]: new BigNumber(res[index]).toJSON(),
    }),
    {},
  );

  return pendingRewards;
};
