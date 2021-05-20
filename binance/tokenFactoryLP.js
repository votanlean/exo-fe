import web3 from './web3';
import TEXOToken from './build/TEXOToken.json';
import { liquidityPool } from '../constant/PoolData';

export const lpPoolToken = liquidityPool.map(data => {
  const tokenInstance = new web3.eth.Contract(
    TEXOToken.abi,
    data.address,
  );

  return {
    ...data,
    tokenInstance,
  }
});
