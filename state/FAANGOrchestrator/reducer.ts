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
    loading: false
  },
  reducers: {
    setOrchestratorData: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload
    }
  },
});


export const fetchFAANGOrchestratorDataThunk =
  (chainId, network: Network) => async (dispatch) => {
    dispatch(setLoading(true));

    const calls = [
      {
        address: getAddress(contracts.fAANGOrchestrator, chainId),
        name: 'poolInfo',
        params: [0],
      },
    ];

    try {
      const FAANGorchestratorMultiData = await multicall(
        FAANGOrchestratorABI,
        calls,
        chainId,
      );
      const [finishBlock] = FAANGorchestratorMultiData;
      dispatch(
        setOrchestratorData({
          FAANGFinishBlock: finishBlock['inActiveBlock'] ? finishBlock['inActiveBlock'].toNumber() : 0,
        }),
      );
    } catch (error) {
      dispatch(setLoading(false));
      throw error;
    }
  };

export const { setOrchestratorData, setLoading } = FAANGOrchestratorSlice.actions;

