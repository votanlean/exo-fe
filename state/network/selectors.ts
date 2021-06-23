import { useSelector } from 'react-redux';
import { State } from '../types';

export const useNetworkSelector = () => {
  return useSelector((state: State) => state.network);
};
