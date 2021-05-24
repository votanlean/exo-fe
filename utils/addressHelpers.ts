import contracts from 'config/constants/contracts'
import tokens from 'config/constants/tokens'
import { Address } from 'config/constants/types'

export const getAddress = (address: Address): string => {
    const mainNetChainId = 56
    const chainId = process.env.CHAIN_ID
    return address[chainId] ? address[chainId] : address[mainNetChainId]
}

export const getOrchestratorAddress = () => {
    return getAddress(contracts.orchestrator)
}

export const getTEXOAddress = () => {
    return getAddress(tokens.texo.address)
}

export const getMulticallAddress = () => {
    return getAddress(contracts.multiCall)
}
