import { createSlice } from '@reduxjs/toolkit';
import BigNumber from 'bignumber.js';
import { BSC_FARM_ID, POLYGON_FARM_ID } from 'constant/farms';
import { fetchPolygonPrices, fetchPrices } from 'hookApi/prices';
import fetchFarms from 'state/farms/helpers/fetchFarms';
import { fetchPoolsTotalStaking } from 'state/pools/fetchPools';
import { getAddress } from 'utils/addressHelpers';
import { getDecimals } from 'utils/decimalsHelper';
import { getFarms } from 'utils/farmsHelpers';
import { getNetworks } from 'utils/networkHelpers';
import tokens from "config/constants/tokens";

const networks = getNetworks();

export const tlvSlice = createSlice({
  name: 'tlv',
  initialState: 0,
  reducers: {
    updateTLV: (state, action) => {
      state = action.payload;
			return state;
    },
  },
});

export const { updateTLV } = tlvSlice.actions;

export const fetchTLV = async (dispatch) => {
	let value = new BigNumber(0);

	await Promise.all(networks.map(async ({ id: chainId }) => {
		// get pools assets

		const poolWithTotalStakedData = await fetchPoolsTotalStaking(chainId);

		let allTokenPrices;
		switch(chainId) {
			case 137:
			case 80001:
				allTokenPrices = await fetchPolygonPrices();
				break;
			case 56:
			case 5600:
			case 97:
				allTokenPrices = await fetchPrices();
				break;
		}

		poolWithTotalStakedData.forEach((pool) => {
			let stakingTokenPrice = 0;
	
			if (allTokenPrices.data) {
				stakingTokenPrice =
					allTokenPrices.data[
						getAddress(pool.stakingToken.address, chainId)?.toLowerCase()
					];
			}
			const decimal = getDecimals(pool.stakingToken.decimals as any, chainId);
			const poolTotal = (new BigNumber(pool.totalStaked)).div(new BigNumber(10).pow(decimal)).times(stakingTokenPrice) || 0;
	
			value = value.plus(poolTotal);
		})
		

		// get farms assets
		const stableCoinPrice = new BigNumber(1);
  	const farms = await fetchFarms(getFarms(chainId), chainId);

		let stableTokenFarmId: number;
		let quoteTokenfarmId: number;

		switch (chainId) {
			case 56:
			case 5600:
			case 97:
				stableTokenFarmId = BSC_FARM_ID.TEXO_BUSD;
				quoteTokenfarmId = BSC_FARM_ID.TEXO_BNB;
				break;
			case 137:
			case 80001:
				stableTokenFarmId = POLYGON_FARM_ID.TEXO_USDC;
				quoteTokenfarmId = POLYGON_FARM_ID.TEXO_MATIC;
				break;
			default:
				break;
		}

		const stableTokenFarm = farms.find(({ pid }) => pid === stableTokenFarmId);
		const quoteTokenFarm = farms.find(({ pid }) => pid === quoteTokenfarmId);

		const texoPrice = stableTokenFarm && stableTokenFarm.tokenPriceVsQuote ? new BigNumber(stableTokenFarm.tokenPriceVsQuote) : new BigNumber(0);
		const quoteTokenPerTexoPrice = quoteTokenFarm && quoteTokenFarm.tokenPriceVsQuote ?  new BigNumber(quoteTokenFarm.tokenPriceVsQuote) : new BigNumber(0);
  	const quoteTokenPrice = quoteTokenPerTexoPrice.times(texoPrice);

		for (let i = 0; i < farms.length; i++) {
			const farm = farms[i];
	
			if (farm.lpTotalInQuoteToken) {
				let val;
	
				if (farm.quoteTokenSymbol === tokens.wbnb || farm.quoteTokenSymbol === tokens.wmatic) {
					val = (quoteTokenPrice.times(farm.lpTotalInQuoteToken));
				} else if (farm.quoteTokenSymbol === tokens.busd || farm.quoteTokenSymbol === tokens.usdc) {
					val = (stableCoinPrice.times(farm.lpTotalInQuoteToken));
				} else {
					val = (farm.lpTotalInQuoteToken);
				}
	
				value = value.plus(val);
			}
		}
	}))

	dispatch(updateTLV(value.toJSON()));
}
