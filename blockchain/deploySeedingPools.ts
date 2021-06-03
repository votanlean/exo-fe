require('dotenv').config();
console.log('process.env.NODE_ENV', process.env.NODE_ENV);

import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from 'web3';
import compiledOrchestrator from './build/TEXOOrchestrator.json';
import seedingPools from '../config/constants/seedingPools';

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.BLOCKCHAIN_HOST
);
const web3 = new Web3(provider);

// Initialization
const abi = compiledOrchestrator.abi;
const orchestratorAddress = process.env.ORCHESTRATOR_ADDRESS;
const chainId = process.env.CHAIN_ID;

const deploy = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    const orchestratorContract = new web3.eth.Contract(abi as any, orchestratorAddress);
    console.log('Attempting to deploy seeding pools from account', accounts[0]);

    for (let i = 0; i < seedingPools.length; i++) {
      const seedingPool = seedingPools[i];
      console.log('Begin deploy seeding pool:', seedingPool.symbol);

      const txHash = await orchestratorContract.methods
        .add(
          seedingPool.displayAllocPoint,
          seedingPool.stakingToken.address[chainId],
          seedingPool.depositFeeBP,
          false,
          '0',
          '0',
        )
        .send({
          from: accounts[0],
          gas: '3000000',
        });

      console.log('Successfully added seeding pool:', txHash);
      console.log('========================================');
    }

    process.exit(0);
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

deploy();
