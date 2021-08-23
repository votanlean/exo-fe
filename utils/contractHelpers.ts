import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import { getWeb3NoAccount } from 'utils/web3'

// Addresses
import {getTEXOAddress, getOrchestratorAddress, getFAANGOrchestratorAddress} from 'utils/addressHelpers'

// ABI
import orchestratorAbi from '../config/abi/TEXOOrchestrator.json';
import fAANGOrchestratorAbi from '../config/abi/FAANGOrchestrator.json';
import compiledTEXO from '../config/abi/TEXOToken.json';
import bep20Abi from '../config/abi/erc20.json';
import vaultAbi from '../config/abi/Vault.json';

const getContract = (abi: any, address: string, web3?: Web3, chainId?: number) => {
    const _web3 = web3 || getWeb3NoAccount(chainId);

    return new _web3.eth.Contract(abi as unknown as AbiItem, address)
}

export const getTEXOContract = (web3?: Web3, chainId?: number) => {
    return getContract(compiledTEXO, getTEXOAddress(chainId), web3, chainId)
}

export const getOrchestratorContract = (web3?: Web3, chainId?: number) => {
    return getContract(orchestratorAbi, getOrchestratorAddress(chainId), web3, chainId)
}

export const getFAANGOrchestratorContract = (web3?: Web3, chainId?: number) => {
    return getContract(fAANGOrchestratorAbi, getFAANGOrchestratorAddress(chainId), web3, chainId)
}

export const getBep20Contract = (address: string, web3?: Web3, chainId?: number) => {
    return getContract(bep20Abi, address, web3, chainId)
}

export const getVaultContract = (address: string, web3?: Web3 ,chainId?: number) =>{
    return getContract(vaultAbi, address, web3, chainId)
}
