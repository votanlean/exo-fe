import Web3 from 'web3'
import { AbiItem } from 'web3-utils'
import web3NoAccount from 'utils/web3'

// Addresses
import { getTEXOAddress, getOrchestratorAddress } from 'utils/addressHelpers'

// ABI
import compiledOrchestrator from '../blockchain/build/TEXOOrchestrator.json';
import compiledTEXO from '../blockchain/build/TEXOToken.json';
import bep20Abi from '../blockchain/build/IBEP20.json';

//TODO remove export, currently export to support contract factory transformer
export const getContract = (abi: any, address: string, web3?: Web3) => {
    const _web3 = web3 || web3NoAccount;

    return new _web3.eth.Contract(abi as unknown as AbiItem, address)
}

export const getTEXOContract = (web3?: Web3) => {
    // const config = poolsConfig.find((pool) => pool.sousId === id)
    return getContract(compiledTEXO.abi, getTEXOAddress(), web3)
}

export const getOrchestratorContract = (web3?: Web3) => {
    return getContract(compiledOrchestrator.abi, getOrchestratorAddress(), web3)
}

export const getBep20Contract = (address: string, web3?: Web3) => {
    return getContract(bep20Abi.abi, address, web3)
}
