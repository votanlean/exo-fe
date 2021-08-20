import { networks } from 'config/constants/networks';
import sample from './sample';

const getNodeUrl = (chainId: number) => {
  const network = networks.find(({ id }) => id === chainId);
  return sample(network.rpcUrlsList);
};

export default getNodeUrl;
