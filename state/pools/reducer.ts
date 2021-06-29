/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { getSeedingPools } from 'utils/poolHelpers';
import { fetchPoolsTotalStaking, fetchPoolsVolatileInfo } from './fetchPools';
import {
  fetchUserBalances,
  fetchPoolsAllowance,
  fetchUserStakeBalances,
  fetchUserPendingRewards,
} from './fetchPoolsUser';
import { PoolsState } from '../types';

const initialState: PoolsState = {
  data: getSeedingPools(),
};

type Pool = any;

// Thunks
export const fetchPoolsPublicDataAsync =
  (chainId: number) => async (dispatch) => {
    const poolWithTotalStakedData = await fetchPoolsTotalStaking(chainId);
    const poolWithVolatileInfo = await fetchPoolsVolatileInfo(chainId);

    const merged = poolWithTotalStakedData.map((poolWithTotalStaked, index) => {
      const poolVolatileInfo = poolWithVolatileInfo[index];

      return {
        ...poolWithTotalStaked,
        ...poolVolatileInfo,
      };
    });

    dispatch(setPoolsPublicData(merged));
  };

// Pools
export const fetchPoolsUserDataAsync =
  (userAddress, chainId) => async (dispatch) => {
    const allowances = await fetchPoolsAllowance(userAddress, chainId);
    const stakingTokenBalances = await fetchUserBalances(userAddress, chainId);
    const stakedBalances = await fetchUserStakeBalances(userAddress, chainId);
    const pendingRewards = await fetchUserPendingRewards(userAddress, chainId);
    const seedingPools = getSeedingPools(chainId);
    const userData = seedingPools.map((pool) => ({
      id: pool.id,
      allowance: allowances[pool.id],
      stakingTokenBalance: stakingTokenBalances[pool.id],
      stakedBalance: stakedBalances[pool.id],
      pendingReward: pendingRewards[pool.id],
    }));

    dispatch(setPoolsUserData(userData));
  };

export const PoolsSlice = createSlice({
  name: 'Pools',
  initialState,
  reducers: {
    setPoolsPublicData: (state, action) => {
      const livePoolsData: Pool[] = action.payload;
      state.data = livePoolsData;
    },
    setPoolsUserData: (state, action) => {
      const userData = action.payload;
      state.data = state.data.map((pool) => {
        const userPoolData = userData.find((entry) => entry.id === pool.id);
        return { ...pool, userData: userPoolData };
      });
    },
    updatePoolsUserData: (state, action) => {
      const { field, value, poolId } = action.payload;
      const index = state.data.findIndex((p) => p.id === poolId);

      if (index >= 0) {
        state.data[index] = {
          ...state.data[index],
          userData: { ...state.data[index].userData, [field]: value },
        };
      }
    },
  },
});

// Actions
export const { setPoolsUserData, setPoolsPublicData, updatePoolsUserData } =
  PoolsSlice.actions;
