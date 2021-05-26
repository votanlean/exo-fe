import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from "react-redux";

import farmsReducer from './farms';
import poolsReducer from './pools';
import blockReducer from './block';
import texoReducer from './texo';
import orchestratorReducer from './orchestrator';

export const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    pools: poolsReducer,
    farms: farmsReducer,
    block: blockReducer,
    texoToken: texoReducer,
    orchestrator: orchestratorReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the state itself
// export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
