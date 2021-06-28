import { useCallback, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch } from 'state';
import { harvest } from 'utils/callHelpers';

import { fetchFarmUserDataAsync } from '../state/farms/reducer';
import { fetchFAANGPoolsUserDataAsync } from '../state/fAANGpools/reducer';
import { fetchPoolsUserDataAsync } from '../state/pools/reducer';
import { Contract } from 'web3-eth-contract';
import { useNetwork } from 'state/hooks';

export const useHarvest = (orchestrator: Contract, poolId: number) => {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const [isLoading, setLoading] = useState(false);
  const { id: chainId } = useNetwork();

  const handleHarvest = useCallback(async () => {
    try {
      setLoading(true);
      const txHash = await harvest(orchestrator, poolId, account);
      setLoading(false);
      dispatch(fetchPoolsUserDataAsync(account, chainId));
      dispatch(fetchFarmUserDataAsync(account, chainId));
      dispatch(fetchFAANGPoolsUserDataAsync(account, chainId));
      return txHash;
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, [account, dispatch, poolId, orchestrator]);

  return { onReward: handleHarvest, isLoading };
};
