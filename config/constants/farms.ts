import tokens from './tokens';


export const bnbFarms: any[] = [
  {
    pid: 11,
    icon: '/static/images/Swap_tEXO-BNB.png',
    symbol: 'tEXO/BNB LP',
    title: 'tEXO/BNB LP',
    address: {
      56: '0x47097FA3c60E3Da49f717D5D43b4331C936d10ee',
      97: '0x7Dc1917631e2DA181b4Fd355d590125DeC8C71dA',
    },
    token: tokens.texo,
    displayAllocPoint: 5000,
    depositFeeBP: 0,
    quoteToken: tokens.wbnb,
    decimals: {
      56: 18,
      97: 18,
    },
    liquidityLink: 'https://exchange.pancakeswap.finance/#/add/BNB/',
  },
  {
    pid: 12,
    icon: '/static/images/Swap_tEXO-BUSD.png',
    symbol: 'tEXO/BUSD LP',
    title: 'tEXO/BUSD LP',
    lpSymbol: 'tEXO-BUSD LP',
    address: {
      56: '0x849bf0733FF71977B4B1871Ae46a73C3Dbc37Cae',
      97: '0x62F36aA22a5DA1c8cD61A004eD7f17a6029B6539',
    },
    token: tokens.texo,
    displayAllocPoint: 5000,
    depositFeeBP: 0,
    quoteToken: tokens.busd,
    decimals: {
      56: 18,
      97: 18,
    },
    liquidityLink: 'https://exchange.pancakeswap.finance/#/add/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/',
  },
];

export const polygonFarms: any[] = [
  {
    pid: 10,
    icon: '/static/images/polygon-farm/tEXO-MATIC.png',
    symbol: 'tEXO/wMATIC LP',
    title: 'tEXO/wMATIC LP',
    lpSymbol: 'tEXO-wMATIC LP',
    address: {
      137: '0x6ba88e0ac0e85a7d3d3f203f694bea24c231c5c0',
      80001: '0x3B7096cF713E147BbF5aEDE30BB2ADa4405B5130',
    },
    token: tokens.texo,
    displayAllocPoint: 5000,
    depositFeeBP: 0,
    quoteToken: tokens.wmatic,
    decimals: {
      137: 18,
      80001: 18,
    },
    liquidityLink: 'https://quickswap.exchange/#/add/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270/',
  },
  {
    pid: 11,
    icon: '/static/images/polygon-farm/tEXO-USDC.png',
    symbol: 'tEXO/USDC LP',
    title: 'tEXO/USDC LP',
    address: {
      137: '0x96caf7ea8ff36cfcdb3d62c19972ae9b5d9fff7b',
      80001: '0x60B7cc009DD9eEC10176349c91F3F4A3FFD7120A',
    },
    token: tokens.texo,
    displayAllocPoint: 5000,
    depositFeeBP: 0,
    quoteToken: tokens.usdc,
    decimals: {
      137: 18,
      80001: 18,
    },
    liquidityLink: 'https://quickswap.exchange/#/add/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/',
  },
  
];
