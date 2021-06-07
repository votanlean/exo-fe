require('dotenv').config();
console.log('process.env.NODE_ENV', process.env.NODE_ENV);

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
const orchestratorAddress = process.env.ORCHESTRATOR_ADDRESS;
const blockToUnlockClaimingRewards = process.env.BLOCK_TO_UNLOCK_CLAIMING_REWARDS;
const ownerAddress = process.env.OWNER_ADDRESS;
const chainId = process.env.CHAIN_ID;

const deploy = async () => {
  try {
    const orchestratorContract = new web3.eth.Contract(abi as any, orchestratorAddress);
    console.log('Attempting to deploy seeding pools from account', ownerAddress);

    for (let i = 0; i < lpPools.length; i++) {
      const lpPool = lpPools[i];
      console.log('Begin deploy LP pool:', lpPool.symbol);

      const txHash = await orchestratorContract.methods
        .add(
          '0',
          lpPool.address[chainId],
          lpPool.depositFeeBP,
          false,
          blockToUnlockClaimingRewards,
          blockToUnlockClaimingRewards,
        )
        .send({
          from: ownerAddress,
          gas: '3000000',
        });

      console.log('Successfully added LP pool:', txHash);
      console.log('========================================');
    }

    process.exit(0);
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

deploy();