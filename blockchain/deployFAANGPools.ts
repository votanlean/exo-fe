require('dotenv').config();

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
const envFAANGOrchestratorAddress = process.env.FAANG_ORCHESTRATOR_ADDRESS;
const chainId = process.env.CHAIN_ID;
const ownerAddress = process.env.OWNER_ADDRESS;

export default async (deployedFAANgOrchestratorAddress = '', deployedFAANGToken = '') => {
  try {
    const fAANGOrchestratorContract = new web3.eth.Contract(abi as any, deployedFAANgOrchestratorAddress || envFAANGOrchestratorAddress);

    for (let i = 0; i < FAANGPools.length; i++) {
      const fAANGPool = FAANGPools[i];
      console.log('Begin deploy FAANG pool:', fAANGPool.symbol);

      fAANGOrchestratorContract.methods
        .add(
          deployedFAANGToken || fAANGPool.stakingToken.address[chainId],
          false
        )
        .send({
          from: ownerAddress,
          gas: '3000000',
        });

      console.log('Successfully added FAANG pool:', fAANGPool.symbol);
      console.log('========================================');
    }
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};
