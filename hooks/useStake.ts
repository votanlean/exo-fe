import { useCallback, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch } from 'state';
import { stake } from 'utils/callHelpers';
import { Contract } from 'web3-eth-contract';
import { fetchPoolsUserDataAsync } from '../state/pools/reducer';
import { fetchFarmUserDataAsync } from '../state/farms/reducer';
import { fetchFAANGPoolsUserDataAsync } from '../state/fAANGpools/reducer';

export const useStake = (orchestrator: Contract, poolId: number) => {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const [isLoading, setLoading] = useState(false);

  const handleStake = useCallback(
    async (amount: string, ref: string | null = null) => {
      try {
        setLoading(true);
        const txHash = await stake(orchestrator, poolId, amount, account, ref); // will ignore ref if null
        setLoading(false);
        dispatch(fetchPoolsUserDataAsync(account));
        dispatch(fetchFarmUserDataAsync(account));
        dispatch(fetchFAANGPoolsUserDataAsync(account));
        console.info(txHash);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    },
    [account, dispatch, orchestrator, poolId],
  );

  return { onStake: handleStake, isLoading };
};
