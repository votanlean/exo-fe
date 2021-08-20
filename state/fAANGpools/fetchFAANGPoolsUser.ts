import fAANGOrchestratorABI from '../../config/abi/FAANGOrchestrator.json';
import erc20ABI from 'config/abi/erc20.json';
import { multicallRetry } from 'utils/multicall';
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
    address: getAddress(p.stakingToken.address, chainId),
    name: 'allowance',
    params: [userAddress, getAddress(contracts.fAANGOrchestrator, chainId)],
  }));

  const allowances = await multicallRetry(erc20ABI, calls, chainId);

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
    address: getAddress(p.stakingToken.address, chainId),
    name: 'balanceOf',
    params: [userAddress],
  }));

  const tokenBalancesRaw = await multicallRetry(erc20ABI, calls, chainId);

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
    address: getAddress(contracts.fAANGOrchestrator, chainId),
    name: 'userInfo',
    params: [p.id, userAddress],
  }));

  const userInfo = await multicallRetry(fAANGOrchestratorABI, calls, chainId);

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
    address: getAddress(contracts.fAANGOrchestrator, chainId),
    name: 'pendingFAANG',
    params: [p.id, userAddress],
  }));

  const res = await multicallRetry(fAANGOrchestratorABI, calls, chainId);

  const pendingRewards = fAANGPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.id]: new BigNumber(res[index]).toJSON(),
    }),
    {},
  );

  return pendingRewards;
};
