require('dotenv').config(); // Load .env
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledContract = require('./build/Timelock.json');

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.BLOCKCHAIN_HOST
);
const web3 = new Web3(provider);

// Initialization
const bytecode = compiledContract.evm.bytecode.object;
const abi = compiledContract.abi;


const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(abi)
    .deploy({
        data: bytecode
      })
    .send({ gas: '3000000', from: accounts[0] });

  const address = result.options.address;
  console.log('Contract deployed to', address);
};
deploy();
