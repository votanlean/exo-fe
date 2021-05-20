import dotenv from 'dotenv';
import HDWalletProvider from 'truffle-hdwallet-provider';
import Web3 from 'web3';
import orchestratorInstance from '../orchestrator';
import Timelock from '../build/Timelock.json';

dotenv.config();

const changeOwnershipETA = 1621529883;

const orchestratorAddress = process.env.ORCHESTRATOR_ADDRESS;

const provider = new HDWalletProvider(
  process.env.MNEMONIC,
  process.env.BLOCKCHAIN_HOST,
  0,
  10
);

const web3 = new Web3(provider);
const encodeParameters = (types, data) => web3.eth.abi.encodeParameters(types, data);

const timelockInstance = new web3.eth.Contract(
  Timelock.abi as any,
  process.env.TIMELOCK_ADDRESS
);

async function queueChangeOwnership() {
  const accounts = await web3.eth.getAccounts();
  const eta = Math.round(new Date().valueOf() / 1000 + 60);
  console.log('eta is:', eta);
  

  const scheduledActions = await timelockInstance.methods
    .queueTransaction(
      orchestratorAddress,
      '0',
      'transferOwnership(address)',
      encodeParameters(['address'], [accounts[3]]),
      eta
    )
    .send({
      from: accounts[3],
      gas: '3000000'
    });

  console.log(scheduledActions);
}

async function executeChangeOwnership() {
  const accounts = await web3.eth.getAccounts();
  const executedTransaction = await timelockInstance.methods
      .executeTransaction(
        orchestratorAddress,
        '0',
        'transferOwnership(address)',
        encodeParameters(['address'], [accounts[3]]),
        changeOwnershipETA
      )
      .send({
        from: accounts[3],
        gas: '3000000'
      });
    
    console.log(executedTransaction);
}

async function runScript() {
  try {
    const accounts = await web3.eth.getAccounts();
    const owner = await orchestratorInstance.methods.owner().call({
      from: accounts[0],
    })
    console.log(owner);
    // await queueChangeOwnership();
    // await executeChangeOwnership();
  } catch (error) {
    console.log(error);
  }
}

runScript();