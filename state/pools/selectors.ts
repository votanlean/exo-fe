import { useSelector } from 'react-redux';
import { Pool, State } from 'state/types';
import { transformPool } from './helpers';

export const usePools = (): Pool[] => {
  const pools = useSelector((state: State) => state.pools.data);
  return pools.map(transformPool);
};
