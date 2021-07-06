import { createSlice } from '@reduxjs/toolkit';
// import { networks } from 'config/constants/walletData';
import { getNetworks } from 'utils/networkHelpers';

const networks = getNetworks();

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
