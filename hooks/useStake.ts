import { useCallback, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch } from 'state';
import { stake, vaultStake } from 'utils/callHelpers';
import { Contract } from 'web3-eth-contract';
import { fetchPoolsUserDataAsync } from '../state/pools/reducer';
import { fetchFarmUserDataAsync } from '../state/farms/reducer';
import { fetchFAANGPoolsUserDataAsync } from '../state/fAANGpools/reducer';
import { useNetwork } from 'state/hooks';
import { fetchYieldUserData } from 'state/yield/reducer';

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

export const useVaultStake = (vault: Contract) => {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const [isLoading, setLoading] = useState(false);
  const currentNetwork = useNetwork();
  const { id: chainId } = currentNetwork || {};

  const handleStake = useCallback(
    async (amount: string, decimals: string) => {
      try {
        setLoading(true);
        const txHash = await vaultStake(vault, amount, account, decimals); // will ignore ref if null
        console.log('txHash: ', txHash);
        setLoading(false);
        console.info(txHash);
      } catch (error) {
        setLoading(false);
      }
    },
    [account, dispatch, vault, chainId],
  );
  return { onVaultStake: handleStake, isLoading };
};
