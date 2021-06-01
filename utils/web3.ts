import Web3 from 'web3'
import { HttpProviderOptions } from 'web3-core-helpers'

const RPC_URL = process.env.BLOCKCHAIN_HOST
const httpProvider = new Web3.providers.HttpProvider(RPC_URL, { timeout: 10000 } as HttpProviderOptions)
const web3NoAccount = new Web3(httpProvider)

const getWeb3NoAccount = () => {
    return web3NoAccount
}

const isAddress = (address: string) => {
    return Web3.utils.isAddress(address)
}

export { getWeb3NoAccount, isAddress }
export default web3NoAccount

