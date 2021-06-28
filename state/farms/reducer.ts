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
      const liveFarmsData: Farm[] = action.payload;

      state.data = state.data.map((farm) => {
        const liveFarmData = liveFarmsData.find((f) => f.pid === farm.pid);

        return {
          ...farm,
          ...liveFarmData,
        };
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
  },
});

// Actions
export const { setFarmsPublicData, setFarmUserData } = farmsSlice.actions;

// Thunks
export const fetchFarmsPublicDataAsync = () => async (dispatch) => {
  const farmsData = getFarms(97);
  const farms = await fetchFarms(farmsData);

  dispatch(setFarmsPublicData(farms));
};

export const fetchFarmUserDataAsync = (account: string) => async (dispatch) => {
  const farmsData = getFarms(97);
  const userFarmAllowances = await fetchFarmUserAllowances(account, farmsData);
  const userFarmTokenBalances = await fetchFarmUserTokenBalances(
    account,
    farmsData,
  );
  const userStakedBalances = await fetchFarmUserStakedBalances(
    account,
    farmsData,
  );
  const userFarmEarnings = await fetchFarmUserEarnings(account, farmsData);

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
