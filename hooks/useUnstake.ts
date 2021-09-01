import { useCallback, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useAppDispatch } from 'state';
import { emergencyWithdraw, unstake, vaultUnStake } from 'utils/callHelpers';
import {
  useOrchestratorContract,
  useFAANGOrchestratorContract,
} from './useContract';
import { fetchFarmUserDataAsync } from '../state/farms/reducer';
import { fetchFAANGPoolsUserDataAsync } from '../state/fAANGpools/reducer';
import { fetchPoolsUserDataAsync } from '../state/pools/reducer';
import { Contract } from 'web3-eth-contract';
import { useNetwork } from 'state/hooks';
import { getDecimals } from 'utils/decimalsHelper';
import { fetchYieldUserData } from 'state/yield/reducer';

export const useUnstake = (orchestrator: Contract, pid: number) => {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const [isLoading, setLoading] = useState(false);
  const currentNetwork = useNetwork();
  const { id: chainId } = currentNetwork || {};

  const handleUnstake = useCallback(
    async (amount: string, decimals: string) => {
      try {
        setLoading(true);
        const txHash = await unstake(
          orchestrator,
          pid,
          amount,
          account,
          decimals,
        );
        setLoading(false);
        dispatch(fetchPoolsUserDataAsync(account, chainId));
        dispatch(fetchFarmUserDataAsync(account, chainId));
        dispatch(fetchFAANGPoolsUserDataAsync(account, chainId));
      } catch (error) {
        setLoading(false);
      }
    },

    [account, dispatch, orchestrator, pid, chainId],
  );

  return { onUnstake: handleUnstake, isLoading };
};

export const useUnstakeFAANG = (pid: number) => {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const fAANGorchestrator = useFAANGOrchestratorContract();
  const [isLoading, setLoading] = useState(false);
  const currentNetwork = useNetwork();
  const { id: chainId } = currentNetwork || {};

  const handleUnstake = useCallback(
    async (amount: string, decimals: string) => {
      try {
        setLoading(true);
        const txHash = await unstake(
          fAANGorchestrator,
          pid,
          amount,
          account,
          decimals,
        );
        setLoading(false);
        dispatch(fetchPoolsUserDataAsync(account, chainId));
      } catch (error) {
        setLoading(false);
      }
    },

    [account, dispatch, fAANGorchestrator, pid, chainId],
  );

  return { onUnstake: handleUnstake, isLoading };
};

export const useVaultUnstake = (vault: Contract) => {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const [isLoading, setLoading] = useState(false);
  const currentNetwork = useNetwork();
  const { id: chainId } = currentNetwork || {};

  const handleUnstake = useCallback(
    async (amount: string, decimals: string) => {
      try {
        setLoading(true);
        const txHash = await vaultUnStake(vault, amount, account, decimals);
        setLoading(false);
        console.info(txHash);
      } catch (error) {
        setLoading(false);
      }
    },
    [account, dispatch, vault, chainId],
  );

  return { onVaultUnstake: handleUnstake, isLoading };
};

export const useEmergencyWithdraw = (orchestrator: Contract, poolId: Number) => {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const [isLoading, setLoading] = useState(false);
  const currentNetwork = useNetwork();
  const { id: chainId } = currentNetwork || {};

  const handleUnstake = useCallback(
    async () => {
      try {
        setLoading(true);
        const txHash = await emergencyWithdraw(orchestrator, poolId, account);
        setLoading(false);
        console.info(txHash);
      } catch (error) {
        setLoading(false);
      }
    },
    [account, dispatch, orchestrator, chainId],
  );

  return { onEmergencyWithdraw: handleUnstake, isLoading };
};
