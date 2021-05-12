const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledOrchestrator = require('./build/TEXOOrchestrator.json');

const provider = new HDWalletProvider(
  'breeze moral tent state fiscal host tank approve kiss clap certain lunar',
  'https://data-seed-prebsc-1-s1.binance.org:8545'
);
const web3 = new Web3(provider);

// Initialization
const bytecode = compiledOrchestrator.evm.bytecode.object;
const abi = compiledOrchestrator.abi;

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(abi)
    .deploy({
        data: bytecode,
        arguments: ['0x40e2e3D08EcD588041Cd816176bBd25571cFa205','0x92Ae23F2E06FcB93B243f202b1293aAD28D8570C', '0x2D73E87aB654fBa456df778016ce8105Fc04f126']

    })
    .send({ gas: '9000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
};
deploy();
