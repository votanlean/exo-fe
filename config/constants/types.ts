import BigNumber from "bignumber.js";

export interface Address {
  97?: string
  56?: string
  5600?: string
  137?: string
  80001?: string
}

export interface Decimals {
  97?: number
  56?: number
  5600?: number
  137?: number
  80001?: number
}

export interface Token {
  symbol: string
  address: Address
  decimals: number
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

export interface Farm extends FarmConfig {
  tokenAmountMc?: BigNumber
  quoteTokenAmountMc?: BigNumber
  tokenAmountTotal?: BigNumber
  quoteTokenAmountTotal?: BigNumber
  lpTotalInQuoteToken?: BigNumber
  lpTotalSupply?: BigNumber
  tokenPriceVsQuote?: BigNumber
  poolWeight?: BigNumber
  userData?: {
    allowance: string
    tokenBalance: string
    stakedBalance: string
    earnings: string
  }
}

export interface PoolConfig {
  id: number
  stakingToken: Token
  earningToken: Token
  icon: string
  title: string
  contractAddress: Address
  symbol: string
  // poolCategory: PoolCategory
  // tokenPerBlock: string
  // sortOrder?: number
  // harvest?: boolean
  // isFinished?: boolean
  // enableEmergencyWithdraw?: boolean
  // bsScanLink: string //TODO remove
}
