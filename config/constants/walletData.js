import { ConnectorNames } from '../../utils/web3React';

export const networks = [
  {
    id: 56,
    name: 'Binance',
    icon: '/static/images/wallets/binance.svg',
    type: 'binance',
    iconDisable: '/static/images/wallets/binance-disabled.svg',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    symbol: 'BNB',
    blockExplorerUrl: 'https://bscscan.com/',
    decimals: 18
  },
  {
    id: 80001,
    name: 'Polygon',
    icon: '/static/images/wallets/polygon.svg',
    type: 'polygon',
    iconDisable: '/static/images/wallets/polygon-disabled.svg',
    rpcUrl: 'https://rpc-mainnet.matic.network',
    symbol: 'MATIC',
    blockExplorerUrl: 'https://polygonscan.com/',
    decimals: 6
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
