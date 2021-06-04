require('dotenv').config();
console.log('process.env.NODE_ENV', process.env.NODE_ENV);

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledTimelock = require('./build/Timelock.json');

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.BLOCKCHAIN_HOST,
);

const web3 = new Web3(provider);

// Initialization
const bytecode = compiledTimelock.evm.bytecode.object;
const abi = compiledTimelock.abi;
const ownerAddress = process.env.OWNER_ADDRESS;

const deploy = async () => {
  try {
    console.log('Attempting to deploy timelock from account', ownerAddress);

    const result = await new web3.eth.Contract(abi)
      .deploy({
        data: bytecode,
        arguments: [ownerAddress, '60'],
      })
      .send({ gas: '3000000', from: ownerAddress });

    const address = result.options.address;
    console.log('Timelock contract deployed to', address);
    process.exit(0);
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

deploy();
