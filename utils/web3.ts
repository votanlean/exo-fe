import Web3 from 'web3'
import { HttpProviderOptions } from 'web3-core-helpers'
// import { networks } from 'config/constants/walletData';
import { Network } from 'state/types'
import { getNetworks } from './networkHelpers'

const networks = getNetworks();

const getWeb3NoAccount = (chainId?: number) => {
    const network = networks.find(network => network.id === chainId)
    const rpcUrl = network.rpcUrl
    const httpProvider = new Web3.providers.HttpProvider(rpcUrl, { timeout: 10000 } as HttpProviderOptions)
    const web3NoAccount = new Web3(httpProvider)
    return web3NoAccount
}

const isAddress = (address: string) => {
    return Web3.utils.isAddress(address)
}

export { getWeb3NoAccount, isAddress }
