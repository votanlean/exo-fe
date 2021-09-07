import { createSlice } from '@reduxjs/toolkit';
import { fetchPrices, fetchPolygonPrices } from 'hookApi/prices';

export const appPricesSlice = createSlice({
  name: 'appPrices',
  initialState: {
    data: {
      data: [],
      updatedAt: null,
    },
    loading: false,
  },
  reducers: {
    setAppPrices: (state, action) => {
      state.data = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
});

export const fetchAppPrices = (chainId?: number) => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    switch (chainId) {
      case 137:
      case 80001:
        const polygonAppPrices = await fetchPolygonPrices();
        dispatch(setAppPrices(polygonAppPrices));
        break;
      case 56:
      case 5600:
      case 97:
        const appPrices = await fetchPrices();
        dispatch(setAppPrices(appPrices));
        break;
    }
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setLoading(false));
    throw error;
  }
};

export const { setAppPrices, setLoading } = appPricesSlice.actions;
