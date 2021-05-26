import tokens from "./tokens";

const seedingPools = [
  {
    id: 0,
    icon: '/static/images/pool/USDT.png',
    title: 'USDT Pool',
    stakingToken: tokens.usdt,
    address: {
      56: process.env.USDT_ADDRESS,
      97: '',
    },
    symbol: 'USDT',
    bsScanLink: 'https://bscscan.com/address/' + process.env.USDT_ADDRESS,
  },
  {
    id: 1,
    icon: '/static/images/pool/wBNB.png',
    title: 'wBNB Pool',
    stakingToken: tokens.wbnb,
    address: {
      56: process.env.WBNB_ADDRESS,
      97: '',
    },
    symbol: 'wBNB',
    bsScanLink: 'https://bscscan.com/address/' + process.env.WBNB_ADDRESS,
  },
  {
    id: 2,
    icon: '/static/images/pool/BUSD.png',
    title: 'BUSD Pool',
    stakingToken: tokens.busd,
    address: {
      56: process.env.BUSD_ADDRESS,
      97: '',
    },
    symbol: 'BUSD',
    bsScanLink: 'https://bscscan.com/address/' + process.env.BUSD_ADDRESS,
  },
  {
    id: 3,
    icon: '/static/images/pool/CAKE.jpeg',
    title: 'CAKE Pool',
    stakingToken: tokens.cake,
    address: {
      56: process.env.CAKE_ADDRESS,
      97: '',
    },
    symbol: 'CAKE',
    bsScanLink: 'https://bscscan.com/address/' + process.env.CAKE_ADDRESS,
  },
  {
    id: 4,
    icon: '/static/images/pool/BTCB.jpeg',
    title: 'BTCB Pool',
    stakingToken: tokens.btcb,
    address: {
      56: process.env.BTCB_ADDRESS,
      97: '',
    },
    symbol: 'BTCB',
    bsScanLink: 'https://bscscan.com/address/' + process.env.BTCB_ADDRESS,
  },
  {
    id: 5,
    icon: '/static/images/pool/ETH.png',
    title: 'ETH Pool',
    stakingToken: tokens.eth,
    address: {
      56: process.env.ETH_ADDRESS,
      97: '',
    },
    symbol: 'ETH',
    bsScanLink: 'https://bscscan.com/address/' + process.env.ETH_ADDRESS,
  },
  {
    id: 6,
    icon: '/static/images/pool/BUNNY.png',
    title: 'BUNNY Pool',
    stakingToken: tokens.bunny,
    address: {
      56: process.env.BUNNY_ADDRESS,
      97: '',
    },
    symbol: 'BUNNY',
    bsScanLink: 'https://bscscan.com/address/' + process.env.BUNNY_ADDRESS,
  },
  {
    id: 7,
    icon: '/static/images/pool/XVS.jpeg',
    title: 'XVS Pool',
    stakingToken: tokens.xvs,
    address: {
      56: process.env.XVS_ADDRESS,
      97: '',
    },
    symbol: 'XVS',
    bsScanLink: 'https://bscscan.com/address/' + process.env.XVS_ADDRESS,
  },
  {
    id: 8,
    icon: '/static/images/pool/USDC.png',
    title: 'USDC Pool',
    stakingToken: tokens.usdc,
    address: {
      56: process.env.USDC_ADDRESS,
      97: '',
    },
    symbol: 'USDC',
    bsScanLink: 'https://bscscan.com/address/' + process.env.USDC_ADDRESS,
  },
  {
    id: 9,
    icon: '/static/images/pool/DAI.png',
    title: 'DAI Pool',
    stakingToken: tokens.dai,
    address: {
      56: process.env.DAI_ADDRESS,
      97: '',
    },
    symbol: 'DAI',
    bsScanLink: 'https://bscscan.com/address/' + process.env.DAI_ADDRESS,
  },
  {
    id: 10,
    icon: '/static/images/pool/DOT.png',
    title: 'DOT Pool',
    stakingToken: tokens.dot,
    address: {
      56: process.env.DOT_ADDRESS,
      97: '',
    },
    symbol: 'DOT',
    bsScanLink: 'https://bscscan.com/address/' + process.env.DOT_ADDRESS,
  },
];

export default seedingPools;
