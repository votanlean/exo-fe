import BigNumber from 'bignumber.js'
import {FAANGPool} from 'state/types'
import { BIG_ZERO } from 'utils/bigNumber'

type UserData =
    | FAANGPool['userData']
    | {
    allowance: number | string
    stakingTokenBalance: number | string
    stakedBalance: number | string
    pendingReward: number | string
}

export const transformUserData = (userData: UserData) => {
    return {
        allowance: userData ? new BigNumber(userData.allowance) : BIG_ZERO,
        stakingTokenBalance: userData ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO,
        stakedBalance: userData ? new BigNumber(userData.stakedBalance) : BIG_ZERO,
        pendingReward: userData ? new BigNumber(userData.pendingReward) : BIG_ZERO,
    }
}

export const transformFAANGPool = (pool: FAANGPool): FAANGPool => {
    const { totalStaked, userData, ...rest } = pool

    return {
        ...rest,
        userData: transformUserData(userData),
        totalStaked: new BigNumber(totalStaked),
    } as FAANGPool
}
