import {config} from "dotenv";

config();
console.log('process.env.NODE_ENV', process.env.NODE_ENV);

import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from 'web3';
import compiledOrchestrator from '../build/TEXOOrchestrator.json';

const provider = new HDWalletProvider(
    process.env.MNEMONIC,
    process.env.BLOCKCHAIN_HOST
);
const web3 = new Web3(provider);

// Initialization
const abi = compiledOrchestrator.abi;
const orchestratorAddress = process.env.ORCHESTRATOR_ADDRESS;

const deploy = async () => {
    try {
        const ownerAddress = process.env.OWNER_ADDRESS;
        const referredAddress = process.env.OWNER_ADDRESS;
        const referrerAddress = process.env.OWNER_ADDRESS;
        const orchestratorContract = new web3.eth.Contract(abi as any, orchestratorAddress);

        const referrer = await orchestratorContract.methods
            .referrers(referredAddress)
            .call({
                from: ownerAddress
            });

        console.log(`Address ${referredAddress} is referred from ${referrer}`);
        console.log('========================================');

        const referralCount = await orchestratorContract.methods
            .referredCount(referrerAddress)
            .call({
                from: ownerAddress
            });

        console.log(`referrer ${referrerAddress} has ${referralCount} referrals`);
        console.log('========================================');

        process.exit(0);
    } catch (error) {
        console.log(error);

        process.exit(1);
    }
};

deploy();
