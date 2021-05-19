import web3 from './web3';
import Timelock from './build/Timelock.json';


const instance = new web3.eth.Contract(
  Timelock.abi,
  process.env.TIMELOCK_ADDRESS
);

export default instance;
