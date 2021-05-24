/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import poolsConfig from 'config/constants/pools'
import { BIG_ZERO } from 'utils/bigNumber'
import { PoolsState, Pool} from 'state/types'
import {fetchUserBalances} from "./fetchPoolsUser";

const initialState: PoolsState = {
    data: [...poolsConfig],
}

export const fetchPoolsUserDataAsync = (account) => async (dispatch) => {
    // const allowances = await fetchPoolsAllowance(account)
    console.log('start the fetchPoolsUserDataAsync')
    const stakingTokenBalances = await fetchUserBalances(account)
    // const stakedBalances = await fetchUserStakeBalances(account)
    // const pendingRewards = await fetchUserPendingRewards(account)
    console.log('stakingTokenBalances', stakingTokenBalances);
    const userData = poolsConfig.map((pool) => ({
        id: pool.id,
        // allowance: allowances[pool.sousId],
        stakingTokenBalance: stakingTokenBalances[pool.id],
        // stakedBalance: stakedBalances[pool.sousId],
        // pendingReward: pendingRewards[pool.sousId],
    }))
    dispatch(setPoolsUserData(userData))
}

export const PoolsSlice = createSlice({
    name: 'Pools',
    initialState,
    reducers: {
        // setPoolsPublicData: (state, action) => {
        //     const livePoolsData: Pool[] = action.payload
        //     state.data = state.data.map((pool) => {
        //         const livePoolData = livePoolsData.find((entry) => entry.sousId === pool.sousId)
        //         return { ...pool, ...livePoolData }
        //     })
        // },
        setPoolsUserData: (state, action) => {
            const userData = action.payload
            state.data = state.data.map((pool) => {
                const userPoolData = userData.find((entry) => entry.id === pool.id)
                return { ...pool, userData: userPoolData }
            })
            console.log('userData', userData);
        },
        // updatePoolsUserData: (state, action) => {
        //     const { field, value, sousId } = action.payload
        //     const index = state.data.findIndex((p) => p.sousId === sousId)
        //
        //     if (index >= 0) {
        //         state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
        //     }
        // },
    },
    // extraReducers: (builder) => {
        // // Vault public data that updates frequently
        // builder.addCase(fetchCakeVaultPublicData.fulfilled, (state, action: PayloadAction<CakeVault>) => {
        //     state.cakeVault = { ...state.cakeVault, ...action.payload }
        // })
        // // Vault fees
        // builder.addCase(fetchCakeVaultFees.fulfilled, (state, action: PayloadAction<VaultFees>) => {
        //     const fees = action.payload
        //     state.cakeVault = { ...state.cakeVault, fees }
        // })
        // // Vault user data
        // builder.addCase(fetchCakeVaultUserData.fulfilled, (state, action: PayloadAction<VaultUser>) => {
        //     const userData = action.payload
        //     userData.isLoading = false
        //     state.cakeVault = { ...state.cakeVault, userData }
        // })

    // },
})

// Actions
export const { setPoolsUserData } = PoolsSlice.actions

export default PoolsSlice.reducer
