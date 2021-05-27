import { createSlice } from "@reduxjs/toolkit";
import { BIG_ZERO } from "config";
import contracts from "config/constants/contracts";
import orchestratorABI from 'config/abi/TEXOOrchestrator.json';
import multicall from 'utils/multicall';
import { getAddress } from "utils/addressHelpers";

export const orchestratorSlice = createSlice({
  name: 'orchestrator',
  initialState: {
    data: {
      tEXOPerBlock: BIG_ZERO.toString(),
      totalAllocationPoint: BIG_ZERO.toString(),
      canClaimRewardsBlock: BIG_ZERO.toString(),
    },
  },
  reducers: {
    setOrchestratorData: (state, action) => {
      state.data = action.payload;
    },
  }
});

export const fetchOrchestratorDataThunk = async (dispatch) => {
  const calls = [
    {
      address: getAddress(contracts.orchestrator),
      name: 'tEXOPerBlock',
    },
    {
      address: getAddress(contracts.orchestrator),
      name: 'totalAllocPoint',
    },
    {
      address: getAddress(contracts.orchestrator),
      name: 'globalBlockToUnlockClaimingRewards',
    },
  ];

  const orchestratorMultiData = await multicall(orchestratorABI, calls);
  const [ tEXOPerBlock, totalAllocPoint, canClaimRewardsBlock ] = orchestratorMultiData;

  dispatch(setOrchestratorData({
    tEXOPerBlock: tEXOPerBlock[0].toString(),
    totalAllocPoint: totalAllocPoint[0].toString(),
    canClaimRewardsBlock: canClaimRewardsBlock[0].toString(),
  }));
}

export const { setOrchestratorData } = orchestratorSlice.actions;