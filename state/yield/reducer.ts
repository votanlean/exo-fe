import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { getYieldFarms } from 'utils/yieldFarmHelpers';
import { fetchYieldFarms } from './helpers';

const initialState = getYieldFarms().map((yieldFarm) => {
	return {
		...yieldFarm,
		userData: {
			balance: 0,
			stakedBalance: 0,
			inVaultBalance: 0
		}
	}
})

export const yieldSlice = createSlice({
	name: "yield",
	initialState,
	reducers: {
		setYieldFarmPublicData: (state, action) => {},
		setYieldFarmUserData: (state, action) => {}
	}
})

export const { setYieldFarmPublicData, setYieldFarmUserData } = yieldSlice.actions;

export const fetchYieldFarmPublicData = (chainId?: number) => async (dispatch: Dispatch) => {
	const yieldFarms = getYieldFarms(chainId);
	const yieldFarmPubliData = await fetchYieldFarms(yieldFarms, chainId);

	dispatch(setYieldFarmPublicData(yieldFarmPubliData));
}