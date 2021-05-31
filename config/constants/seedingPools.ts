import tokens from "./tokens";

const seedingPools = [
  {
    id: 0,
    icon: '/static/images/pool/USDT.png',
    title: 'USDT Pool',
    stakingToken: {
      address: {
        56: process.env.USDT_ADDRESS,
        97: process.env.USDT_ADDRESS,
      },
    },
    displayAllocPoint: 400,
    depositFeeBP: 400,
    address: {
      56: process.env.USDT_ADDRESS,
      97: process.env.USDT_ADDRESS,
    },
    symbol: 'USDT',
    bsScanLink: 'https://bscscan.com/address/' + process.env.USDT_ADDRESS,
  },
  {
    id: 1,
    icon: '/static/images/pool/wBNB.png',
    title: 'wBNB Pool',
    stakingToken: {
      address: {
        56: process.env.WBNB_ADDRESS,
        97: process.env.WBNB_ADDRESS,
      },
    },
    displayAllocPoint: 300,
    depositFeeBP: 400,
    address: {
      56: process.env.WBNB_ADDRESS,
      97: process.env.WBNB_ADDRESS,
    },
    symbol: 'wBNB',
    bsScanLink: 'https://bscscan.com/address/' + process.env.WBNB_ADDRESS,
  },
  {
    id: 2,
    icon: '/static/images/pool/BUSD.png',
    title: 'BUSD Pool',
    stakingToken: {
      address: {
        56: process.env.BUSD_ADDRESS,
        97: process.env.BUSD_ADDRESS,
      },
    },
    displayAllocPoint: 400,
    depositFeeBP: 400,
    address: {
      56: process.env.BUSD_ADDRESS,
      97: process.env.BUSD_ADDRESS,
    },
    symbol: 'BUSD',
    bsScanLink: 'https://bscscan.com/address/' + process.env.BUSD_ADDRESS,
  },
  {
    id: 3,
    icon: '/static/images/pool/CAKE.jpeg',
    title: 'CAKE Pool',
    stakingToken: {
      address: {
        56: process.env.CAKE_ADDRESS,
        97: process.env.CAKE_ADDRESS,
      },
    },
    displayAllocPoint: 200,
    depositFeeBP: 400,
    address: {
      56: process.env.CAKE_ADDRESS,
      97: process.env.CAKE_ADDRESS,
    },
    symbol: 'CAKE',
    bsScanLink: 'https://bscscan.com/address/' + process.env.CAKE_ADDRESS,
  },
  {
    id: 4,
    icon: '/static/images/pool/BTCB.jpeg',
    title: 'BTCB Pool',
    stakingToken: {
      address: {
        56: process.env.BTCB_ADDRESS,
        97: process.env.BTCB_ADDRESS,
      },
    },
    displayAllocPoint: 200,
    depositFeeBP: 400,
    address: {
      56: process.env.BTCB_ADDRESS,
      97: process.env.BTCB_ADDRESS,
    },
    symbol: 'BTCB',
    bsScanLink: 'https://bscscan.com/address/' + process.env.BTCB_ADDRESS,
  },
  {
    id: 5,
    icon: '/static/images/pool/ETH.png',
    title: 'ETH Pool',
    stakingToken: {
      address: {
        56: process.env.ETH_ADDRESS,
        97: process.env.ETH_ADDRESS,
      },
    },
    displayAllocPoint: 200,
    depositFeeBP: 400,
    address: {
      56: process.env.ETH_ADDRESS,
      97: process.env.ETH_ADDRESS,
    },
    symbol: 'ETH',
    bsScanLink: 'https://bscscan.com/address/' + process.env.ETH_ADDRESS,
  },
  {
    id: 6,
    icon: '/static/images/pool/BUNNY.png',
    title: 'BUNNY Pool',
    stakingToken: {
      address: {
        56: process.env.BUNNY_ADDRESS,
        97: process.env.BUNNY_ADDRESS,
      },
    },
    displayAllocPoint: 200,
    depositFeeBP: 400,
    address: {
      56: process.env.BUNNY_ADDRESS,
      97: process.env.BUNNY_ADDRESS,
    },
    symbol: 'BUNNY',
    bsScanLink: 'https://bscscan.com/address/' + process.env.BUNNY_ADDRESS,
  },
  {
    id: 7,
    icon: '/static/images/pool/XVS.jpeg',
    title: 'XVS Pool',
    stakingToken: {
      address: {
        56: process.env.XVS_ADDRESS,
        97: process.env.XVS_ADDRESS,
      },
    },
    displayAllocPoint: 200,
    depositFeeBP: 400,
    address: {
      56: process.env.XVS_ADDRESS,
      97: process.env.XVS_ADDRESS,
    },
    symbol: 'XVS',
    bsScanLink: 'https://bscscan.com/address/' + process.env.XVS_ADDRESS,
  },
  {
    id: 8,
    icon: '/static/images/pool/USDC.png',
    title: 'USDC Pool',
    stakingToken: {
      address: {
        56: process.env.USDC_ADDRESS,
        97: process.env.USDC_ADDRESS,
      },
    },
    displayAllocPoint: 400,
    depositFeeBP: 400,
    address: {
      56: process.env.USDC_ADDRESS,
      97: process.env.USDC_ADDRESS,
    },
    symbol: 'USDC',
    bsScanLink: 'https://bscscan.com/address/' + process.env.USDC_ADDRESS,
  },
  {
    id: 9,
    icon: '/static/images/pool/DAI.png',
    title: 'DAI Pool',
    stakingToken: {
      address: {
        56: process.env.DAI_ADDRESS,
        97: process.env.DAI_ADDRESS,
      },
    },
    displayAllocPoint: 400,
    depositFeeBP: 400,
    address: {
      56: process.env.DAI_ADDRESS,
      97: process.env.DAI_ADDRESS,
    },
    symbol: 'DAI',
    bsScanLink: 'https://bscscan.com/address/' + process.env.DAI_ADDRESS,
  },
  {
    id: 10,
    icon: '/static/images/pool/DOT.png',
    title: 'DOT Pool',
    stakingToken: {
      address: {
        56: process.env.DOT_ADDRESS,
        97: process.env.DOT_ADDRESS,
      },
    },
    displayAllocPoint: 200,
    depositFeeBP: 400,
    address: {
      56: process.env.DOT_ADDRESS,
      97: process.env.DOT_ADDRESS,
    },
    symbol: 'DOT',
    bsScanLink: 'https://bscscan.com/address/' + process.env.DOT_ADDRESS,
  },
];

export default seedingPools;
