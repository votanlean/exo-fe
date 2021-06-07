import { useSelector } from 'react-redux';
import { FAANGPool, State } from 'state/types';
import { transformFAANGPool } from './helpers';

export const useFAANGPools = (): FAANGPool[] => {
  const fAANGPools = useSelector((state: State) => {
    return state.fAANGpools.data;
  });
  return fAANGPools.map(transformFAANGPool);
};
