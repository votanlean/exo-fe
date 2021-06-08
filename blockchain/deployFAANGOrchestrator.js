require('dotenv').config();
console.log('process.env.NODE_ENV', process.env.NODE_ENV);

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFAANGOrchestrator = require('./build/FAANGOrchestrator.json');

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.BLOCKCHAIN_HOST,
  0,
  10,
);
const web3 = new Web3(provider);

// Initialization
const abi = compiledFAANGOrchestrator.abi;
const bytecode = compiledFAANGOrchestrator.evm.bytecode.object;

const deploy = async () => {
  try {
    const ownerAddress = process.env.OWNER_ADDRESS;
    console.log('Attempting to deploy from account', ownerAddress);

    const fAANGAddress = process.env.FAANG_ADDRESS;

    const startBlock = process.env.START_BLOCK;

    const result = await new web3.eth.Contract(abi)
      .deploy({
        data: bytecode,
        arguments: [fAANGAddress, startBlock],
      })
      .send({ gas: '9000000', from: ownerAddress });

    console.log(
      'FAANG Orchestrator contract deployed to',
      result.options.address,
    );
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

deploy();
