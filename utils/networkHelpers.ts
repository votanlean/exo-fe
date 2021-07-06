import { Network } from 'state/types';
import { networks as networkFromWallet } from 'config/constants/walletData';

const getNetworks = (): Array<Network> => {
  const networkIdsFromENV = JSON.parse(process.env.NETWORK_IDS);

  const networks = networkFromWallet.filter((network) =>
    networkIdsFromENV.includes(network.id),
  );

  return networks;
};

export { getNetworks };
