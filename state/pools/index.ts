/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import poolsConfig from 'config/constants/pools'
import { BIG_ZERO } from 'utils/bigNumber'
import { PoolsState, Pool} from 'state/types'
import {
    fetchPoolsTotalStaking,
} from './fetchPools'
import {
    fetchUserBalances,
    fetchPoolsAllowance,
    fetchUserStakeBalances,
    fetchUserPendingRewards,
} from './fetchPoolsUser'

const initialState: PoolsState = {
    data: [...poolsConfig],
}

// Thunks
export const fetchPoolsPublicDataAsync = () => async (dispatch) => {
    // const blockLimits = await fetchPoolsBlockLimits()
    const totalStakings = await fetchPoolsTotalStaking()

    const liveData = poolsConfig.map((pool) => {
        // const blockLimit = blockLimits.find((entry) => entry.id === pool.id)
        const totalStaking = totalStakings.find((entry) => entry.id === pool.id)

        return {
            // ...blockLimit,
            ...totalStaking,
        }
    })

    dispatch(setPoolsPublicData(liveData))
}

// export const fetchPoolsStakingLimitsAsync = () => async (dispatch, getState) => {
//     const poolsWithStakingLimit = getState()
//       .pools.data.filter(({ stakingLimit }) => stakingLimit !== null && stakingLimit !== undefined)
//       .map((pool) => pool.id)
//
//     const stakingLimits = await fetchPoolsStakingLimits(poolsWithStakingLimit)
//
//     const stakingLimitData = poolsConfig.map((pool) => {
//         if (poolsWithStakingLimit.includes(pool.id)) {
//             return { id: pool.id }
//         }
//         const stakingLimit = stakingLimits[pool.id] || BIG_ZERO
//         return {
//             id: pool.id,
//             stakingLimit: stakingLimit.toJSON(),
//         }
//     })
//
//     dispatch(setPoolsPublicData(stakingLimitData))
// }

// Pools
export const fetchPoolsUserDataAsync = (account) => async (dispatch) => {
    const allowances = await fetchPoolsAllowance(account)
    const stakingTokenBalances = await fetchUserBalances(account)
    const stakedBalances = await fetchUserStakeBalances(account)
    const pendingRewards = await fetchUserPendingRewards(account)
    const userData = poolsConfig.map((pool) => ({
        id: pool.id,
        allowance: allowances[pool.id],
        stakingTokenBalance: stakingTokenBalances[pool.id],
        stakedBalance: stakedBalances[pool.id],
        pendingReward: pendingRewards[pool.id],
    }))
    dispatch(setPoolsUserData(userData))
}

export const PoolsSlice = createSlice({
    name: 'Pools',
    initialState,
    reducers: {
        setPoolsPublicData: (state, action) => {
            const livePoolsData: Pool[] = action.payload
            state.data = state.data.map((pool) => {
                const livePoolData = livePoolsData.find((entry) => entry.id === pool.id)
                return { ...pool, ...livePoolData }
            })
        },
        setPoolsUserData: (state, action) => {
            const userData = action.payload
            state.data = state.data.map((pool) => {
                const userPoolData = userData.find((entry) => entry.id === pool.id)
                return { ...pool, userData: userPoolData }
            })
        },
        //TODO where updatePoolsUserData is used
        updatePoolsUserData: (state, action) => {
            const { field, value, id } = action.payload
            const index = state.data.findIndex((p) => p.id === id)

            if (index >= 0) {
                state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
            }
        },
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
export const { setPoolsUserData, setPoolsPublicData, updatePoolsUserData } = PoolsSlice.actions

export default PoolsSlice.reducer
