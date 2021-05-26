import seedingPools from 'config/constants/seedingPools';
import orchestratorABI from '../../config/abi/TEXOOrchestrator.json';
import erc20ABI from 'config/abi/erc20.json';
import multicall from 'utils/multicall';
import { getAddress } from 'utils/addressHelpers';
import BigNumber from 'bignumber.js';
import contracts from 'config/constants/contracts';

export const fetchPoolsAllowance = async (userAddress) => {
  const calls = seedingPools.map((p) => ({
    address: getAddress(p.stakingToken.address),
    name: 'allowance',
    params: [userAddress, getAddress(contracts.orchestrator)],
  }));

  const allowances = await multicall(erc20ABI, calls);

  return seedingPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.id]: new BigNumber(allowances[index]).toJSON(),
    }),
    {},
  )
}

export const fetchUserBalances = async (userAddress) => {
  const calls = seedingPools.map((p) => ({
    address: getAddress(p.stakingToken.address),
    name: 'balanceOf',
    params: [userAddress],
  }));

  const tokenBalancesRaw = await multicall(erc20ABI, calls);

  const tokenBalances = seedingPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.id]: new BigNumber(tokenBalancesRaw[index]).toJSON(),
    }),
    {},
  );

  return tokenBalances;
}

export const fetchUserStakeBalances = async (userAddress) => {
  const calls = seedingPools.map((p) => ({
    address: getAddress(contracts.orchestrator),
    name: 'userInfo',
    params: [p.id, userAddress],
  }));

  const userInfo = await multicall(orchestratorABI, calls)

  const stakedBalances = seedingPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.id]: new BigNumber(userInfo[index].amount._hex).toJSON(),
    }),
    {},
  );

  return stakedBalances;
}

export const fetchUserPendingRewards = async (userAddress) => {
  const calls = seedingPools.map((p) => ({
    address: getAddress(contracts.orchestrator),
    name: 'pendingTEXO',
    params: [p.id, userAddress],
  }));

  const res = await multicall(orchestratorABI, calls);

  const pendingRewards = seedingPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.id]: new BigNumber(res[index]).toJSON(),
    }),
    {},
  );

  return pendingRewards;
}
