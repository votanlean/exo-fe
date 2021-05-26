import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import orchestratorABI from 'blockchain/build/TEXOOrchestrator.json';
import multicall from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import contracts from 'config/constants/contracts';

export const fetchFarmUserAllowances = async (account: string, farmsToFetch: any[]) => {
  const masterChefAddress = getAddress(contracts.orchestrator);

  const calls = farmsToFetch.map((farm) => ({
    address: farm.address,
    name: 'allowance',
    params: [account, masterChefAddress],
  }));

  const rawLpAllowances = await multicall(erc20ABI, calls);
  const parsedLpAllowances = rawLpAllowances.map((lpBalance) => {
    return new BigNumber(lpBalance).toJSON();
  });

  return parsedLpAllowances;
}

export const fetchFarmUserTokenBalances = async (account: string, farmsToFetch: any[]) => {
  const calls = farmsToFetch.map((farm) => ({
    address: farm.address,
    name: 'balanceOf',
    params: [account],
  }));

  const rawTokenBalances = await multicall(erc20ABI, calls)
  const parsedTokenBalances = rawTokenBalances.map((tokenBalance) => {
    return new BigNumber(tokenBalance).toJSON()
  })
  return parsedTokenBalances
}

export const fetchFarmUserStakedBalances = async (account: string, farmsToFetch: any[]) => {
  const masterChefAddress = getAddress(contracts.orchestrator);

  const calls = farmsToFetch.map((farm) => {
    return {
      address: masterChefAddress,
      name: 'userInfo',
      params: [farm.pid, account],
    }
  })

  const rawStakedBalances = await multicall(orchestratorABI.abi, calls)
  const parsedStakedBalances = rawStakedBalances.map((stakedBalance) => {
    return new BigNumber(stakedBalance[0]._hex).toJSON()
  })
  return parsedStakedBalances
}

export const fetchFarmUserEarnings = async (account: string, farmsToFetch: any[]) => {
  const calls = farmsToFetch.map((farm) => {
    return {
      address: getAddress(contracts.orchestrator),
      name: 'pendingTEXO',
      params: [farm.pid, account],
    }
  })

  const rawEarnings = await multicall(orchestratorABI.abi, calls);

  const parsedEarnings = rawEarnings.map((earnings) => {
    return new BigNumber(earnings).toJSON()
  });

  console.log('parsedEarnings', parsedEarnings);

  return parsedEarnings;
}
