import { AbiItem } from 'web3-utils'
import poolsConfig from 'config/constants/pools'
import orchestratorABI from '../../config/abi/TEXOOrchestrator.json'
import tEXOABI from '../../blockchain/build/TEXOToken.json'
import erc20ABI from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import { getAddress, getOrchestratorAddress } from 'utils/addressHelpers'
import { getWeb3NoAccount } from 'utils/web3'
import BigNumber from 'bignumber.js'
import { getContract } from '../../utils/contractHelpers'

// Pool 0, Cake / Cake is a different kind of contract (master chef)
// BNB pools use the native BNB token (wrapping ? unwrapping is done at the contract level)
const nonBnbPools = poolsConfig.filter((p) => p.stakingToken.symbol !== 'BNB')
// const bnbPools = poolsConfig.filter((p) => p.stakingToken.symbol === 'BNB')

//TODO handle pool 0, should it be tEXO?

// const nonMasterPools = poolsConfig.filter((p) => p.id !== 0)
const web3 = getWeb3NoAccount()

export const fetchPoolsAllowance = async (account) => {
  const calls = nonBnbPools.map((p) => ({
    address: getAddress(p.stakingToken.address),
    name: 'allowance',
    params: [account, getAddress(p.contractAddress)],
  }))

  const allowances = await multicall(erc20ABI, calls)
  return nonBnbPools.reduce(
    (acc, pool, index) => ({ ...acc, [pool.id]: new BigNumber(allowances[index]).toJSON() }),
    {},
  )
}

export const fetchUserBalances = async (account) => {
  // Non BNB pools
  const calls = nonBnbPools.map((p) => ({
    address: getAddress(p.stakingToken.address),
    name: 'balanceOf',
    params: [account],
  }))
  const tokenBalancesRaw = await multicall(erc20ABI, calls)
  const tokenBalances = nonBnbPools.reduce(
    (acc, pool, index) => ({ ...acc, [pool.id]: new BigNumber(tokenBalancesRaw[index]).toJSON() }),
    {},
  )

  // BNB pools
  // const bnbBalance = await web3.eth.getBalance(account)
  // const bnbBalances = bnbPools.reduce(
  //   (acc, pool) => ({ ...acc, [pool.id]: new BigNumber(bnbBalance).toJSON() }),
  //   {},
  // )

  return { ...tokenBalances,
    // ...bnbBalances
  }
}

export const fetchUserStakeBalances = async (account) => {
  const calls = nonBnbPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'userInfo',
    params: [p.id, account],
  }))
  const userInfo = await multicall(orchestratorABI, calls)
  const stakedBalances = nonBnbPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.id]: new BigNumber(userInfo[index].amount._hex).toJSON(),
    }),
    {},
  )

  // tEXO / tEXO pool
  // const { amount: masterPoolAmount } = await masterChefContract.methods.userInfo('0', account).call()
  return { ...stakedBalances
    // , 0: new BigNumber(masterPoolAmount).toJSON()
  }
}


//TODO: check if pending reward valid usecase

export const fetchUserPendingRewards = async (account) => {
  const calls = nonBnbPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'pendingTEXO',
    params: [p.id, account],
  }))
  const res = await multicall(orchestratorABI, calls)
  const pendingRewards = nonBnbPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.id]: new BigNumber(res[index]).toJSON(),
    }),
    {},
  )

  // tEXO / tEXO pool
  // const pendingReward = await orchestratorContract.methods.pendingTEXO('0', account).call()

  return { ...pendingRewards,
    // 0: new BigNumber(pendingReward).toJSON()
  }
}
