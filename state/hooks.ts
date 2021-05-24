import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
// import type { RootState, AppDispatch } from './index';
import {Pool, State} from "./types";
import {transformPool} from "./pools/helpers";
import {useEffect} from "react";
import {fetchPoolsUserDataAsync} from "./pools";
import useRefresh from "../hooks/useRefresh";

import { useAppDispatch } from 'state'


// Use throughout your app instead of plain `useDispatch` and `useSelector`
// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


// Pools

export const usePools = (account): Pool[] => {
    const { fastRefresh } = useRefresh()
    const dispatch = useAppDispatch()
    //TODO fetch userdata

    useEffect(() => {
        if (account) {
            dispatch(fetchPoolsUserDataAsync(account))
            console.log('dispatch(fetchPoolsUserDataAsync(account)) dispatch', dispatch);
        } else {
            console.log('no account? dispatch', dispatch)
        }
    }, [account, dispatch, fastRefresh])

    const pools = useSelector((state: State) => state.pools.data)
    return pools
        .map(transformPool)
}
