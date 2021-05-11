import web3 from './web3';
import TEXOToken from './build/TEXOToken.json';

const instance = new web3.eth.Contract(
  TEXOToken.abi,
  '0x3bbabe10348e557690c41794392e811d41d18511'
);

export default instance;
