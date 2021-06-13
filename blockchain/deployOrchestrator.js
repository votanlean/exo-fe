require('dotenv').config();

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const compiledOrchestrator = require('./build/TEXOOrchestrator.json');

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.BLOCKCHAIN_HOST,
  0,
  10,
);
const web3 = new Web3(provider);

// Initialization
const abi = compiledOrchestrator.abi;
const bytecode = compiledOrchestrator.evm.bytecode.object;

const deploy = async (deployedTEXOAddress = '') => {
  try {
    const ownerAddress = process.env.OWNER_ADDRESS;
    const devAddress = process.env.DEV_ADDRESS; //accounts[1]
    const feeAddress = process.env.FEE_ADDRESS; //accounts[2]
    const tEXOAddress = deployedTEXOAddress || process.env.TEXO_ADDRESS;

    const blockToStartReducingEmissionRate =
      process.env.BLOCK_TO_START_REDUCING_EMISSION_RATE;

    const result = await new web3.eth.Contract(abi)
      .deploy({
        data: bytecode,
        arguments: [
          tEXOAddress,
          devAddress,
          feeAddress,
          blockToStartReducingEmissionRate,
        ],
      })
      .send({ gas: '9000000', from: ownerAddress });

    const address = result.options.address;

    return address;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = deploy;
