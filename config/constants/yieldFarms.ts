import { bnbEcAssetPools } from "./ecAssetPools";

export enum STRATEGY_TYPES {
  PANCAKESWAP = "pancakeswap",
  TEXO="texo"
}

export const bnbVaults: any[] = [
  //Native vaults
  {
    pid: 0,
    icon1: '/static/images/tEXO-Icon.png',
    icon2: '/static/images/pool/wBNB.png',
    symbol: 'TEXO_wBNB',
    vaultSymbol: 'bfTEXO/wBNB',
    title: 'TEXO-wBNB',
    address: {
      5600: '0x530B50A60d7B5F1295b86f28962558eFB2F722e4',
    },
    underlying: {
      decimals: {
        5600: 18
      },
      address: {
        5600: '0x572274F3f1a2d4016d85EB1BA2c4DA671805218e'
      },
    },
    ecAssetPool: bnbEcAssetPools[8],
    depositFeeBP: 0,
    decimals: {
      5600: 18,
    },
    liquidityLink: 'https://exchange.pancakeswap.finance/#/add/BNB/',
    strategy: {
      rewardPool: {
        address: {
          5600: '0xD8980CCdD4096e60bb3198F91d6f79CeEF29369c'
        }
      },
      pool: {
        id: {
          5600: 11
        }
      },
      type: STRATEGY_TYPES.TEXO
    }
  },
  {
    pid: 1,
    icon1: '/static/images/tEXO-Icon.png',
    icon2: '/static/images/pool/BUSD.png',
    symbol: 'TEXO_BUSD',
    vaultSymbol: 'bfTEXO/BUSD',
    title: 'TEXO-BUSD',
    address: {
      5600: '0xCdA2A211dCe1E018a966cb833F2F6DFf5c67E626',
    },
    underlying: {
      decimals: {
        5600: 18
      },
      address: {
        5600: '0x19F4F3Cdaae6923b387566161a10Dc517a0D11aF'
      },
    },
    ecAssetPool: bnbEcAssetPools[9],
    depositFeeBP: 0,
    decimals: {
      5600: 18,
    },
    liquidityLink: 'https://exchange.pancakeswap.finance/#/add/BNB/',
    strategy: {
      rewardPool: {
        address: {
          5600: '0xD8980CCdD4096e60bb3198F91d6f79CeEF29369c'
        }
      },
      pool: {
        id: {
          5600: 12
        }
      },
      type: STRATEGY_TYPES.TEXO
    }
  },

  // //Bluechips vaults
  {
    pid: 2,
    icon1: '/static/images/pool/wBNB.png',
    icon2: '/static/images/pool/BUSD.png',
    symbol: 'wBNB_BUSD',
    vaultSymbol: 'bfwBNB/BUSD',
    title: 'wBNB-BUSD',
    address: {
      5600: '0x6fF3D2Ef0E52E3671484b222c41fd01aDF2C6333',
    },
    underlying: {
      decimals: {
        5600: 18
      },
      address: {
        5600: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16'
      },
    },
    ecAssetPool: bnbEcAssetPools[0],
    depositFeeBP: 0,
    decimals: {
      5600: 18,
    },
    liquidityLink: 'https://exchange.pancakeswap.finance/#/add/BNB/',
    strategy: {
      rewardPool: {
        address: {
          5600: '0x73feaa1eE314F8c655E354234017bE2193C9E24E'
        }
      },
      pool: {
        id: {
          5600: 252
        }
      },
      type: STRATEGY_TYPES.PANCAKESWAP
    }
  },
  {
    pid: 3,
    icon1: '/static/images/pool/CAKE.jpeg',
    icon2: '/static/images/pool/wBNB.png',
    symbol: 'CAKE_wBNB',
    vaultSymbol: 'bfCAKE/wBNB',
    title: 'CAKE-wBNB',
    address: {
      5600: '0x54921B7Db926Bcfa5CcA50A569FaEbafD076d059',
    },
    underlying: {
      decimals: {
        5600: 18
      },
      address: {
        5600: '0x0eD7e52944161450477ee417DE9Cd3a859b14fD0'
      },
    },
    ecAssetPool: bnbEcAssetPools[2],
    depositFeeBP: 0,
    decimals: {
      5600: 18,
    },
    liquidityLink: 'https://exchange.pancakeswap.finance/#/add/BNB/',
    strategy: {
      rewardPool: {
        address: {
          5600: '0x73feaa1eE314F8c655E354234017bE2193C9E24E'
        }
      },
      pool: {
        id: {
          5600: 251
        }
      },
      type: STRATEGY_TYPES.PANCAKESWAP
    }
  },
  {
    pid: 4,
    icon1: '/static/images/pool/CAKE.jpeg',
    icon2: '/static/images/pool/BUSD.png',
    symbol: 'CAKE_BUSD',
    vaultSymbol: 'bfCAKE/BUSD',
    title: 'CAKE-BUSD',
    address: {
      5600: '0xD25F610Fc4d4300dDceF1C7Bec06344dF2C6c47A',
    },
    underlying: {
      decimals: {
        5600: 18
      },
      address: {
        5600: '0x804678fa97d91B974ec2af3c843270886528a9E6'
      },
    },
    ecAssetPool: bnbEcAssetPools[3],
    depositFeeBP: 0,
    decimals: {
      5600: 18,
    },
    liquidityLink: 'https://exchange.pancakeswap.finance/#/add/BNB/',
    strategy: {
      rewardPool: {
        address: {
          5600: '0x73feaa1eE314F8c655E354234017bE2193C9E24E'
        }
      },
      pool: {
        id: {
          5600: 389
        }
      },
      type: STRATEGY_TYPES.PANCAKESWAP
    }
  },
  {
    pid: 5,
    icon1: '/static/images/pool/BTCB.jpeg',
    icon2: '/static/images/pool/wBNB.png',
    symbol: 'BTCB_wBNB',
    vaultSymbol: 'bfBTCB/wBNB',
    title: 'BTCB-wBNB',
    address: {
      5600: '0x48F8A76C1777c20bB9ddf3b7a6e267316EC3B734',
    },
    underlying: {
      decimals: {
        5600: 18
      },
      address: {
        5600: '0x61EB789d75A95CAa3fF50ed7E47b96c132fEc082'
      },
    },
    ecAssetPool: bnbEcAssetPools[4],
    depositFeeBP: 0,
    decimals: {
      5600: 18,
    },
    liquidityLink: 'https://exchange.pancakeswap.finance/#/add/BNB/',
    strategy: {
      rewardPool: {
        address: {
          5600: '0x73feaa1eE314F8c655E354234017bE2193C9E24E'
        }
      },
      pool: {
        id: {
          5600: 262
        }
      },
      type: STRATEGY_TYPES.PANCAKESWAP
    }
  },
  {
    pid: 6,
    icon1: '/static/images/pool/ETH.png',
    icon2: '/static/images/pool/wBNB.png',
    symbol: 'ETH_wBNB',
    vaultSymbol: 'bfETH/wBNB',
    title: 'ETH-wBNB',
    address: {
      5600: '0xB1Ca25Bd5Ea2f58fcE0DE7417C939D058f873570',
    },
    underlying: {
      decimals: {
        5600: 18
      },
      address: {
        5600: '0x74E4716E431f45807DCF19f284c7aA99F18a4fbc'
      },
    },
    ecAssetPool: bnbEcAssetPools[5],
    depositFeeBP: 0,
    decimals: {
      5600: 18,
    },
    liquidityLink: 'https://exchange.pancakeswap.finance/#/add/BNB/',
    strategy: {
      rewardPool: {
        address: {
          5600: '0x73feaa1eE314F8c655E354234017bE2193C9E24E'
        }
      },
      pool: {
        id: {
          5600: 261
        }
      },
      type: STRATEGY_TYPES.PANCAKESWAP
    }
  },
  // //Stable vaults
  {
    pid: 7,
    icon1: '/static/images/pool/USDT.png',
    icon2: '/static/images/pool/BUSD.png',
    symbol: 'USDT_BUSD',
    vaultSymbol: 'bfUSDT/BUSD',
    title: 'USDT-BUSD',
    address: {
      5600: '0xD75B60e161de7C0aEBcF17B703a614C4cff4e7f1',
    },
    underlying: {
      decimals: {
        5600: 18
      },
      address: {
        5600: '0x7EFaEf62fDdCCa950418312c6C91Aef321375A00'
      },
    },
    ecAssetPool: bnbEcAssetPools[1],
    depositFeeBP: 0,
    decimals: {
      5600: 18,
    },
    liquidityLink: 'https://exchange.pancakeswap.finance/#/add/BNB/',
    strategy: {
      rewardPool: {
        address: {
          5600: '0x73feaa1eE314F8c655E354234017bE2193C9E24E'
        }
      },
      pool: {
        id: {
          5600: 258
        }
      },
      type: STRATEGY_TYPES.PANCAKESWAP
    }
  },
  {
    pid: 8,
    icon1: '/static/images/pool/USDC.png',
    icon2: '/static/images/pool/BUSD.png',
    symbol: 'USDC_BUSD',
    vaultSymbol: 'bfUSDC/BUSD',
    title: 'USDC-BUSD',
    address: {
      5600: '0xd65DD49C9358Bd9E455C7eE3F85768171D63d124',
    },
    underlying: {
      decimals: {
        5600: 18
      },
      address: {
        5600: '0x2354ef4DF11afacb85a5C7f98B624072ECcddbB1'
      },
    },
    ecAssetPool: bnbEcAssetPools[6],
    depositFeeBP: 0,
    decimals: {
      5600: 18,
    },
    liquidityLink: 'https://exchange.pancakeswap.finance/#/add/BNB/',
    strategy: {
      rewardPool: {
        address: {
          5600: '0x73feaa1eE314F8c655E354234017bE2193C9E24E'
        }
      },
      pool: {
        id: {
          5600: 283
        }
      },
      type: STRATEGY_TYPES.PANCAKESWAP
    }
  },
  {
    pid: 9,
    icon1: '/static/images/pool/USDT.png',
    icon2: '/static/images/pool/USDC.png',
    symbol: 'USDT_USDC',
    vaultSymbol: 'bfUSDT/USDC',
    title: 'USDT-USDC',
    address: {
      5600: '0x501270e35231cC231e2Ac7C9f14299a42b8E1a1D',
    },
    underlying: {
      decimals: {
        5600: 18
      },
      address: {
        5600: '0xEc6557348085Aa57C72514D67070dC863C0a5A8c'
      },
    },
    ecAssetPool: bnbEcAssetPools[7],
    depositFeeBP: 0,
    decimals: {
      5600: 18,
    },
    liquidityLink: 'https://exchange.pancakeswap.finance/#/add/BNB/',
    strategy: {
      rewardPool: {
        address: {
          5600: '0x73feaa1eE314F8c655E354234017bE2193C9E24E'
        }
      },
      pool: {
        id: {
          5600: 423
        }
      },
      type: STRATEGY_TYPES.PANCAKESWAP
    }
  },

];
