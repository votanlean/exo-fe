import tokens from './tokens';

export const bnbFarms: any[] = [
  {
    pid: 11,
    icon: '/static/images/Swap_tEXO-BNB.png',
    symbol: 'tEXO/BNB LP',
    title: 'tEXO/BNB LP',
    address: {
      56: '0x572274F3f1a2d4016d85EB1BA2c4DA671805218e',
      5600: '0x572274F3f1a2d4016d85EB1BA2c4DA671805218e',
      97: '0x7Dc1917631e2DA181b4Fd355d590125DeC8C71dA',
    },
    token: tokens.texo,
    displayAllocPoint: 5000,
    depositFeeBP: 0,
    quoteToken: tokens.wbnb,
    decimals: {
      56: 18,
      5600: 18,
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
      56: '0x19F4F3Cdaae6923b387566161a10Dc517a0D11aF',
      5600: '0x19F4F3Cdaae6923b387566161a10Dc517a0D11aF',
      97: '0x62F36aA22a5DA1c8cD61A004eD7f17a6029B6539',
    },
    token: tokens.texo,
    displayAllocPoint: 5000,
    depositFeeBP: 0,
    quoteToken: tokens.busd,
    decimals: {
      56: 18,
      5600: 18,
      97: 18,
    },
    liquidityLink:
      'https://exchange.pancakeswap.finance/#/add/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/',
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
      137: '0x64005aAA879BF0882b93A9360d57Be53305d6EE7',
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
    liquidityLink:
      'https://quickswap.exchange/#/add/0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270/',
  },
  {
    pid: 11,
    icon: '/static/images/polygon-farm/tEXO-USDC.png',
    symbol: 'tEXO/USDC LP',
    title: 'tEXO/USDC LP',
    address: {
      137: '0x818a2465759c2163041904626b806b2f35e39500',
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
    liquidityLink:
      'https://quickswap.exchange/#/add/0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174/',
  },
];
