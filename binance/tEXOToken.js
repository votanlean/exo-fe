import web3 from './web3';
import TEXOToken from './build/TEXOToken.json';

const instance = new web3.eth.Contract(
  TEXOToken.abi,
  '0x2D74216E8dB912C497A8775A74ea8166124b44F2'
);

export default instance;
