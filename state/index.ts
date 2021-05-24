import { combineReducers } from 'redux';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';

import counterSlice from './counterSlice';
import {useDispatch} from "react-redux";
import poolsReducer from './pools'
import achievementsReducer from '../../pancake-frontend/src/state/achievements'
import blockReducer from '../../pancake-frontend/src/state/block'
import farmsReducer from '../../pancake-frontend/src/state/farms'
import pricesReducer from '../../pancake-frontend/src/state/prices'
import predictionsReducer from '../../pancake-frontend/src/state/predictions'
import profileReducer from '../../pancake-frontend/src/state/profile'
import teamsReducer from '../../pancake-frontend/src/state/teams'
import collectiblesReducer from '../../pancake-frontend/src/state/collectibles'

//COMBINING ALL REDUCERS
const combinedReducer = combineReducers({
  // OTHER REDUCERS WILL BE ADDED HERE
  counter: counterSlice,
  pools: poolsReducer,
});

// const bindMiddleware = () => {
//   if (process.env.NODE_ENV !== 'production') {
//     return [thunkMiddleware, logger];
//   }
//   return [thunkMiddleware];
// };

// REDUX PERSIST
// const persistConfig = {
//   key: 'root',
//   whitelist: ['counter', 'pools'],
//   storage,
// };

// const persistedReducer = persistReducer(persistConfig, combinedReducer);

export const store = configureStore({
  // reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    pools: poolsReducer,
  },
  // middleware: getDefaultMiddleware({
  //   serializableCheck: false,
  // }),
  // middleware: bindMiddleware(),
});

// Infer the `RootState` and `AppDispatch` types from the state itself
// export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store
