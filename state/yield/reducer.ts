import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { getYieldFarms } from 'utils/yieldFarmHelpers';
import { fetchYieldFarms } from './helpers';
import fetchUserData from './helpers/fetchUserData';

const initialState = getYieldFarms().map((yieldFarm) => {
    return {
        ...yieldFarm,
        underlyingVaultBalance: '0',
        userData: {
            allowance: '0',
            balance: '0',
            stakedBalance: '0',
            inVaultBalance: '0',
            ecAssetStakedBalance: '0',
        }
    }
})

export const yieldSlice = createSlice({
    name: "yield",
    initialState,
    reducers: {
        setYieldFarmPublicData: (state, action) =>
            state.map((yieldFarm) => {
                const foundByPid = action.payload.find((y) => y.pid === yieldFarm.pid);

                if (!foundByPid) {
                    return yieldFarm
                }

                return {
                    ...yieldFarm,
                    ...foundByPid
                }
            }),
        setYieldFarmUserData: (state, action) =>
            state.map((yieldFarm) => {
                const foundByPid = action.payload.find((y) => y.pid === yieldFarm.pid);

                if (!foundByPid) {
                    return yieldFarm
                }

                return {
                    ...yieldFarm,
                    ...foundByPid
                }
            })
    }
})

export const { setYieldFarmPublicData, setYieldFarmUserData } = yieldSlice.actions;

export const fetchYieldFarmPublicData = (chainId: number) => async (dispatch: Dispatch) => {
    const yieldFarms = getYieldFarms(chainId);
    const yieldFarmPublicData = await fetchYieldFarms(yieldFarms, chainId);

    dispatch(setYieldFarmPublicData(yieldFarmPublicData));
}

export const fetchYieldUserData = (account: string, chainId: number) => async (dispatch: Dispatch) => {
    const yieldFarms = getYieldFarms(chainId);
    const yieldFarmUserData = await fetchUserData(yieldFarms, account, chainId);

    dispatch(setYieldFarmUserData(yieldFarmUserData));
}