import { AbiItem } from 'web3-utils'
import { Interface } from '@ethersproject/abi'
import { getWeb3NoAccount } from 'utils/web3'
import MultiCallAbi from 'config/abi/Multicall.json'
import { getMulticallAddress } from 'utils/addressHelpers'

interface Call {
    address: string // Address of the contract
    name: string // Function name on the contract (example: balanceOf)
    params?: any[] // Function params
}

const multicall = async (abi: any[], calls: Call[]) => {
    const web3 = getWeb3NoAccount()
    const multi = new web3.eth.Contract(MultiCallAbi as unknown as AbiItem, getMulticallAddress())
    const itf = new Interface(abi)

    const calldata = calls.map((call) => [call.address.toLowerCase(), itf.encodeFunctionData(call.name, call.params)])
    console.log('calldata', calldata);
    console.log('calldata json', calldata);

    const { returnData } = await multi.methods.aggregate(calldata).call()
    console.log('returnData', returnData);
    const res = returnData.map((call, i) => itf.decodeFunctionResult(calls[i].name, call))

    return res
}

export default multicall
