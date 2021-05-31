const path = require('path');

const isProd = process.env.NODE_ENV === 'prod';

require('dotenv').config({
  path: path.resolve(__dirname, '../', isProd ? 'prod.env' : 'dev.env'),
});

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledTimelock = require('./build/Timelock.json');

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.BLOCKCHAIN_HOST
);

const web3 = new Web3(provider);

// Initialization
const bytecode = compiledTimelock.evm.bytecode.object;
const abi = compiledTimelock.abi;

const deploy = async () => {
  try {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy timelock from account', accounts[0]);
  
    const result = await new web3.eth.Contract(abi)
      .deploy({
          data: bytecode,
          arguments: [
            accounts[0],
            '60'
          ]
        })
      .send({ gas: '3000000', from: accounts[0] });
  
    const address = result.options.address;
    console.log('Timelock contract deployed to', address);
    process.exit(0);
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

deploy();
