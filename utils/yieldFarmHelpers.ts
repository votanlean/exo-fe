import { bnbFarms } from 'config/constants/yieldFarms';

export const getYieldFarms = (chainId?: number): Array<any> => {
  switch (chainId) {
    case 56:
    case 5600:
    case 97:
    default:
      return bnbFarms;
  }
};
