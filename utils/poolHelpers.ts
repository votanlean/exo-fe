import {
  polygonSeedingPools,
  bnbSeedingPools,
} from 'config/constants/seedingPools';

import { bnbFAANGPools, polygonFAANGPools } from 'config/constants/fAANGPools';

export const getSeedingPools = (chainId?: number): Array<any> => {
  if (chainId === 56 || chainId === 97) {
    return bnbSeedingPools;
  }
  if (chainId === 137 || chainId === 80001) {
    return polygonSeedingPools;
  }
  return bnbSeedingPools;
};

export const getFAANGPools = (chainId?: number): Array<any> => {
  if (chainId === 56 || chainId === 97) {
    return bnbFAANGPools;
  }
  if (chainId === 137 || chainId === 80001) {
    return polygonFAANGPools;
  }
  return bnbFAANGPools;
};
