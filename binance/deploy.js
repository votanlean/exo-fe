const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledTEXOToken = require('./build/TEXOToken.json');

const provider = new HDWalletProvider(
  'breeze moral tent state fiscal host tank approve kiss clap certain lunar',
  'https://data-seed-prebsc-1-s1.binance.org:8545'
);
const web3 = new Web3(provider);

// Initialization
const bytecode = compiledTEXOToken.evm.bytecode.object;
const abi = compiledTEXOToken.abi;


const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(abi)
    .deploy({
        data: bytecode
      })
    .send({ gas: '3000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
};
deploy();
