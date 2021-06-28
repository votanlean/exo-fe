import { Decimals } from 'config/constants/types';

export const getDecimals = (decimals: Decimals, chainId: number): string => {
  return decimals[chainId].toString();
};
