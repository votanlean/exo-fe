import BigNumber from 'bignumber.js'
import { PoolConfig } from 'config/constants/types'

export interface PoolsState {
    data: Pool[]
}

export interface FAANGpoolsState {
    data: FAANGPool[]
}

export interface Pool extends PoolConfig {
    tokenInstance? //TODO remove
    totalStaked?: BigNumber
    stakingLimit?: BigNumber
    startBlock?: number
    endBlock?: number
    userData?: {
        allowance: BigNumber
        stakingTokenBalance: BigNumber
        stakedBalance: BigNumber
        pendingReward: BigNumber
    }
}

export interface FAANGPool extends PoolConfig {
    tokenInstance? //TODO remove
    totalStaked?: BigNumber
    stakingLimit?: BigNumber
    startBlock?: number
    endBlock?: number
    userData?: {
        allowance: BigNumber
        stakingTokenBalance: BigNumber
        stakedBalance: BigNumber
        pendingReward: BigNumber
    }
}

// Block

export interface BlockState {
    currentBlock: number
    initialBlock: number
}

export interface UserInfoState {
    tEXOReward: number
    tEXOBalance: number
}

// Global state
export interface State {
    pools: PoolsState
    block: BlockState
    userInfo: UserInfoState
    fAANGpools: FAANGpoolsState
}
