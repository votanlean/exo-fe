import tokens from './tokens'
import { PoolConfig, PoolCategory } from './types'

const pools: PoolConfig[] = [
  //TODO move tEXO to tokens 0 (master pool)
    // {
    //     sousId: 0,
    //     stakingToken: tokens.busd,
    //     earningToken: tokens.texo,
    //     contractAddress: {
    //         97: '0xd3af5fe61dbaf8f73149bfcfa9fb653ff096029a',
    //         56: '0x73feaa1eE314F8c655E354234017bE2193C9E24E',
    //     },
    //     poolCategory: PoolCategory.CORE,
    //     harvest: true,
    //     tokenPerBlock: '10',
    //     sortOrder: 1,
    //     isFinished: false,
    // },
    {
        id: 0,
        stakingToken: tokens.usdt,
        earningToken: tokens.texo,
        icon: '/static/images/pool/USDT.png',
        title: 'USDT Pool',
        address: process.env.USDT_ADDRESS,
        contractAddress: {
            97: '0xdA181fE906Ee2ee23042B73fb0691086bF64e0f9',
            56: '0xCDd465F275501660B469979E2D2c1aB266d1cE9d',
        },
        symbol: 'USDT',
        bsScanLink: 'https://bscscan.com/address/' + process.env.USDT_ADDRESS,
        //TODO move bsScan to transformer
    },
]

export default pools
