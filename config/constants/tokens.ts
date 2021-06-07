const tokens = {
  bnb: {
    symbol: 'BNB',
    projectLink: 'https://www.binance.com/',
  },
  texo: {
    symbol: 'TEXO',
    address: {
      56: '0x08065c1e0fe5b6D82B778760571cE29392e24A46',
      97: '0xABe104d0a197867E5fDB77632Ad22FA2338f86f7',
    },
    decimals: 18,
    projectLink: 'https://exonium.one/',
  },
  faang: {
    symbol: 'FAANG',
    address: {
      56: '',
      97: '0xE6fBf3c5317859466A50311D477FDDa603efe0fc',
    },
    decimals: 18,
    projectLink: 'https://exonium.one/',
  },
  usdt: {
    symbol: 'USDT',
    address: {
      56: '0x55d398326f99059ff775485246999027b3197955',
      97: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
    },
    decimals: 18,
    projectLink: 'https://tether.to/',
  },
  wbnb: {
    symbol: 'wBNB',
    address: {
      56: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
      97: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
    },
    decimals: 18,
    projectLink: 'https://pancakeswap.finance/',
  },
  busd: {
    symbol: 'BUSD',
    address: {
      56: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      97: '0xfF9F29E2dd5f3c76ec0C3214e5bb758E7F67F462', //custom
    },
    decimals: 18,
    projectLink: 'https://www.paxos.com/busd/',
  },
  cake: {
    symbol: 'CAKE',
    address: {
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
      97: '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
    },
    decimals: 18,
    projectLink: 'https://pancakeswap.finance/',
  },
  btcb: {
    symbol: 'BTCB',
    address: {
      56: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: 18,
    projectLink: 'https://bitcoin.org/',
  },
  eth: {
    symbol: 'ETH',
    address: {
      56: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
      97: '0x838961136197260c11b5f5Fb39f10eef9d588630', //custom
    },
    decimals: 18,
    projectLink: 'https://ethereum.org/en/',
  },
  bunny: {
    symbol: 'BUNNY',
    address: {
      56: '0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51',
      97: '0x4B915Ec8D58B62edC98E556B0f37E0520D257aD2', //custom
    },
    decimals: 18,
    projectLink: 'https://pancakebunny.finance/',
  },
  xvs: {
    symbol: 'XVS',
    address: {
      56: '0xcf6bb5389c92bdda8a3747ddb454cb7a64626c63',
      97: '0x71336AAeD37b25dEFA5b48a1280CD9ED4b45080a', //custom
    },
    decimals: 18,
    projectLink: 'https://venus.io/',
  },
  usdc: {
    symbol: 'USDC',
    address: {
      56: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      97: '0xa5c92c6B4da1e42BCED5683AF284f8B9B828B9F0', //custom
    },
    decimals: 18,
    projectLink: 'https://www.centre.io/usdc',
  },
  dai: {
    symbol: 'DAI',
    address: {
      56: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
      97: '0x2DB37EDd9F20298De90Cc9F1029734F07c2cD529', //custom
    },
    decimals: 18,
    projectLink: 'http://www.makerdao.com/',
  },
  dot: {
    symbol: 'DOT',
    address: {
      56: '0x7083609fce4d1d8dc0c979aab8c869ea2c873402',
      97: '0xce8085f0191d28C85EEEe1E61Ec9D466E2959A59',
    },
    decimals: 18,
    projectLink: 'https://polkadot.network/',
  },
};

export default tokens;
