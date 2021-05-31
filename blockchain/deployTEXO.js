const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

require('dotenv').config({
  path: path.resolve(__dirname, '../', isProd ? '.env.production' : '.env.development'),
});

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledTEXOToken = require('./build/TEXOToken.json');

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.BLOCKCHAIN_HOST
);

const web3 = new Web3(provider);

// Initialization
const bytecode = compiledTEXOToken.evm.bytecode.object;
const abi = compiledTEXOToken.abi;

const deploy = async () => {
  try {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(abi)
      .deploy({
          data: bytecode
        })
      .send({ gas: '3000000', from: accounts[0] });

    const address = result.options.address;
    console.log('Contract deployed to', address);
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

deploy();
