require('dotenv').config(); // Load .env
const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledOrchestrator = require('./build/TEXOOrchestrator.json');

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.BLOCKCHAIN_HOST
);
const web3 = new Web3(provider);

// Initialization
const bytecode = compiledOrchestrator.evm.bytecode.object;
const abi = compiledOrchestrator.abi;

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log('Attempting to deploy from account', accounts[0]);

  const ownerAddress = process.env.OWNER_ADDRESS; //also accounts[0]
  const devAddress = process.env.DEV_ADDRESS;
  const feeAddress = process.env.FEE_ADDRESS;
  const tEXOAddress = process.env.TEXO_ADDRESS;

  const startBlockCountFromNow = process.env.START_BLOCK_COUNT_FROM_NOW;
  const blockCountToStartReducingEmissionRateFromNow = process.env.BLOCK_COUNT_TO_START_REDUCING_EMISSION_RATE_FROM_NOW;
  const blockCountToUnlockClaimingRewardsFromNow = process.env.BLOCK_COUNT_TO_UNLOCK_CLAIMING_REWARDS_FROM_NOW;


  const result = await new web3.eth.Contract(abi)
    .deploy({
        data: bytecode,
        arguments: [
          tEXOAddress,
          devAddress,
          feeAddress,
          startBlockCountFromNow,
          blockCountToStartReducingEmissionRateFromNow,
          blockCountToUnlockClaimingRewardsFromNow
        ]
    })
    .send({ gas: '9000000', from: accounts[0] });

  console.log('Contract deployed to', result.options.address);
};
deploy();
