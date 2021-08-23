import { createSlice } from '@reduxjs/toolkit';

export const appThemeSlice = createSlice({
  name: 'theme',
  initialState: {
    darkMode: false,
  },
  reducers: {
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
    },
  },
});

export const { setDarkMode } = appThemeSlice.actions;

export default appThemeSlice.reducer;
