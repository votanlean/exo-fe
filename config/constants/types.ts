export interface Address {
    97?: string
    56: string
}

export interface Token {
    symbol: string
    address?: Address
    decimals?: number
    projectLink?: string
}

export enum PoolIds {
    poolBasic = 'poolBasic',
    poolUnlimited = 'poolUnlimited',
}

export type IfoStatus = 'idle' | 'coming_soon' | 'live' | 'finished'

interface IfoPoolInfo {
    saleAmount: string
    raiseAmount: string
    cakeToBurn: string
    distributionRatio: number // Range [0-1]
}

export interface Ifo {
    id: string
    isActive: boolean
    address: string
    name: string
    currency: Token
    token: Token
    releaseBlockNumber: number
    articleUrl: string
    campaignId: string
    tokenOfferingPrice: number
    isV1: boolean
    [PoolIds.poolBasic]?: IfoPoolInfo
    [PoolIds.poolUnlimited]: IfoPoolInfo
}

export enum PoolCategory {
    'COMMUNITY' = 'Community',
    'CORE' = 'Core',
    'BINANCE' = 'Binance', // Pools using native BNB behave differently than pools using a token
    'AUTO' = 'Auto',
}

export interface FarmConfig {
    pid: number
    lpSymbol: string
    lpAddresses: Address
    token: Token
    quoteToken: Token
    multiplier?: string
    isCommunity?: boolean
    dual?: {
        rewardPerBlock: number
        earnLabel: string
        endBlock: number
    }
}

export interface PoolConfig {
    id: number
    stakingToken: Token
    earningToken: Token
    icon: string
    title: string
    contractAddress: Address
    address: string //TODO remove
    symbol: string
    // poolCategory: PoolCategory
    // tokenPerBlock: string
    // sortOrder?: number
    // harvest?: boolean
    // isFinished?: boolean
    // enableEmergencyWithdraw?: boolean
    bsScanLink: string //TODO remove
}
