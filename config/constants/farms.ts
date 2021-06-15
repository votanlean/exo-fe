import tokens from './tokens';

const farms: any[] = [
  {
    pid: 11,
    icon: '/static/images/Swap_tEXO-BNB.png',
    symbol: 'tEXO/BNB LP',
    title: 'tEXO/BNB LP',
    address: {
      56: '0x572274F3f1a2d4016d85EB1BA2c4DA671805218e',
      97: '0x7Dc1917631e2DA181b4Fd355d590125DeC8C71dA',
    },
    token: tokens.texo,
    displayAllocPoint: 5000,
    depositFeeBP: 0,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 12,
    icon: '/static/images/Swap_tEXO-BUSD.png',
    symbol: 'tEXO/BUSD LP',
    title: 'tEXO/BUSD LP',
    lpSymbol: 'tEXO-BUSD LP',
    address: {
      56: '0x19F4F3Cdaae6923b387566161a10Dc517a0D11aF',
      97: '0x62F36aA22a5DA1c8cD61A004eD7f17a6029B6539',
    },
    token: tokens.texo,
    displayAllocPoint: 5000,
    depositFeeBP: 0,
    quoteToken: tokens.busd,
  },
];

export default farms;
