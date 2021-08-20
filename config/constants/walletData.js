import { ConnectorNames } from '../../utils/web3React';

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
