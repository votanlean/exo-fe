import Web3 from 'web3'
import { HttpProviderOptions } from 'web3-core-helpers'
import getNodeUrl from './getRpcUrl';

const getWeb3NoAccount = (chainId?: number, rpcUrl?: string) => {
  const httpProvider = new Web3.providers.HttpProvider(
    rpcUrl ? rpcUrl : getNodeUrl(chainId),
    { timeout: 10000 } as HttpProviderOptions
  )
  const web3NoAccount = new Web3(httpProvider)
  return web3NoAccount
}

const isAddress = (address: string) => {
  return Web3.utils.isAddress(address)
}

export { getWeb3NoAccount, isAddress }
