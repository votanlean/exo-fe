/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import fAANGPools from 'config/constants/fAANGPools';
import {
  fetchFAANGPoolsTotalStaking,
  fetchFAANGPoolsVolatileInfo,
} from './fetchFAANGPools';
import {
  fetchFAANGUserBalances,
  fetchFAANGPoolsAllowance,
  fetchFAANGUserStakeBalances,
  fetchFAANGUserPendingRewards,
} from './fetchFAANGPoolsUser';

const initialState = {
  data: [...fAANGPools],
};

type FAANGPool = any; //TODO move to state type

// Thunks
export const fetchFAANGPoolsPublicDataAsync = async (dispatch) => {
  const poolWithTotalStakedData = await fetchFAANGPoolsTotalStaking();
  const poolWithVolatileInfo = await fetchFAANGPoolsVolatileInfo();

  const merged = poolWithTotalStakedData.map((poolWithTotalStaked, index) => {
    const poolVolatileInfo = poolWithVolatileInfo[index];

    return {
      ...poolWithTotalStaked,
      ...poolVolatileInfo,
    };
  });

  dispatch(setFAANGPoolsPublicData(merged));
};

// Pools
export const fetchFAANGPoolsUserDataAsync =
  (userAddress) => async (dispatch) => {
    const allowances = await fetchFAANGPoolsAllowance(userAddress);
    const stakingTokenBalances = await fetchFAANGUserBalances(userAddress);
    const stakedBalances = await fetchFAANGUserStakeBalances(userAddress);
    const pendingRewards = await fetchFAANGUserPendingRewards(userAddress);
    const userData = fAANGPools.map((pool) => ({
      id: pool.id,
      allowance: allowances[pool.id],
      stakingTokenBalance: stakingTokenBalances[pool.id],
      stakedBalance: stakedBalances[pool.id],
      pendingReward: pendingRewards[pool.id],
    }));

    dispatch(setFAANGPoolsUserData(userData));
  };

export const FAANGPoolsSlice = createSlice({
  name: 'FAANGPools',
  initialState,
  reducers: {
    setFAANGPoolsPublicData: (state, action) => {
      const livePoolsData: FAANGPool[] = action.payload;
      state.data = state.data.map((pool) => {
        const livePoolData = livePoolsData.find(
          (entry) => entry.id === pool.id,
        );
        return { ...pool, ...livePoolData };
      });
    },
    setFAANGPoolsUserData: (state, action) => {
      const userData = action.payload;
      state.data = state.data.map((pool) => {
        const userPoolData = userData.find((entry) => entry.id === pool.id);
        return { ...pool, userData: userPoolData };
      });
    },
  },
});

// Actions
export const { setFAANGPoolsUserData, setFAANGPoolsPublicData } =
  FAANGPoolsSlice.actions;
