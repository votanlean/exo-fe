import BigNumber from 'bignumber.js'
import { Pool } from 'state/types'
import { BIG_ZERO } from 'utils/bigNumber'

import TEXOToken from './../../blockchain/build/TEXOToken.json';
import {getContract} from "../../utils/contractHelpers";

// type UserData =
//     | Pool['userData']
//     | {
//     allowance: number | string
//     stakingTokenBalance: number | string
//     stakedBalance: number | string
//     pendingReward: number | string
// }
//
// export const transformUserData = (userData: UserData) => {
//     return {
//         allowance: userData ? new BigNumber(userData.allowance) : BIG_ZERO,
//         stakingTokenBalance: userData ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO,
//         stakedBalance: userData ? new BigNumber(userData.stakedBalance) : BIG_ZERO,
//         pendingReward: userData ? new BigNumber(userData.pendingReward) : BIG_ZERO,
//     }
// }

export const transformPool = (pool: Pool): Pool => {
    const chainId = process.env.CHAIN_ID || 56;
    console.log('process.env.CHAIN_ID', process.env.CHAIN_ID);
    const {contractAddress, ...rest } = pool

    const tokenInstance = getContract(TEXOToken.abi, contractAddress[chainId]);
    console.log('contractAddress[chainId]', contractAddress[chainId]);
    return {
        tokenInstance, //TODO remove
        ...rest,
    } as Pool
}
