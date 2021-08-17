import tokens from './tokens';

export const bnbFarms: any[] = [
  {
    pid: 11,
    icon: '/static/images/Swap_tEXO-BNB.png',
    symbol: 'tEXO/BNB LP',
    vaultSymbol: 'bftEXO/BNB',
    title: 'tEXO/BNB LP',
    address: {
      56: '0x572274F3f1a2d4016d85EB1BA2c4DA671805218e',
      5600: '0x572274F3f1a2d4016d85EB1BA2c4DA671805218e',
      97: '0x7Dc1917631e2DA181b4Fd355d590125DeC8C71dA',
    },
    vaultAddress: {
      97: '0xca965B8868a6F5DFB83164B8dBB74ba8F7c85f53',
      5600: '0x530B50A60d7B5F1295b86f28962558eFB2F722e4'
    },
    underlying: {
      decimals: {
        97: 18,
        5600: 18
      },
      address: {
        97: '0x0f988f09b121ecd60a47efed62cd4d69270e1a1a',
        5600: '0x824eb9faDFb377394430d2744fa7C42916DE3eCe'
      },
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
    vaultSymbol: 'bftEXO/BUSD',
    title: 'tEXO/BUSD LP',
    lpSymbol: 'tEXO-BUSD LP',
    address: {
      56: '0x19F4F3Cdaae6923b387566161a10Dc517a0D11aF',
      5600: '0x19F4F3Cdaae6923b387566161a10Dc517a0D11aF',
      97: '0x62F36aA22a5DA1c8cD61A004eD7f17a6029B6539',
    },
    vaultAddress: {
      97: '0xca965B8868a6F5DFB83164B8dBB74ba8F7c85f53',
    },
    underlying: {
      decimals: {
        97: 18,
      },
      address: {
        97: '0x0f988f09b121ecd60a47efed62cd4d69270e1a1a',
      },
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
