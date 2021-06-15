import { useSelector } from 'react-redux';
import { State } from '../types';

export const useAppPrices = () => {
  return useSelector((state: State) => state.appPrices.data);
};
