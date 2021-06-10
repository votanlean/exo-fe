import { useEffect, useState } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { BIG_ZERO } from 'utils/bigNumber'
import useRefresh from './useRefresh'
import {useERC20, useTEXOContract} from "./useContract";

const useTokenBalance = (tokenAddress: string) => {
  const [balance, setBalance] = useState(BIG_ZERO)
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const tokenContract = useERC20(tokenAddress);

  useEffect(() => {
    const fetchBalance = async () => {
      const res = await tokenContract.methods.balanceOf(account).call()
      setBalance(new BigNumber(res))
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
