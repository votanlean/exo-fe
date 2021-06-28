import {
  polygonSeedingPools,
  bnbSeedingPools,
} from 'config/constants/seedingPools';

export const getSeedingPools = (chainId?: number): Array<any> => {
  if (chainId === 56 || chainId === 97) {
    return bnbSeedingPools;
  }
  if (chainId === 137 || chainId === 80001) {
    console.log('heheeh');
    return polygonSeedingPools;
  }
  return bnbSeedingPools;
};
