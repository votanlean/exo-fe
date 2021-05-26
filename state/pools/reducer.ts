/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import seedingPools from 'config/constants/seedingPools'
import { fetchPoolsTotalStaking } from './fetchPools'
import {
    fetchUserBalances,
    fetchPoolsAllowance,
    fetchUserStakeBalances,
    fetchUserPendingRewards,
} from './fetchPoolsUser'

const initialState = {
    data: [
        ...seedingPools,
    ],
}

type Pool = any;

// Thunks
export const fetchPoolsPublicDataAsync = async (dispatch) => {
    const poolWithTotalStakedData = await fetchPoolsTotalStaking();

    dispatch(setPoolsPublicData(poolWithTotalStakedData));
}

// Pools
export const fetchPoolsUserDataAsync = (userAddress) => async (dispatch) => {
    const allowances = await fetchPoolsAllowance(userAddress);
    const stakingTokenBalances = await fetchUserBalances(userAddress);
    const stakedBalances = await fetchUserStakeBalances(userAddress);
    const pendingRewards = await fetchUserPendingRewards(userAddress);
    const userData = seedingPools.map((pool) => ({
        id: pool.id,
        allowance: allowances[pool.id],
        stakingTokenBalance: stakingTokenBalances[pool.id],
        stakedBalance: stakedBalances[pool.id],
        pendingReward: pendingRewards[pool.id],
    }));

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
    },
})

// Actions
export const { setPoolsUserData, setPoolsPublicData } = PoolsSlice.actions
