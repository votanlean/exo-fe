const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

require('dotenv').config({
  path: path.resolve(__dirname, '../', isProd ? '.env.production' : '.env.development'),
});

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledOrchestrator = require('./build/TEXOOrchestrator.json');

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.BLOCKCHAIN_HOST,
  0,
  10
);
const web3 = new Web3(provider);

// Initialization
const abi = compiledOrchestrator.abi;
const bytecode = compiledOrchestrator.evm.bytecode.object;

const deploy = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);
  
    const devAddress = accounts[1];
    const feeAddress = accounts[2];
    const tEXOAddress = process.env.TEXO_ADDRESS;
  
    const startBlock = process.env.START_BLOCK;
    const blockToStartReducingEmissionRate = process.env.BLOCK_TO_START_REDUCING_EMISSION_RATE;
    const blockToUnlockClaimingRewards = process.env.BLOCK_TO_UNLOCK_CLAIMING_REWARDS;
  
    const result = await new web3.eth.Contract(abi)
      .deploy({
          data: bytecode,
          arguments: [
            tEXOAddress,
            devAddress,
            feeAddress,
            startBlock,
            blockToStartReducingEmissionRate,
            blockToUnlockClaimingRewards
          ]
      })
      .send({ gas: '9000000', from: accounts[0] });
  
    console.log('Orchestrator contract deployed to', result.options.address);
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

deploy();
