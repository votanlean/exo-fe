import BigNumber from 'bignumber.js'
import { PoolConfig } from 'config/constants/types'

export interface Network {
    id: number,
    name: string,
    rpcUrl: string,
    symbol: string,
    blockExplorerName: string,
    blockExplorerUrl: string,
    icon: string,
    iconDisable: string,
    type: string,
    decimals: number,
    startBlock: string,
    secondsPerBlock: number
    swapLink: string
}

export interface TEXOOrchestratorState {
    data: {
        tEXOPerBlock,
        totalAllocPoint,
        seedingStartBlock,
        canClaimRewardsBlock,
        seedingFinishBlock,
        farmStartBlock
    },
}

export interface FAANGOrchestratorState {
    data: {
        FAANGFinishBlock: number,
    },
}

export interface AppPrices {
    data: {
        data: [],
        updatedAt: string
    },
}

export interface TexoToken {
    data: {
        totalSupply: string,
        tEXOBurned: string,
    },
}

export interface PoolsState {
    data: Pool[]
}

export interface FAANGpoolsState {
    data: FAANGPool[]
}

export interface Pool extends PoolConfig {
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

export interface Theme {
    darkMode: boolean
}

// Global state
export interface State {
    network: Network,
    appPrices: AppPrices,
    texoToken: TexoToken,
    orchestrator: TEXOOrchestratorState
    pools: PoolsState
    block: BlockState
    userInfo: UserInfoState
    fAANGpools: FAANGpoolsState
    FAANGOrchestrator: FAANGOrchestratorState,
    theme: Theme
}
