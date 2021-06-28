import { useSelector } from 'react-redux';
import { FAANGPool, State } from 'state/types';
import { transformFAANGPool } from './helpers';
import { useWeb3React } from '@web3-react/core';
import useRefresh from '../../hooks/useRefresh';
import { useAppDispatch } from '../index';
import { useEffect } from 'react';
import { fetchFAANGPoolsUserDataAsync } from './reducer';
import { useNetwork } from 'state/hooks';

export const useFAANGPools = (): FAANGPool[] => {
  const { account } = useWeb3React();
  const { fastRefresh } = useRefresh();
  const dispatch = useAppDispatch();
  const { id: chainId } = useNetwork();
  useEffect(() => {
    if (account) {
      dispatch(fetchFAANGPoolsUserDataAsync(account, chainId));
    }
  }, [account, dispatch, fastRefresh, chainId]);

  const fAANGPools = useSelector((state: State) => {
    return state.fAANGpools.data;
  });
  return fAANGPools.map(transformFAANGPool);
};
