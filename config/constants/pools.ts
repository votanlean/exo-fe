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
            97: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
            56: '0x55d398326f99059ff775485246999027b3197955',
        },
        symbol: 'USDT',
        bsScanLink: 'https://bscscan.com/address/' + process.env.USDT_ADDRESS,
    },
]

export default pools
