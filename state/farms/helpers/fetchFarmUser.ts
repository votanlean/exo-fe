import BigNumber from 'bignumber.js';
import erc20ABI from 'config/abi/erc20.json';
import orchestratorABI from 'config/abi/TEXOOrchestrator.json';
import multicall from 'utils/multicall';
import { getAddress } from 'utils/addressHelpers';
import contracts from 'config/constants/contracts';

export const fetchFarmUserAllowances = async (
  account: string,
  farmsToFetch: any[],
  chainId?: number,
) => {
  const masterChefAddress = getAddress(contracts.orchestrator, chainId);

  const calls = farmsToFetch.map((farm) => ({
    address: getAddress(farm.address, chainId),
    name: 'allowance',
    params: [account, masterChefAddress],
  }));

  const rawLpAllowances = await multicall(erc20ABI, calls, chainId);
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON();
  });

  return parsedLpAllowances;
};

export const fetchFarmUserTokenBalances = async (
  account: string,
  farmsToFetch: any[],
  chainId?: number,
) => {
  const calls = farmsToFetch.map((farm) => ({
    address: getAddress(farm.address, chainId),
    name: 'balanceOf',
    params: [account],
  }));

  const rawTokenBalances = await multicall(erc20ABI, calls, chainId);
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON();
  });

  return parsedTokenBalances;
};

export const fetchFarmUserStakedBalances = async (
  account: string,
  farmsToFetch: any[],
  chainId?: number,
) => {
  const masterChefAddress = getAddress(contracts.orchestrator, chainId);

  const calls = farmsToFetch.map((farm) => {
    return {
      address: masterChefAddress,
      name: 'userInfo',
      params: [farm.pid, account],
    };
  });

  const rawStakedBalances = await multicall(orchestratorABI, calls, chainId);
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON();
  });
  return parsedStakedBalances;
};

export const fetchFarmUserEarnings = async (
  account: string,
  farmsToFetch: any[],
  chainId?: number,
) => {
  const calls = farmsToFetch.map((farm) => {
    return {
      address: getAddress(contracts.orchestrator, chainId),
      name: 'pendingTEXO',
      params: [farm.pid, account],
    };
  });

  const rawEarnings = await multicall(orchestratorABI, calls, chainId);

  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON();
  });

  return parsedEarnings;
};
