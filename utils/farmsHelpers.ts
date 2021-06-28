import { bnbFarms, polygonFarms } from 'config/constants/farms';

export const getFarms = (chainId?: number): Array<any> => {
  if (chainId === 56 || chainId === 97) {
    return bnbFarms;
  }
  if (chainId === 137 || chainId === 80001) {
    return polygonFarms;
  }
  return bnbFarms;
};
