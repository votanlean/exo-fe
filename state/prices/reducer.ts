import { createSlice } from '@reduxjs/toolkit';
import { fetchPrices, fetchPolygonPrices } from 'hookApi/prices';

export const appPricesSlice = createSlice({
  name: 'appPrices',
  initialState: {
    data: [],
    updatedAt: null,
  },
  reducers: {
    setAppPrices: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const fetchAppPrices = (chainId?: number) => async (dispatch) => {
    switch(chainId) {
        case 137:
        case 80001:
            const polygonAppPrices = await fetchPolygonPrices();
            dispatch(setAppPrices(polygonAppPrices));
            break;
        case 56:
        case 97:
            const appPrices = await fetchPrices();
            dispatch(setAppPrices(appPrices));
            break;
    }
};

export const { setAppPrices } = appPricesSlice.actions;
