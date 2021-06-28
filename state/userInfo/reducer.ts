import { createSlice } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';
import { BIG_ZERO } from 'config';
import multicall from 'utils/multicall';
import { getOrchestratorAddress } from 'utils/addressHelpers';
import orchestratorABI from 'config/abi/TEXOOrchestrator.json';
import { getSeedingPools } from 'utils/poolHelpers';
import { getFarms } from 'utils/farmsHelpers';
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
  },
});

export const fetchUserInfoDataThunk =
  (account: string, chainId: number) => async (dispatch) => {
    const fetchPendingTEXO = async () => {
      //TODO: Update chainId for getFarms
      const farms = getFarms(97);
      const callsLP = farms.map((farm) => ({
        address: getOrchestratorAddress(),
        name: 'pendingTEXO',
        params: [farm.pid, account],
        chainId,
      }));
      const seedingPools = getSeedingPools(chainId);
      const callsSP = seedingPools.map((farm) => ({
        address: getOrchestratorAddress(),
        name: 'pendingTEXO',
        params: [farm.id, account],
      }));
      const pendingTEXOBalances = await multicall(orchestratorABI, [
        ...callsLP,
        ...callsSP,
      ]);
      const pendingTEXOSum = pendingTEXOBalances.reduce((accum, earning) => {
        return (
          accum +
          new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
        );
      }, 0);

      dispatch(
        setUserInfoData({
          tEXOReward: pendingTEXOSum,
        }),
      );
    };
    await fetchPendingTEXO();
  };

export const { setUserInfoData } = userInfoSlice.actions;
