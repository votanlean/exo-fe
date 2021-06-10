import { useSelector } from 'react-redux';
import { FAANGPool, State } from 'state/types';
import { transformFAANGPool } from './helpers';
import { useWeb3React } from '@web3-react/core';
import useRefresh from '../../hooks/useRefresh';
import { useAppDispatch } from '../index';
import { useEffect } from 'react';
import { fetchFAANGPoolsUserDataAsync } from './reducer';

export const useFAANGPools = (): FAANGPool[] => {
  const { account } = useWeb3React();
  const { fastRefresh } = useRefresh();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (account) {
      dispatch(fetchFAANGPoolsUserDataAsync(account));
    }
  }, [account, dispatch, fastRefresh]);

  const fAANGPools = useSelector((state: State) => {
    return state.fAANGpools.data;
  });
  return fAANGPools.map(transformFAANGPool);
};
