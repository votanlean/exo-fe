import { useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch } from 'state';
import { harvest } from 'utils/callHelpers';

import { fetchFarmUserDataAsync } from '../state/farms/reducer';
import { fetchFAANGPoolsUserDataAsync } from '../state/fAANGpools/reducer';
import { fetchPoolsUserDataAsync } from '../state/pools/reducer';
import { Contract } from 'web3-eth-contract';

export const useHarvest = (orchestrator: Contract, poolId: number) => {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();

  const handleHarvest = useCallback(async () => {
    const txHash = await harvest(orchestrator, poolId, account);
    dispatch(fetchPoolsUserDataAsync(account));
    dispatch(fetchFarmUserDataAsync(account));
    dispatch(fetchFAANGPoolsUserDataAsync(account));
    return txHash;
  }, [account, dispatch, poolId, orchestrator]);

  return { onReward: handleHarvest };
};
