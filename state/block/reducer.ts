/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { getWeb3NoAccount } from 'utils/web3';

const initialState = {
  data: {
    currentBlock: 0,
  },
};

export const blockSlice = createSlice({
  name: 'Block',
  initialState,
  reducers: {
    setBlockData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const fetchBlockDataThunk = async (dispatch) => {
  const web3 = getWeb3NoAccount();

  const currentBlock = await web3.eth.getBlockNumber();
  console.log('currentBlock web3', currentBlock);
  dispatch(setBlockData({ currentBlock }));
};

// Actions
export const { setBlockData } = blockSlice.actions;
