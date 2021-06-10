require('dotenv').config();

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledFAANGToken = require('./build/FAANGToken.json');

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.BLOCKCHAIN_HOST,
);

const web3 = new Web3(provider);

// Initialization
const bytecode = compiledFAANGToken.evm.bytecode.object;
const abi = compiledFAANGToken.abi;
const ownerAddress = process.env.OWNER_ADDRESS;

const deploy = async () => {
  try {
    const result = await new web3.eth.Contract(abi)
      .deploy({
        data: bytecode,
      })
      .send({ gas: '3000000', from: ownerAddress });

    const address = result.options.address;

    return address;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = deploy;