import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { BIG_ZERO } from 'utils/bigNumber'
import useRefresh from './useRefresh'
import {useERC20, useTEXOContract} from "./useContract";
import { useNetwork } from 'state/hooks'

const useTokenBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(BIG_ZERO)
  const {id: appNetwork} = useNetwork();
  const { account, library } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const tokenContract = useERC20(tokenAddress);

  useEffect(() => {
    const fetchBalance = async () => {

      //check if the App Network and the Wallet Network is consistent
      const walletNetwork = library?.networkVersion;
      const isNetworkConsistent = Boolean(appNetwork == walletNetwork);

      if(isNetworkConsistent){
        const res = await tokenContract.methods.balanceOf(account).call()
        setBalance(new BigNumber(res))
      } else{
        setBalance(new BigNumber(null))
      }
    }
    if (account) {
      fetchBalance()
    }
  }, [account, tokenAddress, fastRefresh])
  return balance
}

export const useTotalSupply = () => {
  const { slowRefresh } = useRefresh()
  const [totalSupply, setTotalSupply] = useState<BigNumber>()
  const tEXOContract = useTEXOContract();

  useEffect(() => {
    async function fetchTotalSupply() {
      const supply = await tEXOContract.methods.totalSupply().call()
      setTotalSupply(new BigNumber(supply))
    }

    fetchTotalSupply()
  }, [slowRefresh])

  return totalSupply
}

export default useTokenBalance
