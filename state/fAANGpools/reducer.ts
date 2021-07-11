/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
// import fAANGPools from 'config/constants/fAANGPools';
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
import { FAANGPool } from '../types';
import { getFAANGPools } from 'utils/poolHelpers';

const initialState = {
  data: [...getFAANGPools()],
};

// Thunks
export const fetchFAANGPoolsPublicDataAsync =
  (chainId: number) => async (dispatch) => {
    const poolWithTotalStakedData = await fetchFAANGPoolsTotalStaking(chainId);
    const poolWithVolatileInfo = await fetchFAANGPoolsVolatileInfo(chainId);

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
  (userAddress, chainId) => async (dispatch) => {
    const fAANGPools = getFAANGPools(chainId);
    const allowances = await fetchFAANGPoolsAllowance(userAddress, chainId);
    const stakingTokenBalances = await fetchFAANGUserBalances(
      userAddress,
      chainId,
    );
    const stakedBalances = await fetchFAANGUserStakeBalances(
      userAddress,
      chainId,
    );
    const pendingRewards = await fetchFAANGUserPendingRewards(
      userAddress,
      chainId,
    );
    const userData = fAANGPools.map((pool) => ({
      id: pool.id,
      allowance: allowances[pool.id],
      stakingTokenBalance: stakingTokenBalances[pool.id],
      stakedBalance: stakedBalances[pool.id],
      pendingReward: pendingRewards[pool.id],
    }));

    dispatch(setFAANGPoolsUserData(userData));
  };

//Thunk
export const replaceFAANGPoolsWithoutUserData =
  (chainId: number) => async (dispatch) => {
    const poolWithTotalStakedData = await fetchFAANGPoolsTotalStaking(chainId);
    const poolWithVolatileInfo = await fetchFAANGPoolsVolatileInfo(chainId);

    const merged = poolWithTotalStakedData.map((poolWithTotalStaked, index) => {
      const poolVolatileInfo = poolWithVolatileInfo[index];

      return {
        ...poolWithTotalStaked,
        ...poolVolatileInfo,
      };
    });

    dispatch(setFAANGPools(merged));
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
    setFAANGPools: (state, action) => {
      state.data = action.payload;
    },
  },
});

// Actions
export const { setFAANGPoolsUserData, setFAANGPoolsPublicData, setFAANGPools } =
  FAANGPoolsSlice.actions;
