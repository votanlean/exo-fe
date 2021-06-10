require('dotenv').config();

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

const deploy = async (deployedFAANGAddress = '') => {
  try {
    const ownerAddress = process.env.OWNER_ADDRESS;
    const fAANGAddress = deployedFAANGAddress || process.env.FAANG_ADDRESS;

    const startBlock = process.env.START_BLOCK;

    const result = await new web3.eth.Contract(abi)
      .deploy({
        data: bytecode,
        arguments: [fAANGAddress, startBlock],
      })
      .send({ gas: '9000000', from: ownerAddress });

    return result.options.address;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = deploy;
