import web3 from './web3';
import TEXOToken from './build/TEXOToken.json';
import { poolData } from '../constant/PoolData';

export const poolToken = poolData.map(data => {
  const tokenInstance = new web3.eth.Contract(
    TEXOToken.abi,
    data.address,
  );

  return {
    ...data,
    tokenInstance,
  }
});




// const instance = new web3.eth.Contract(
//   TEXOToken.abi,
//   '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd'
// );
//
// export default instance;
