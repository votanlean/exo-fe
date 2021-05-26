import { createSlice } from "@reduxjs/toolkit";
import { fetchPrices } from "hookApi/prices";

export const appPricesSlice = createSlice({
  name: 'texoToken',
  initialState: {
    data: {},
  },
  reducers: {
    setAppPrices: (state, action) => {
      state.data = action.payload;
    },
  }
});

export const fetchAppPrices = async (dispatch) => {
  const appPrices = await fetchPrices();

  dispatch(setAppPrices(appPrices));
}

export const { setAppPrices } = appPricesSlice.actions;