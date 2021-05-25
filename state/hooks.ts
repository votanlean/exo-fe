import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
// import type { RootState, AppDispatch } from './index';
import {Pool, State} from "./types";
import {transformPool} from "./pools/helpers";
import {useEffect} from "react";
import {fetchPoolsUserDataAsync} from "./pools";
import useRefresh from "../hooks/useRefresh";

import { useAppDispatch } from 'state'
import { fetchPoolsPublicDataAsync } from './pools'
import { getWeb3NoAccount } from '../utils/web3'
import { setBlock } from './block'

export const useFetchPublicData = () => {
    const dispatch = useAppDispatch()
    const { slowRefresh } = useRefresh()
    useEffect(() => {
        // dispatch(fetchFarmsPublicDataAsync())
        dispatch(fetchPoolsPublicDataAsync())
        // dispatch(fetchPoolsStakingLimitsAsync())
    }, [dispatch, slowRefresh])

    useEffect(() => {
        const web3 = getWeb3NoAccount()
        const interval = setInterval(async () => {
            const blockNumber = await web3.eth.getBlockNumber()
            dispatch(setBlock(blockNumber))
        }, 6000)

        return () => clearInterval(interval)
    }, [dispatch])
}


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
