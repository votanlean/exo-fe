import web3 from './web3';
import Orchestrator from './build/TEXOOrchestrator.json';

const instance = new web3.eth.Contract(
  Orchestrator.abi,
  '0xdA181fE906Ee2ee23042B73fb0691086bF64e0f9'
);

export default instance;
