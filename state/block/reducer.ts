/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { getWeb3NoAccount } from 'utils/web3';

const initialState = {
  data: {
    currentBlock: 0,
  },
  loading: false
};

export const blockSlice = createSlice({
  name: 'Block',
  initialState,
  reducers: {
    setBlockData: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
});

export const fetchBlockDataThunk = (chainId) => async (dispatch) => {
  const web3 = getWeb3NoAccount(chainId);
  dispatch(setLoading(true));
  try {
    const currentBlock = await web3.eth.getBlockNumber();
    dispatch(setBlockData({ currentBlock }));
  } catch (error) {
    dispatch(setLoading(false));
    throw error;
  }
};

// Actions
export const { setBlockData, setLoading } = blockSlice.actions;
