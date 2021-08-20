export const networks = [
  {
    id: 97,
    name: 'Binance',
    icon: '/static/images/wallets/binance.svg',
    type: 'binance',
    iconDisable: '/static/images/wallets/binance-disabled.svg',
    rpcUrlsList: [
      'https://data-seed-prebsc-1-s1.binance.org:8545/'
    ],
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
    rpcUrlsList: [
      'https://bsc-dataseed.binance.org/',
      'https://bsc-dataseed1.defibit.io/',
      'https://bsc-dataseed1.ninicoin.io/',
    ],
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
    rpcUrlsList: [
      'https://rpc-mumbai.maticvigil.com/v1/e5cf98dd4b3c2e17a1e632cf66d5eb98d3a9b6dd',
    ],
    symbol: 'MATIC',
    blockExplorerName: 'Polygonscan',
    blockExplorerUrl: 'https://polygonscan.com',
    decimals: 6,
    startBlock: '99999999',
    secondsPerBlock: 4,
    swapLink: 'https://quickswap.exchange/#/swap?outputCurrency='
  },
  {
    id: 137,
    name: 'Polygon',
    icon: '/static/images/wallets/polygon.svg',
    type: 'polygon',
    iconDisable: '/static/images/wallets/polygon-disabled.svg',
    rpcUrlsList: [
      'https://rpc-mainnet.maticvigil.com/v1/e5cf98dd4b3c2e17a1e632cf66d5eb98d3a9b6dd',
    ],
    symbol: 'MATIC',
    blockExplorerName: 'Polygonscan',
    blockExplorerUrl: 'https://polygonscan.com',
    decimals: 6,
    startBlock: '17694805',
    secondsPerBlock: 2.3,
    swapLink: 'https://quickswap.exchange/#/swap?outputCurrency='
  },
];