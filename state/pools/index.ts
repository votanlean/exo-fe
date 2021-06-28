import { PoolsSlice } from './reducer';
import {
  fetchPoolsAllowance,
  fetchUserBalances,
  fetchUserStakeBalances,
} from './fetchPoolsUser';
import { updatePoolsUserData } from './reducer';
export const updateUserAllowance =
  (poolId: number, account: string, chainId: number) => async (dispatch) => {
    const allowances = await fetchPoolsAllowance(account, chainId);
    dispatch(
      updatePoolsUserData({
        poolId,
        field: 'allowance',
        value: allowances[poolId],
      }),
    );
  };

export const updateUserBalance =
  (poolId: number, account: string, chainId: number) => async (dispatch) => {
    const tokenBalances = await fetchUserBalances(account, chainId);
    dispatch(
      updatePoolsUserData({
        poolId,
        field: 'stakingTokenBalance',
        value: tokenBalances[poolId],
      }),
    );
  };

export const updateUserStakedBalance =
  (poolId: number, account: string, chainId: number) => async (dispatch) => {
    const stakedBalances = await fetchUserStakeBalances(account, chainId);
    dispatch(
      updatePoolsUserData({
        poolId,
        field: 'stakedBalance',
        value: stakedBalances[poolId],
      }),
    );
  };

export default PoolsSlice.reducer;
