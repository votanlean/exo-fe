import { AbiItem } from 'web3-utils'
import { Interface } from '@ethersproject/abi'
import { getWeb3NoAccount } from 'utils/web3'
import MultiCallAbi from 'config/abi/Multicall.json'
import { getMulticallAddress } from 'utils/addressHelpers'
import retry, { IRetryOptions } from './retryWrapper';

interface Call {
  address: string // Address of the contract
  name: string // Function name on the contract (example: balanceOf)
  params?: any[] // Function params
}

interface IMulticallOptions {
  retryOptions?: IRetryOptions; // options pass into retry
}

const multicall = async (abi: any[], calls: Call[], chainId?: number) => {
  const web3 = getWeb3NoAccount(chainId);
  const multi = new web3.eth.Contract(MultiCallAbi as unknown as AbiItem, getMulticallAddress(chainId))
  const itf = new Interface(abi)

  const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])

  const { returnData } = await multi.methods.aggregate(calldata).call()
  const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))

  return res;
}

export const multicallRetry = (abi: any[], calls: Call[], chainId?: number, options: IMulticallOptions = {}) => {
  return retry(() => multicall(abi, calls, chainId), options.retryOptions);
}

export default multicall;
