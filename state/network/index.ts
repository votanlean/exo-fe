import { createSlice } from '@reduxjs/toolkit';
import { networks } from 'config/constants/walletData';

export const networkSlice = createSlice({
  name: 'network',
  initialState: networks[0],
  reducers: {
    changeNetwork: (state, action) => {
      return (state = action.payload);
    },
  },
});

export const { changeNetwork } = networkSlice.actions;

export default networkSlice.reducer;
