import { PoolsSlice } from './reducer';
import {
  fetchPoolsAllowance,
  fetchUserBalances,
  fetchUserStakeBalances,
} from './fetchPoolsUser';
import { updatePoolsUserData } from './reducer';
export const updateUserAllowance =
  (poolId: number, account: string) => async (dispatch) => {
    const allowances = await fetchPoolsAllowance(account);
    dispatch(
      updatePoolsUserData({
        poolId,
        field: 'allowance',
        value: allowances[poolId],
      }),
    );
  };

export const updateUserBalance =
  (poolId: number, account: string) => async (dispatch) => {
    const tokenBalances = await fetchUserBalances(account);
    dispatch(
      updatePoolsUserData({
        poolId,
        field: 'stakingTokenBalance',
        value: tokenBalances[poolId],
      }),
    );
  };

export const updateUserStakedBalance =
  (poolId: number, account: string) => async (dispatch) => {
    const stakedBalances = await fetchUserStakeBalances(account);
    dispatch(
      updatePoolsUserData({
        poolId,
        field: 'stakedBalance',
        value: stakedBalances[poolId],
      }),
    );
  };

export default PoolsSlice.reducer;
