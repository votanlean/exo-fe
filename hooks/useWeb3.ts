import Web3 from 'web3';
import { useEffect, useRef, useState } from 'react';
import { getWeb3NoAccount } from '../utils/web3';
import { HttpProviderOptions } from 'web3-core-helpers'
import { useWallet } from '@binance-chain/bsc-use-wallet';
import { provider as ProviderType } from 'web3-core'
/**
 * Provides a web3 instance using the provider provided by useWallet
 * with a fallback of an httpProver
 * Recreate web3 instance only if the ethereum provider change
 */
const useWeb3 = () => {
  const RPC_URL = process.env.BLOCKCHAIN_HOST;
  const httpProvider = new Web3.providers.HttpProvider(RPC_URL, { timeout: 10000 } as HttpProviderOptions)

  const { ethereum }: { ethereum: ProviderType } = useWallet();
  const refEth = useRef(ethereum);
  const [web3, setWeb3] = useState(new Web3(ethereum || httpProvider))

  useEffect(() => {
    if (ethereum !== refEth.current) {
      setWeb3(ethereum ? new Web3(ethereum) : getWeb3NoAccount());
      refEth.current = ethereum;
    }
  }, [ethereum]);

  return web3;
}

export default useWeb3;
