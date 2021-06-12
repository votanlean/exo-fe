import { useCallback, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch } from 'state';
import { unstake } from 'utils/callHelpers';
import {
  useOrchestratorContract,
  useFAANGOrchestratorContract,
} from './useContract';
import { fetchFarmUserDataAsync } from '../state/farms/reducer';
import { fetchFAANGPoolsUserDataAsync } from '../state/fAANGpools/reducer';
import { fetchPoolsUserDataAsync } from '../state/pools/reducer';
import { Contract } from 'web3-eth-contract';

export const useUnstake = (orchestrator: Contract, pid: number) => {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const [isLoading, setLoading] = useState(false);

  const handleUnstake = useCallback(
    async (amount: string) => {
      try {
        setLoading(true);
        const txHash = await unstake(orchestrator, pid, amount, account);
        setLoading(false);
        dispatch(fetchPoolsUserDataAsync(account));
        dispatch(fetchFarmUserDataAsync(account));
        dispatch(fetchFAANGPoolsUserDataAsync(account));
        console.log('txHash useUnstake', txHash);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    },

    [account, dispatch, orchestrator, pid],
  );

  return { onUnstake: handleUnstake, isLoading };
};

export const useUnstakeFAANG = (pid: number) => {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const fAANGorchestrator = useFAANGOrchestratorContract();
  const [isLoading, setLoading] = useState(false);

  const handleUnstake = useCallback(
    async (amount: string) => {
      try {
        setLoading(true);
        const txHash = await unstake(fAANGorchestrator, pid, amount, account);
        setLoading(false);
        dispatch(fetchPoolsUserDataAsync(account));
        console.log('txHash useUnstakeFAANG', txHash);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    },

    [account, dispatch, fAANGorchestrator, pid],
  );

  return { onUnstake: handleUnstake, isLoading };
};
