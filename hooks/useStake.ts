import { useCallback, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch } from 'state';
import { stake } from 'utils/callHelpers';
import { Contract } from 'web3-eth-contract';
import { fetchPoolsUserDataAsync } from '../state/pools/reducer';
import { fetchFarmUserDataAsync } from '../state/farms/reducer';
import { fetchFAANGPoolsUserDataAsync } from '../state/fAANGpools/reducer';
import { useNetwork } from 'state/hooks';
import { getDecimals } from 'utils/decimalsHelper';

export const useStake = (orchestrator: Contract, poolId: number) => {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const [isLoading, setLoading] = useState(false);
  const currentNetwork = useNetwork();
  const { id: chainId } = currentNetwork || {};

  const handleStake = useCallback(
    async (amount: string, ref: string | null = null, decimals: string) => {
      try {
        setLoading(true);
        const txHash = await stake(
          orchestrator,
          poolId,
          amount,
          account,
          ref,
          decimals,
        ); // will ignore ref if null
        setLoading(false);
        dispatch(fetchPoolsUserDataAsync(account, chainId));
        dispatch(fetchFarmUserDataAsync(account, chainId));
        dispatch(fetchFAANGPoolsUserDataAsync(account, chainId));
        console.info(txHash);
      } catch (error) {
        setLoading(false);
      }
    },
    [account, dispatch, orchestrator, poolId, chainId],
  );

  return { onStake: handleStake, isLoading };
};
