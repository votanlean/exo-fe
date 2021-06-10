import tokens from './tokens';
import contracts from './contracts';

const seedingPools = [
  {
    id: 0,
    icon: '/static/images/pool/USDT.png',
    title: 'USDT Pool',
    stakingToken: tokens.usdt,
    earningToken: tokens.texo,
    contractAddress: contracts.orchestrator,
    displayAllocPoint: 400,
    depositFeeBP: 400,
    symbol: 'USDT',
  },
  {
    id: 1,
    icon: '/static/images/pool/wBNB.png',
    title: 'wBNB Pool',
    stakingToken: tokens.wbnb,
    earningToken: tokens.texo,
    contractAddress: contracts.orchestrator,
    displayAllocPoint: 300,
    depositFeeBP: 400,
    symbol: 'wBNB',
  },
  {
    id: 2,
    icon: '/static/images/pool/BUSD.png',
    title: 'BUSD Pool',
    stakingToken: tokens.busd,
    earningToken: tokens.texo,
    contractAddress: contracts.orchestrator,
    displayAllocPoint: 400,
    depositFeeBP: 400,
    symbol: 'BUSD',
  },
  {
    id: 3,
    icon: '/static/images/pool/CAKE.jpeg',
    title: 'CAKE Pool',
    stakingToken: tokens.cake,
    earningToken: tokens.texo,
    contractAddress: contracts.orchestrator,
    displayAllocPoint: 200,
    depositFeeBP: 400,
    symbol: 'CAKE',
  },
  {
    id: 4,
    icon: '/static/images/pool/BTCB.jpeg',
    title: 'BTCB Pool',
    stakingToken: tokens.btcb,
    earningToken: tokens.texo,
    contractAddress: contracts.orchestrator,
    displayAllocPoint: 200,
    depositFeeBP: 400,
    symbol: 'BTCB',
  },
  {
    id: 5,
    icon: '/static/images/pool/ETH.png',
    title: 'ETH Pool',
    stakingToken: tokens.eth,
    earningToken: tokens.texo,
    contractAddress: contracts.orchestrator,
    displayAllocPoint: 200,
    depositFeeBP: 400,
    symbol: 'ETH',
  },
  {
    id: 6,
    icon: '/static/images/pool/BUNNY.png',
    title: 'BUNNY Pool',
    stakingToken: tokens.bunny,
    earningToken: tokens.texo,
    contractAddress: contracts.orchestrator,
    displayAllocPoint: 200,
    depositFeeBP: 400,
    symbol: 'BUNNY',
  },
  {
    id: 7,
    icon: '/static/images/pool/XVS.jpeg',
    title: 'XVS Pool',
    stakingToken: tokens.xvs,
    earningToken: tokens.texo,
    contractAddress: contracts.orchestrator,
    displayAllocPoint: 200,
    depositFeeBP: 400,
    symbol: 'XVS',
  },
  {
    id: 8,
    icon: '/static/images/pool/USDC.png',
    title: 'USDC Pool',
    stakingToken: tokens.usdc,
    earningToken: tokens.texo,
    contractAddress: contracts.orchestrator,
    displayAllocPoint: 400,
    depositFeeBP: 400,
    symbol: 'USDC',
  },
  {
    id: 9,
    icon: '/static/images/pool/DAI.png',
    title: 'DAI Pool',
    stakingToken: tokens.dai,
    earningToken: tokens.texo,
    contractAddress: contracts.orchestrator,
    displayAllocPoint: 400,
    depositFeeBP: 400,
    symbol: 'DAI',
  },
  {
    id: 10,
    icon: '/static/images/pool/DOT.png',
    title: 'DOT Pool',
    stakingToken: tokens.dot,
    earningToken: tokens.texo,
    contractAddress: contracts.orchestrator,
    displayAllocPoint: 200,
    depositFeeBP: 400,
    symbol: 'DOT',
  },
];

export default seedingPools;
