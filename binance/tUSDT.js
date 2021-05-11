import web3 from './web3';
import TEXOToken from './build/TEXOToken.json';

const instance = new web3.eth.Contract(
  TEXOToken.abi,
  '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd'
);

export default instance;
