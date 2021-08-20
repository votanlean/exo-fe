import { Network } from 'state/types';
import { networks as networkFromWallet } from 'config/constants/networks';
import sample from './sample';

const networkIdsFromENV = JSON.parse(process.env.NETWORK_IDS);

const networks = networkFromWallet.filter((network) =>
  networkIdsFromENV.includes(network.id),
).map(({ rpcUrlsList, ...network }) => ({
  ...network,
  rpcUrl: sample(rpcUrlsList)
}));

export const getNetworks = (): Array<Network> => {
  return networks;
};

export const getNetworkById = (chainId: number) => networks.find(network => network.id === chainId);
