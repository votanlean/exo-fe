const tokens = {
  bnb: {
    symbol: 'BNB',
  },
  texo: {
    symbol: 'TEXO',
    address: {
      56: '0xF1afb5674Bf946458BD1163163F62dE683B07D65',
      97: '0xc93BA03A93C61ef22ebbd95Db11BB35F96a0736A',
      137: '0x298A15cBfb1A331814E18EAB36891Dde49d3f58E',
      80001: '0x73a739D0c54f5A24406b6f0F674424eCAdD64Acc',
    },
    decimals: {
      56: 18,
      97: 18,
      137: 18,
      80001: 18,
    },
  },
  faang: {
    symbol: 'FAANG',
    address: {
      56: '0x2b0EA770431df39196FF33fB425BE084636d946e',
      97: '0x09EB4dDc76497D28f43ED11F26Aef0ff9D9BcCeE',
      137: '0x0f30C74A34DF0B9CCbd37915d74a2E8c636E2b70',
      80001: '0x29E35F2d89d9Ee3FA9ebfc48DCef6e798aaC11F4',
    },
    decimals: {
      56: 18,
      97: 18,
      137: 18,
      80001: 18,
    },
  },
  usdt: {
    symbol: 'USDT',
    address: {
      56: '0x55d398326f99059ff775485246999027b3197955',
      97: '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd',
      137: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
      80001: '0x4aAeB0c6523e7aa5Adc77EAD9b031ccdEA9cB1c3',
    },
    decimals: {
      56: 18,
      97: 18,
      137: 6,
      80001: 6,
    },
  },
  wbnb: {
    symbol: 'wBNB',
    address: {
      56: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
      97: '0xae13d989dac2f0debff460ac112a837c89baa7cd',
    },
    decimals: {
      56: 18,
      97: 18,
    },
  },
  busd: {
    symbol: 'BUSD',
    address: {
      56: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      97: '0xfF9F29E2dd5f3c76ec0C3214e5bb758E7F67F462', //custom
    },
    decimals: {
      56: 18,
      97: 18,
    },
  },
  cake: {
    symbol: 'CAKE',
    address: {
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
      97: '0xa35062141Fa33BCA92Ce69FeD37D0E8908868AAe',
    },
    decimals: {
      56: 18,
      97: 18,
    },
  },
  btcb: {
    symbol: 'BTCB',
    address: {
      56: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
      97: '0xE02dF9e3e622DeBdD69fb838bB799E3F168902c5',
    },
    decimals: {
      56: 18,
      97: 18,
    },
  },
  eth: {
    symbol: 'ETH',
    address: {
      56: '0x2170ed0880ac9a755fd29b2688956bd959f933f8',
      97: '0x838961136197260c11b5f5Fb39f10eef9d588630', //custom
    },
    decimals: {
      56: 18,
      97: 18,
    },
  },
  bunny: {
    symbol: 'BUNNY',
    address: {
      56: '0xc9849e6fdb743d08faee3e34dd2d1bc69ea11a51',
      97: '0x4B915Ec8D58B62edC98E556B0f37E0520D257aD2', //custom
    },
    decimals: {
      56: 18,
      97: 18,
    },
  },
  xvs: {
    symbol: 'XVS',
    address: {
      56: '0xcf6bb5389c92bdda8a3747ddb454cb7a64626c63',
      97: '0x71336AAeD37b25dEFA5b48a1280CD9ED4b45080a', //custom
    },
    decimals: {
      56: 18,
      97: 18,
    },
  },
  usdc: {
    symbol: 'USDC',
    address: {
      56: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      97: '0xa5c92c6B4da1e42BCED5683AF284f8B9B828B9F0', //custom
      137: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      80001: '0x2058A9D7613eEE744279e3856Ef0eAda5FCbaA7e',
    },
    decimals: {
      56: 18,
      97: 18,
      137: 6,
      80001: 6,
    },
  },
  dai: {
    symbol: 'DAI',
    address: {
      56: '0x1af3f329e8be154074d8769d1ffa4ee058b1dbc3',
      97: '0x2DB37EDd9F20298De90Cc9F1029734F07c2cD529', //custom
      137: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      80001: '0x27a44456bEDb94DbD59D0f0A14fE977c777fC5C3',
    },
    decimals: {
      56: 18,
      97: 18,
      137: 18,
      80001: 18,
    },
  },
  dot: {
    symbol: 'DOT',
    address: {
      56: '0x7083609fce4d1d8dc0c979aab8c869ea2c873402',
      97: '0xce8085f0191d28C85EEEe1E61Ec9D466E2959A59',
    },
    decimals: {
      56: 18,
      97: 18,
    },
  },
  weth: {
    symbol: 'WETH',
    address: {
      137: ' 0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
      80001: '0xA6FA4fB5f76172d178d61B04b0ecd319C5d1C0aa',
    },
    decimals: {
      137: 18,
      80001: 18,
    },
  },
  wmatic: {
    symbol: 'WMATIC',
    address: {
      137: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      80001: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
    },
    decimals: {
      137: 18,
      80001: 18,
    },
  },
  wbtc: {
    symbol: 'wBTC',
    address: {
      137: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
      80001: '0x7F45ba958900a9D9242B706b58B79e788aAcFb7f',
    },
    decimals: {
      137: 8,
      80001: 8,
    },
  },
  quick: {
    symbol: 'QUICK',
    address: {
      137: '0x831753dd7087cac61ab5644b308642cc1c33dc13',
      80001: '0xE4897CBE8023F58537b1818316434C4022650660',
    },
    decimals: {
      137: 18,
      80001: 18,
    },
  },
  link: {
    symbol: 'LINK',
    address: {
      137: '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39',
      80001: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
    },
    decimals: {
      137: 18,
      80001: 18,
    },
  },
  aave: {
    symbol: 'AAVE',
    address: {
      137: '0xd6df932a45c0f255f85145f286ea0b292b21c90b',
      80001: '0x529831c586966715796D976Ce35D3842a74E7C5b',
    },
    decimals: {
      137: 18,
      80001: 18,
    },
  },
  fish: {
    symbol: 'FISH',
    address: {
      137: '0x3a3df212b7aa91aa0402b9035b098891d276572b',
      80001: '0x6F158dfe710244f6Af7C4c1a332d99c74BeA2F2D',
    },
    decimals: {
      137: 18,
      80001: 18,
    },
  },
};

export default tokens;
