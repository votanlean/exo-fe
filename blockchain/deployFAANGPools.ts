require('dotenv').config();
console.log('process.env.NODE_ENV', process.env.NODE_ENV);

import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from 'web3';
import compiledOrchestrator from './build/FAANGOrchestrator.json';
import FAANGPools from '../config/constants/fAANGPools';

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.BLOCKCHAIN_HOST
);
const web3 = new Web3(provider);

// Initialization
const abi = compiledOrchestrator.abi;
const fAANGOrchestratorAddress = process.env.FAANG_ORCHESTRATOR_ADDRESS;
const chainId = process.env.CHAIN_ID;
const ownerAddress = process.env.OWNER_ADDRESS;

const deploy = async () => {
  try {
    const fAANGOrchestratorContract = new web3.eth.Contract(abi as any, fAANGOrchestratorAddress);
    console.log('Attempting to deploy FAANG pools from account', ownerAddress);

    for (let i = 0; i < FAANGPools.length; i++) {
      const fAANGPool = FAANGPools[i];
      console.log('Begin deploy FAANG pool:', fAANGPool.symbol);

      const txHash = await fAANGOrchestratorContract.methods
        .add(
          fAANGPool.stakingToken.address[chainId],
          false
        )
        .send({
          from: ownerAddress,
          gas: '3000000',
        });

      console.log('Successfully added FAANG pool:', txHash);
      console.log('========================================');
    }

    process.exit(0);
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

deploy();
