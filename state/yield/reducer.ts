import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { getYieldFarms } from 'utils/yieldFarmHelpers';
import { fetchAssetPoolInfo, fetchStrategyData, fetchYieldFarms } from './helpers';
import fetchUserData from './helpers/fetchUserData';

const initialState = {
  loading: false,
  data: getYieldFarms().map((yieldFarm) => {
    return {
      ...yieldFarm,
      underlyingVaultBalance: '0',
      userData: {
        allowance: '0',
        balance: '0',
        stakedBalance: '0',
        inVaultBalance: '0',
        ecAssetStakedBalance: '0',
        ecAssetAllowance: '0',
      }
    }
  })
}

export const yieldSlice = createSlice({
  name: "yield",
  initialState,
  reducers: {
    setYieldFarmPublicData: (state, action) => {
      state.data = state.data.map((yieldFarm) => {
        const foundByPid = action.payload.find((y) => y.pid === yieldFarm.pid);

        if (!foundByPid) {
          return yieldFarm
        }

        return {
          ...yieldFarm,
          ...foundByPid
        }
      });

      return state;
    },
    setYieldFarmUserData: (state, action) => {
      state.data = state.data.map((yieldFarm) => {
        const foundByPid = action.payload.find((y) => y.pid === yieldFarm.pid);

        if (!foundByPid) {
          return yieldFarm
        }

        return {
          ...yieldFarm,
          ...foundByPid
        }
      });

      return state;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;

      return state;
    }
  }
})

export const { setYieldFarmPublicData, setYieldFarmUserData, setLoading } = yieldSlice.actions;

export const fetchYieldFarmPublicData = (chainId: number) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));

  try {
    const yieldFarms = getYieldFarms(chainId);
    const yieldFarmPublicData = await fetchYieldFarms(yieldFarms, chainId);

    dispatch(setYieldFarmPublicData(yieldFarmPublicData));

    const yieldFarmStrategyData = await fetchStrategyData(yieldFarmPublicData, chainId);
    dispatch(setYieldFarmPublicData(yieldFarmStrategyData));

    const yieldFarmAssetData = await fetchAssetPoolInfo(yieldFarmStrategyData, chainId);
    dispatch(setYieldFarmPublicData(yieldFarmAssetData));

    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setLoading(false));
    throw error;
  }
}

export const fetchYieldUserData = (account: string, chainId: number) => async (dispatch: Dispatch) => {
  dispatch(setLoading(true));

  try {
    const yieldFarms = getYieldFarms(chainId);
    const yieldFarmUserData = await fetchUserData(yieldFarms, account, chainId);

    dispatch(setYieldFarmUserData(yieldFarmUserData));
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setLoading(false));
    throw error;
  }
}