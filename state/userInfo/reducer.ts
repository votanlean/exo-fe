import { createSlice } from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";
import { BIG_ZERO } from "config";
import multicall from 'utils/multicall';
import {getOrchestratorAddress} from "utils/addressHelpers";
import seedingPools from 'config/constants/seedingPools'
import farms from 'config/constants/farms'
import orchestratorABI from 'config/abi/TEXOOrchestrator.json';

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: {
    data: {
      tEXOReward: BIG_ZERO.toString(),
    },
  },
  reducers: {
    setUserInfoData: (state, action) => {
      state.data = action.payload;
    },
  }
});

export const fetchUserInfoDataThunk = (account: string) => async (dispatch) => {
  const fetchPendingTEXO = async () => {
    const callsLP = farms.map((farm) => ({
      address: getOrchestratorAddress(),
      name: 'pendingTEXO',
      params: [farm.pid, account],
    }))
    const callsSP = seedingPools.map((farm) => ({
      address: getOrchestratorAddress(),
      name: 'pendingTEXO',
      params: [farm.id, account],
    }))
    const pendingTEXOBalances = await multicall(orchestratorABI, [...callsLP, ...callsSP])
    const pendingTEXOSum = pendingTEXOBalances.reduce((accum, earning) => {
      return accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
    }, 0)

    dispatch(setUserInfoData({
      tEXOReward: pendingTEXOSum,
    }));
  }
  await fetchPendingTEXO()
}

export const { setUserInfoData } = userInfoSlice.actions;
