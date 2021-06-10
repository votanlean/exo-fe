import { useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Contract } from 'web3-eth-contract';
import { useAppDispatch } from 'state';
import { approve } from 'utils/callHelpers';
import {
  useFAANGOrchestratorContract,
  useOrchestratorContract,
} from './useContract';
import { fetchPoolsUserDataAsync } from '../state/pools/reducer';
import { fetchFarmUserDataAsync } from '../state/farms/reducer';
import { fetchFAANGPoolsUserDataAsync } from '../state/fAANGpools/reducer';

// Approve a Pool
export const useApprove = (
  stakeTokenContract: Contract,
  orchestratorContract: Contract,
  poolId,
) => {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(
        stakeTokenContract,
        orchestratorContract,
        account,
      );
      dispatch(fetchPoolsUserDataAsync(account));
      dispatch(fetchFarmUserDataAsync(account));
      dispatch(fetchFAANGPoolsUserDataAsync(account));
      return tx;
    } catch (e) {
      return false;
    }
  }, [account, dispatch, stakeTokenContract, orchestratorContract, poolId]);

  return { onApprove: handleApprove };
};
