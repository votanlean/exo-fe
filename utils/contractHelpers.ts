import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import web3NoAccount from 'utils/web3'

// Addresses
import {getTEXOAddress, getOrchestratorAddress, getFAANGOrchestratorAddress} from 'utils/addressHelpers'

// ABI
import orchestratorAbi from '../config/abi/TEXOOrchestrator.json';
import fAANGOrchestratorAbi from '../config/abi/FAANGOrchestrator.json';
import compiledTEXO from '../config/abi/TEXOToken.json';
import bep20Abi from '../config/abi/erc20.json';

const getContract = (abi: any, address: string, web3?: Web3) => {
    const _web3 = web3 || web3NoAccount;

    return new _web3.eth.Contract(abi as unknown as AbiItem, address)
}

export const getTEXOContract = (web3?: Web3) => {
    return getContract(compiledTEXO, getTEXOAddress(), web3)
}

export const getOrchestratorContract = (web3?: Web3) => {
    return getContract(orchestratorAbi, getOrchestratorAddress(), web3)
}

export const getFAANGOrchestratorContract = (web3?: Web3) => {
    return getContract(fAANGOrchestratorAbi, getFAANGOrchestratorAddress(), web3)
}

export const getBep20Contract = (address: string, web3?: Web3) => {
    return getContract(bep20Abi, address, web3)
}
