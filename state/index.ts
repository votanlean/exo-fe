import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from "react-redux";

import farmsReducer from './farms';
import fAANGpoolsReducer from './fAANGpools';
import poolsReducer from './pools';
import blockReducer from './block';
import texoReducer from './texo';
import orchestratorReducer from './orchestrator';
import appPricesReducer from './prices';
import userInfoReducer from './userInfo';
import networkReducer from './network';
import FAANGOrchestratorReducer from './FAANGOrchestrator';
import tlvReducer from './tlv';
import yieldReducer from './yield';

export const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    pools: poolsReducer,
    fAANGpools: fAANGpoolsReducer,
    farms: farmsReducer,
    block: blockReducer,
    texoToken: texoReducer,
    orchestrator: orchestratorReducer,
    appPrices: appPricesReducer,
    userInfo: userInfoReducer,
    network: networkReducer,
    FAANGOrchestrator: FAANGOrchestratorReducer,
		tlv: tlvReducer,
		yield: yieldReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the state itself
// export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
