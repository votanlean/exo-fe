import tokens from './tokens';

export const bnbEcAssetPools: any[] = [
  //Native
  {
    pid: 13,
    icon: "/static/images/Vault_TEXO_BNB.png",
    symbol: "ecTEXO_BNB",
    title: "ecTEXO_BNB",
    stakingTokenAddress: {
      56: "0xdF81B3513eE13056a88cA5CEdF8b59Db57a64Ae3",
      5600: "0x595B788EbD7589Bd5d56867820e5f99a0200ee2c",
      97: "",
    },
    token: tokens.texo,
    displayAllocPoint: 2000,
    depositFeeBP: 0,
    decimals: {
      56: 18,
      5600: 18,
      97: 18,
    },
  },
  {
    pid: 14,
    icon: "/static/images/Vault_TEXO_BUSD.png",
    symbol: "ecTEXO_BUSD",
    title: "ecTEXO_BUSD",
    stakingTokenAddress: {
      56: "0x30AE549200D291c9DAdbAaDA1B14e303CCDFD3Cc",
      5600: "0xBf95892A179226A4DEa54e76A8F53d5D2825eB93",
      97: "",
    },
    token: tokens.texo,
    displayAllocPoint: 2000,
    depositFeeBP: 0,
    decimals: {
      56: 18,
      5600: 18,
      97: 18,
    },
  },
  //Bluechip
  {
    pid: 15,
    icon: "/static/images/Vault_WBNB-BUSD.png",
    symbol: "ecWBNB/BUSD",
    title: "ecWBNB/BUSD",
    stakingTokenAddress: {
      56: "0x0B4B33769D35A46ca52c126e647d7eb924f86ccf",
      5600: "0xCa41f235b4Fd06c7E8306e3a323b9423aBE793b5",
      97: "",
    },
    token: tokens.texo,
    displayAllocPoint: 2000,
    depositFeeBP: 0,
    decimals: {
      56: 18,
      5600: 18,
      97: 18,
    },
  },

  {
    pid: 16,
    icon: "/static/images/Vault_CAKE-WBNB.png",
    symbol: "ecCAKE/WBNB",
    title: "ecCAKE/WBNB",
    stakingTokenAddress: {
      56: "0xE548c18a47dCfbf98A75f15e830803Ce3ddc0435",
      5600: "0xCA232292f5Ca34ECdBb7828F90C340a082DdC7A2",
      97: "",
    },
    token: tokens.texo,
    displayAllocPoint: 2000,
    depositFeeBP: 0,
    decimals: {
      56: 18,
      5600: 18,
      97: 18,
    },
  },
  {
    pid: 17,
    icon: "/static/images/Vault_CAKE-BUSD.png",
    symbol: "ecCAKE/BUSD",
    title: "ecCAKE/BUSD",
    stakingTokenAddress: {
      56: "0xFa560e953964C5B6707CC2F53bBCF5BA07999a93",
      5600: "0x03A76453E4c8cB41C8eE33248FCD937C3a7340E2",
      97: "",
    },
    token: tokens.texo,
    displayAllocPoint: 2000,
    depositFeeBP: 0,
    decimals: {
      56: 18,
      5600: 18,
      97: 18,
    },
  },
  {
    pid: 18,
    icon: "/static/images/Vault_BTCB-WBNB.png",
    symbol: "ecBTCB/WBNB",
    title: "ecBTCB/WBNB",
    stakingTokenAddress: {
      56: "0x39c3840C8A040c228AF0954b7f4B1c3ab724676b",
      5600: "0xEe384949D3C00452406D528Bf57194Ea2E9182E2",
      97: "",
    },
    token: tokens.texo,
    displayAllocPoint: 2000,
    depositFeeBP: 0,
    decimals: {
      56: 18,
      5600: 18,
      97: 18,
    },
  },
  {
    pid: 19,
    icon: "/static/images/Vault_WETH-WBNB.png",
    symbol: "ecWETH/WBNB",
    title: "ecWETH/WBNB",
    stakingTokenAddress: {
      56: "0x1E5979fD1b455C16024257563329D76347540d25",
      5600: "0x10ACF1Ba9991B13EBbC7C688F03058a49600A6fB",
      97: "",
    },
    token: tokens.texo,
    displayAllocPoint: 2000,
    depositFeeBP: 0,
    decimals: {
      56: 18,
      5600: 18,
      97: 18,
    },
  },
  //Stable
  {
    pid: 20,
    icon: "/static/images/Vault_USDT-BUSD.png",
    symbol: "ecUSDT/BUSD",
    title: "ecUSDT/BUSD",
    stakingTokenAddress: {
      56: "0x7FCdE811413ab8c3E058817266165f7FfBAee423",
      5600: "0x1BC0a29BFD9727C987843414912398703676F2e8",
      97: "",
    },
    token: tokens.texo,
    displayAllocPoint: 2000,
    depositFeeBP: 0,
    decimals: {
      56: 18,
      5600: 18,
      97: 18,
    },
  },
  {
    pid: 21,
    icon: "/static/images/Vault_USDC-BUSD.png",
    symbol: "ecUSDC/BUSD",
    title: "ecUSDC/BUSD",
    stakingTokenAddress: {
      56: "0x8949e50b2132791d3B656DF32Cb487A437760B89",
      5600: "0x1D3f62ae2724ACF4F901cc41879A1007F296a498",
      97: "",
    },
    token: tokens.texo,
    displayAllocPoint: 2000,
    depositFeeBP: 0,
    decimals: {
      56: 18,
      5600: 18,
      97: 18,
    },
  },

  {
    pid: 22,
    icon: "/static/images/Vault_USDT-USDC.png",
    symbol: "ecUSDT/USDC",
    title: "ecUSDT/USDC",
    stakingTokenAddress: {
      56: "0x40D2b56F4E02a3ca21aAC7620b40a0f27aC81032",
      5600: "0xF6b36f16F0503B6E2D4110BA0Fe7597E5d8eDa26",
      97: "",
    },
    token: tokens.texo,
    displayAllocPoint: 2000,
    depositFeeBP: 0,
    decimals: {
      56: 18,
      5600: 18,
      97: 18,
    },
  },
];
