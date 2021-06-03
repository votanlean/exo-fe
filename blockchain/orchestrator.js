import web3 from './web3';
import Orchestrator from './build/TEXOOrchestrator.json';

const instance = new web3.eth.Contract(
  Orchestrator.abi,
  process.env.ORCHESTRATOR_ADDRESS,
);

export default instance;
