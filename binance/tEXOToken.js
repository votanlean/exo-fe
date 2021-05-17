import web3 from './web3';
import TEXOToken from './build/TEXOToken.json';

const instance = new web3.eth.Contract(
  TEXOToken.abi,
  '0x69E191beB3607072A45ac83eF6B7bc76F2420EF5'
);

export default instance;
