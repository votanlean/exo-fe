import tokens from './tokens';

export const bnbEcAssetPools: any[] = [
  {
    pid: 13,
    icon: '/static/images/Vault_WBNB-BUSD.png',
    symbol: 'ecWBNB_BUSD',
    title: 'ecWBNB_BUSD',
    address: {
      56: '',
      5600: '0x592F0C67eFac341F84490a4Cfc8Dc5dB71aEC536',
      97: '',
    },
    token: tokens.texo,
    displayAllocPoint: 500,
    depositFeeBP: 0,
    decimals: {
      56: 18,
      5600: 18,
      97: 18,
    },
  },
  {
    pid: 14,
    icon: '/static/images/Vault_USDT-BUSD.png',
    symbol: 'ecUSDT_BUSD',
    title: 'ecUSDT_BUSD',
    lpSymbol: 'ecUSDT_BUSD',
    address: {
      56: '',
      5600: '0x63236EE887e40aA5fFBBE4d9412dc506768Cd80e',
      97: '',
    },
    token: tokens.texo,
    displayAllocPoint: 500,
    depositFeeBP: 0,
    decimals: {
      56: 18,
      5600: 18,
      97: 18,
    },
  },
];
