import web3 from './web3';
import Orchestrator from './build/TEXOOrchestrator.json';

const instance = new web3.eth.Contract(
  Orchestrator.abi,
  '0x0858D45821a181Db523c06bfDC54d2B13dce5f7C'
);

export default instance;
