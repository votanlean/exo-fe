require('dotenv').config();

import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from 'web3';
import compiledOrchestrator from './build/TEXOOrchestrator.json';
import lpPools from '../config/constants/farms';

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.BLOCKCHAIN_HOST
);
const web3 = new Web3(provider);

// Initialization
const abi = compiledOrchestrator.abi;
const envOrchestratorAddress = process.env.ORCHESTRATOR_ADDRESS;
const blockToUnlockClaimingRewards = process.env.BLOCK_TO_UNLOCK_CLAIMING_REWARDS;
const ownerAddress = process.env.OWNER_ADDRESS;
const chainId = process.env.CHAIN_ID;

export default async (deployedOrchestratorAddress = '') => {
  try {
    const orchestratorContract = new web3.eth.Contract(abi as any, deployedOrchestratorAddress || envOrchestratorAddress);

    for (let i = 0; i < lpPools.length; i++) {
      const lpPool = lpPools[i];
      console.log('Begin deploy LP pool:', lpPool.symbol);

      await orchestratorContract.methods
        .add(
          '0',
          lpPool.address[chainId],
          lpPool.depositFeeBP,
          false,
          blockToUnlockClaimingRewards,
          blockToUnlockClaimingRewards,
          '0'
        )
        .send({
          from: ownerAddress,
          gas: '3000000',
        });

      console.log('Successfully added LP pool:', lpPool.symbol);
      console.log('========================================');
    }
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};
