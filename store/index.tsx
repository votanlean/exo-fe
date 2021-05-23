import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';

import counterSlice from './counterSlice';

//COMBINING ALL REDUCERS
const combinedReducer = combineReducers({
  // OTHER REDUCERS WILL BE ADDED HERE
  counter: counterSlice,
});

const bindMiddleware = () => {
  if (process.env.NODE_ENV !== 'production') {
    return [thunkMiddleware, logger];
  }
  return [thunkMiddleware];
};

// REDUX PERSIST
const persistConfig = {
  key: 'root',
  whitelist: ['counter'],
  storage,
};

const persistedReducer = persistReducer(persistConfig, combinedReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: bindMiddleware(),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
