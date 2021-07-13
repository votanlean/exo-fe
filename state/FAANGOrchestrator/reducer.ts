import { createSlice } from '@reduxjs/toolkit';
import { BIG_ZERO } from '../../config';
import FAANGOrchestratorABI from '../../config/abi/FAANGOrchestrator.json';
import multicall from '../../utils/multicall';
import { Network } from '../../state/types';
import { getAddress } from '../../utils/addressHelpers';
import contracts from '../../config/constants/contracts';




export const FAANGOrchestratorSlice = createSlice({
    name: 'FAANGorchestrator',
    initialState: {
      data: {
        FAANGFinishBlock: BIG_ZERO.toString(10),
      },
    },
    reducers: {
      setOrchestratorData: (state, action) => {
        state.data = action.payload;
      },
    },
});


export const fetchOrchestratorDataThunk =
  (chainId, network: Network) => async (dispatch) => {
    const calls = [
      {
        address: getAddress(contracts.fAANGOrchestrator, chainId),
        name: 'poolInfo',
        params: [0],
      },
    ];

    const FAANGorchestratorMultiData = await multicall(
        FAANGOrchestratorABI,
      calls,
      chainId,
    );
    const [finishBlock] = FAANGorchestratorMultiData;
    dispatch(
      setOrchestratorData({
        FAANGFinishBlock: finishBlock['inActiveBlock'],
      }),
    );
  };

export const { setOrchestratorData } = FAANGOrchestratorSlice.actions;

