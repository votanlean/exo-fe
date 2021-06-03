import {config} from "dotenv";

config();
console.log('process.env.NODE_ENV', process.env.NODE_ENV);

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledTEXO = require('../build/TEXOToken.json');

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.BLOCKCHAIN_HOST,
  0,
  10,
);
const web3 = new Web3(provider);

// Initialization
const abi = compiledTEXO.abi;
const orchestratorAddress = process.env.ORCHESTRATOR_ADDRESS;
const tEXOAddress = process.env.TEXO_ADDRESS;
const ownerAddress = process.env.OWNER_ADDRESS;
const deploy = async () => {
  try {
    const tEXOContract = new web3.eth.Contract(abi as any, tEXOAddress);
    console.log(`Attempting to set tEXO (${tEXOAddress}) ownership to Orchestrator from account ${ownerAddress}`);

    const txHash = await tEXOContract.methods
        .transferOwnership(orchestratorAddress)
        .send({
          from: ownerAddress,
          gas: '3000000',
        });

    console.log('Successfully set seeding pool:', txHash);
    console.log('========================================');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

deploy();
