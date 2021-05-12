import web3 from './web3';
import Orchestrator from './build/TEXOOrchestrator.json';

const instance = new web3.eth.Contract(
  Orchestrator.abi,
  '0x7c3203Bc44e6b49c3cbfBc0F472Ae35E3aa23012'
);

export default instance;
