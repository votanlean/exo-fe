import BigNumber from 'bignumber.js'
import poolsConfig from 'config/constants/pools'
// import sousChefABI from 'config/abi/sousChef.json'
import tEXOABI from 'config/abi/TEXOToken.json'
// import wbnbABI from 'config/abi/weth.json'
import multicall from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { getSouschefV2Contract } from 'utils/contractHelpers'

// export const fetchPoolsBlockLimits = async () => {
//   const poolsWithEnd = poolsConfig.filter((p) => p.id !== 0)
//   const callsStartBlock = poolsWithEnd.map((poolConfig) => {
//     return {
//       address: getAddress(poolConfig.contractAddress),
//       name: 'startBlock',
//     }
//   })
//   const callsEndBlock = poolsWithEnd.map((poolConfig) => {
//     return {
//       address: getAddress(poolConfig.contractAddress),
//       name: 'bonusEndBlock',
//     }
//   })
//
//   const starts = await multicall(sousChefABI, callsStartBlock)
//   const ends = await multicall(sousChefABI, callsEndBlock)
//
//   return poolsWithEnd.map((cakePoolConfig, index) => {
//     const startBlock = starts[index]
//     const endBlock = ends[index]
//     return {
//       id: cakePoolConfig.id,
//       startBlock: new BigNumber(startBlock).toJSON(),
//       endBlock: new BigNumber(endBlock).toJSON(),
//     }
//   })
// }

export const fetchPoolsTotalStaking = async () => {
  const nonBnbPools = poolsConfig.filter((p) => p.stakingToken.symbol !== 'BNB')
  // const bnbPool = poolsConfig.filter((p) => p.stakingToken.symbol === 'BNB')

  const callsNonBnbPools = nonBnbPools.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.stakingToken.address),
      name: 'balanceOf',
      params: [getAddress(poolConfig.contractAddress)],
    }
  })

  // const callsBnbPools = bnbPool.map((poolConfig) => {
  //   return {
  //     address: getWbnbAddress(),
  //     name: 'balanceOf',
  //     params: [getAddress(poolConfig.contractAddress)],
  //   }
  // })

  const nonBnbPoolsTotalStaked = await multicall(tEXOABI, callsNonBnbPools)
  // const bnbPoolsTotalStaked = await multicall(wbnbABI, callsBnbPools)

  return [
    ...nonBnbPools.map((p, index) => ({
      id: p.id,
      totalStaked: new BigNumber(nonBnbPoolsTotalStaked[index]).toJSON(),
    })),
    // ...bnbPool.map((p, index) => ({
    //   id: p.id,
    //   totalStaked: new BigNumber(bnbPoolsTotalStaked[index]).toJSON(),
    // })),
  ]
}

// export const fetchPoolStakingLimit = async (id: number): Promise<BigNumber> => {
//   try {
//     const sousContract = getSouschefV2Contract(id)
//     const stakingLimit = await sousContract.methods.poolLimitPerUser().call()
//     return new BigNumber(stakingLimit)
//   } catch (error) {
//     return BIG_ZERO
//   }
// }
//
// export const fetchPoolsStakingLimits = async (
//   poolsWithStakingLimit: number[],
// ): Promise<{ [key: string]: BigNumber }> => {
//   const validPools = poolsConfig
//     .filter((p) => p.stakingToken.symbol !== 'BNB' && !p.isFinished)
//     .filter((p) => !poolsWithStakingLimit.includes(p.id))
//
//   // Get the staking limit for each valid pool
//   // Note: We cannot batch the calls via multicall because V1 pools do not have "poolLimitPerUser" and will throw an error
//   const stakingLimitPromises = validPools.map((validPool) => fetchPoolStakingLimit(validPool.id))
//   const stakingLimits = await Promise.all(stakingLimitPromises)
//
//   return stakingLimits.reduce((accum, stakingLimit, index) => {
//     return {
//       ...accum,
//       [validPools[index].id]: stakingLimit,
//     }
//   }, {})
// }
