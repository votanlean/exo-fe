/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import fetchFarms from './helpers/fetchFarms';
import { getFarms } from 'utils/farmsHelpers';
import {
  fetchFarmUserEarnings,
  fetchFarmUserAllowances,
  fetchFarmUserTokenBalances,
  fetchFarmUserStakedBalances,
} from './helpers';

type Farm = any;

const initialState = {
  data: getFarms().map((farm) => ({
    ...farm,
    userData: {
      allowance: '0',
      tokenBalance: '0',
      stakedBalance: '0',
      earnings: '0',
    },
  })),
};

export const farmsSlice = createSlice({
  name: 'Farms',
  initialState,
  reducers: {
    setFarmsPublicData: (state, action) => {
      // state.data = action.payload;
      const publicDataArray = action.payload;
      state.data = state.data.map((farm) => {
        const publicData = publicDataArray.find(
          (entry) => (entry.pid = farm.pid),
        );
        return { ...farm, ...publicData };
      });
    },
    setFarmUserData: (state, action) => {
      const { arrayOfUserDataObjects } = action.payload;

      arrayOfUserDataObjects.forEach((userDataEl) => {
        const { pid } = userDataEl;
        const index = state.data.findIndex((farm) => farm.pid === pid);

        state.data[index] = {
          ...state.data[index],
          userData: userDataEl,
        };
      });
    },
    setFarms: (state, action) => {
      state.data = action.payload;
    },
  },
});

// Actions
export const { setFarmsPublicData, setFarmUserData, setFarms } =
  farmsSlice.actions;

// Thunks
export const fetchFarmsPublicDataAsync = (chainId) => async (dispatch) => {
  const farmsData = getFarms(chainId);
  const farms = await fetchFarms(farmsData, chainId);

  dispatch(setFarmsPublicData(farms));
};

export const fetchFarmUserDataAsync =
  (account: string, chainId?: number) => async (dispatch) => {
    const farmsData = getFarms(chainId);
    const userFarmAllowances = await fetchFarmUserAllowances(
      account,
      farmsData,
      chainId,
    );
    const userFarmTokenBalances = await fetchFarmUserTokenBalances(
      account,
      farmsData,
      chainId,
    );
    const userStakedBalances = await fetchFarmUserStakedBalances(
      account,
      farmsData,
      chainId,
    );
    const userFarmEarnings = await fetchFarmUserEarnings(
      account,
      farmsData,
      chainId,
    );

    const arrayOfUserDataObjects = userFarmAllowances.map((_, index) => {
      return {
        pid: farmsData[index].pid,
        allowance: userFarmAllowances[index],
        tokenBalance: userFarmTokenBalances[index],
        stakedBalance: userStakedBalances[index],
        earnings: userFarmEarnings[index],
      };
    });

    dispatch(setFarmUserData({ arrayOfUserDataObjects }));
  };

export const replaceFarmWithoutUserDataAsync =
  (chainId) => async (dispatch) => {
    const farmsData = getFarms(chainId);
    const farms = await fetchFarms(farmsData, chainId);

    dispatch(setFarms(farms));
  };
