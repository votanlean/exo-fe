import web3 from './web3';
import TEXOToken from './build/TEXOToken.json';

const instance = new web3.eth.Contract(
  TEXOToken.abi,
  process.env.TEXO_ADDRESS
);

export default instance;
