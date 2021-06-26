import { useSelector } from 'react-redux';
import { Pool, State } from 'state/types';
import { transformPool } from './helpers';
import { useWeb3React } from '@web3-react/core';
import useRefresh from '../../hooks/useRefresh';
import { useAppDispatch } from '../index';
import { useEffect } from 'react';
import { fetchPoolsUserDataAsync } from './reducer';
import { useNetwork } from 'state/hooks';

export const usePools = (): Pool[] => {
  const { account } = useWeb3React();
  const { fastRefresh } = useRefresh();
  const { id: chainId } = useNetwork();
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account, chainId));
    }
  }, [account, dispatch, fastRefresh]);

  const pools = useSelector((state: State) => state.pools.data);
  return pools.map(transformPool);
};
