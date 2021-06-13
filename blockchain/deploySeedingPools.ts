require('dotenv').config();

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
const envOrchestratorAddress = process.env.ORCHESTRATOR_ADDRESS;
const chainId = process.env.CHAIN_ID;
const blockToUnlockClaimingRewards = process.env.BLOCK_TO_UNLOCK_CLAIMING_REWARDS;
const ownerAddress = process.env.OWNER_ADDRESS;
const startBlock = process.env.START_BLOCK;

export default async (deployedOrchestratorAddress = '') => {
  try {
    const orchestratorContract = new web3.eth.Contract(abi as any, deployedOrchestratorAddress || envOrchestratorAddress);

    for (let i = 0; i < seedingPools.length; i++) {
      const seedingPool = seedingPools[i];
      console.log('Begin deploy seeding pool:', seedingPool.symbol);

      await orchestratorContract.methods
          .add(
              seedingPool.displayAllocPoint,
              seedingPool.stakingToken.address[chainId],
              seedingPool.depositFeeBP,
              false,
              startBlock,
              blockToUnlockClaimingRewards,
              startBlock + 5 * 28800, // finish after 5 days
          )
          .send({
            from: ownerAddress,
            gas: '3000000',
          });

      console.log('Successfully added seeding pool:', seedingPool.symbol);
      console.log('========================================');
    }
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};
