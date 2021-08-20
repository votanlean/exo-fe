import { ConnectorNames } from '../../utils/web3React';

export const networks = [
  {
    id: 97,
    name: 'Binance',
    icon: '/static/images/wallets/binance.svg',
    type: 'binance',
    iconDisable: '/static/images/wallets/binance-disabled.svg',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    symbol: 'BNB',
    blockExplorerName: 'Bscscan',
    blockExplorerUrl: 'https://bscscan.com',
    decimals: 18,
    startBlock: '99999999',
    secondsPerBlock: 3,
    swapLink: 'https://exchange.pancakeswap.finance/#/swap?outputCurrency=',
  },
  {
    id: 56,
    name: 'Binance',
    icon: '/static/images/wallets/binance.svg',
    type: 'binance',
    iconDisable: '/static/images/wallets/binance-disabled.svg',
    rpcUrl: 'https://bsc-dataseed1.ninicoin.io/',
    symbol: 'BNB',
    blockExplorerName: 'Bscscan',
    blockExplorerUrl: 'https://bscscan.com',
    decimals: 18,
    startBlock: '9794888',
    secondsPerBlock: 3,
    swapLink: 'https://exchange.pancakeswap.finance/#/swap?outputCurrency=',
  },
  {
    id: 5600,
    name: 'Binance',
    icon: '/static/images/wallets/binance.svg',
    type: 'binance',
    iconDisable: '/static/images/wallets/binance-disabled.svg',
    rpcUrl: 'http://188.166.228.206:3001',
    symbol: 'BNB',
    blockExplorerName: 'Bscscan',
    blockExplorerUrl: 'https://bscscan.com',
    decimals: 18,
    startBlock: '9794888',
    secondsPerBlock: 3,
    swapLink: 'https://exchange.pancakeswap.finance/#/swap?outputCurrency=',
  },
  {
    id: 80001,
    name: 'Polygon',
    icon: '/static/images/wallets/polygon.svg',
    type: 'polygon',
    iconDisable: '/static/images/wallets/polygon-disabled.svg',
    rpcUrl: 'https://rpc-mumbai.maticvigil.com/',
    symbol: 'MATIC',
    blockExplorerName: 'Polygonscan',
    blockExplorerUrl: 'https://polygonscan.com',
    decimals: 6,
    startBlock: '99999999',
    secondsPerBlock: 4,
    swapLink: 'https://quickswap.exchange/#/swap?outputCurrency=',
  },
  {
    id: 137,
    name: 'Polygon',
    icon: '/static/images/wallets/polygon.svg',
    type: 'polygon',
    iconDisable: '/static/images/wallets/polygon-disabled.svg',
    rpcUrl: 'https://matic-mainnet.chainstacklabs.com',
    symbol: 'MATIC',
    blockExplorerName: 'Polygonscan',
    blockExplorerUrl: 'https://polygonscan.com',
    decimals: 6,
    startBlock: '17694805',
    secondsPerBlock: 2.3,
    swapLink: 'https://quickswap.exchange/#/swap?outputCurrency=',
  },
];

export const walletsConfig = [
  {
    id: '0',
    label: 'WalletConnect',
    icon: '/static/images/wallets/wallet-connect.svg',
    iconDisable: '/static/images/wallets/wallet-connect-disabled.svg',
    network: ['ethereum', 'binance', 'polygon'],
    disabled: false,
    connectorName: ConnectorNames.WalletConnect,
  },
  {
    id: '1',
    label: 'Metamask',
    icon: '/static/images/wallets/metamask.svg',
    iconDisable: '/static/images/wallets/metamask-disabled.svg',
    network: ['ethereum', 'binance', 'polygon'],
    disabled: false,
    connectorName: ConnectorNames.Injected,
  },
  {
    id: '2',
    label: 'Binance Chain Wallet',
    icon: '/static/images/wallets/injected-binance.svg',
    iconDisable: '/static/images/wallets/injected-binance-disabled.svg',
    network: ['ethereum', 'binance'],
    disabled: false,
    connectorName: ConnectorNames.BSC,
  },
];
