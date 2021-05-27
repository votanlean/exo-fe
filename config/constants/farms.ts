import tokens from './tokens'

const farms: any[] = [
  {
    pid: 11,
    icon: '/static/images/Swap_tEXO-BNB.png',
    title: 'tEXO/BNB LP',
    address: process.env.BNBLP_ADDRESS,
    token: tokens.texo,
    displayAllocPoint: 5000,
    depositFeeBP: 0,
    quoteToken: tokens.wbnb,
    bsScanLink: 'https://bscscan.com/address/' + process.env.BNBLP_ADDRESS,
  },
  {
    pid: 12,
    icon: '/static/images/Swap_tEXO-BUSD.png',
    title: 'tEXO/BUSD LP',
    lpSymbol: 'tEXO-BUSD LP',
    address: process.env.BUSDLP_ADDRESS,
    token: tokens.texo,
    displayAllocPoint: 5000,
    depositFeeBP: 0,
    quoteToken: tokens.busd,
    bsScanLink: 'https://bscscan.com/address/' + process.env.BUSDLP_ADDRESS,
  },
]

export default farms;