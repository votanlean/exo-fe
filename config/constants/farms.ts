import tokens from './tokens'

const farms: any[] = [
  {
    pid: 11,
    icon: '/static/images/Swap_tEXO-BNB.png',
    symbol: 'tEXO/BNB LP',
    title: 'tEXO/BNB LP',
    address: process.env.BNBLP_ADDRESS,
    token: tokens.texo,
    displayAllocPoint: 5000,
    depositFeeBP: 0,
    quoteToken: {
      address: {
        56: process.env.WBNB_ADDRESS,
        97: process.env.WBNB_ADDRESS,
      }
    },
    bsScanLink: 'https://bscscan.com/address/' + process.env.BNBLP_ADDRESS,
  },
  {
    pid: 12,
    icon: '/static/images/Swap_tEXO-BUSD.png',
    symbol: 'tEXO/BUSD LP',
    title: 'tEXO/BUSD LP',
    lpSymbol: 'tEXO-BUSD LP',
    address: process.env.BUSDLP_ADDRESS,
    token: tokens.texo,
    displayAllocPoint: 5000,
    depositFeeBP: 0,
    quoteToken: {
      address: {
        56: process.env.BUSD_ADDRESS,
        97: process.env.BUSD_ADDRESS,
      }
    },
    bsScanLink: 'https://bscscan.com/address/' + process.env.BUSDLP_ADDRESS,
  },
]

export default farms;
