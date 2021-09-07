import { useSelector } from 'react-redux';
import { State } from '../types';

export const useAppPrices = () => {
  return useSelector((state: State) => state.appPrices.data);
};

export const useAppPricesLoading = () => {
  return useSelector((state: State) => state.appPrices.loading);
};
