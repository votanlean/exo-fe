import { useSelector } from 'react-redux';
import { State, Network } from './types';

export const useNetwork = () => {
  const network: Network = useSelector((state: State) => state.network);

  return network;
};

export const useAppTheme = () => {
  const theme = useSelector((state: State) => state.theme);

  return theme;
};
