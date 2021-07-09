import BigNumber from "bignumber.js";
import { BSC_FARM_ID, POLYGON_FARM_ID } from "constant/farms";
import { useSelector } from "react-redux";
import { useFarmQuoteTokenPrice, useTexoTokenPrice } from "state/texo/selectors";
import tokens from "config/constants/tokens";
import { useNetwork } from "state/hooks";
import { gql, useQuery } from '@apollo/client'

export const useFarmFromPid = (pid): any => {
  const farm = useSelector((state: any) => state.farms.data.find((f) => f.pid === pid));

  return farm;
}

export const useFarms = () => {
  return useSelector((state: any) => state.farms.data);
}

export const useTotalValue = (): BigNumber => {
  const stableCoinPrice = new BigNumber(1);
  const texoPrice = new BigNumber(useTexoTokenPrice());

	const { id: chainId } = useNetwork();
	let farmId: number;

	switch (chainId) {
		case 56:
		case 97:
			farmId = BSC_FARM_ID.TEXO_BUSD;
			break;
		case 137:
		case 80001:
			farmId = POLYGON_FARM_ID.TEXO_USDC;
			break;
		default:
			break;
	}

  const quoteTokenPerTexoPrice = new BigNumber(useFarmQuoteTokenPrice(farmId));
  const quoteTokenPrice = quoteTokenPerTexoPrice.times(texoPrice);

  const farms = useFarms();
  let value = new BigNumber(0);

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

  return value;
}

const POLYGON_QUERY = ({
	USDCPair,
	wMATICPair
}) => {
	let gqlString = `
		bundle(id: 1) {
			id
			ethPrice
		}

	`

	if (wMATICPair) {
		gqlString += `
		wMATICPair: pair(id: "${wMATICPair}") {
			id
			token0 {
				id
				symbol
				name
				derivedETH
			}
			token1 {
				id
				symbol
				name
				derivedETH
			}
			reserve0
			reserve1
		}

		`
	}

	if (USDCPair) {
		gqlString += `
		USDCPair: pair(id: "${USDCPair}") {
			id
			token0 {
				id
				symbol
				name
				derivedETH
			}
			token1 {
				id
				symbol
				name
				derivedETH
			}
			reserve0
			reserve1
		}
		
		`
	}
	return gql`
		query POLYGON_QUERY {
			${gqlString}
		}
	`;
}

export const usePolygonTotalValue = (): BigNumber => {
	let value = new BigNumber(0);

	const { id: chainId } = useNetwork();
	const farms = useFarms();

	const { data, loading } = useQuery(POLYGON_QUERY({
		USDCPair: farms?.[0]?.address?.[chainId],
		wMATICPair: farms?.[1]?.address?.[chainId],
	}))

	if (loading) {
		return value;
	}

	if (chainId !== 80001 && chainId !== 137) {
		return value;
	}

	if (data.USDCPair) {
		const ethPrice = new BigNumber(data.bundle.ethPrice);

		if (data.USDCPair.token0.derivedETH) {
			const reserve = new BigNumber(data.USDCPair.reserve0);
			const priceByEth = new BigNumber(data.USDCPair.token0.derivedETH)

			value = value.plus(reserve.times(priceByEth).times(ethPrice));
		} else if (data.USDCPair.token1.derivedETH) {
			const reserve = new BigNumber(data.USDCPair.reserve1);
			const priceByEth = new BigNumber(data.USDCPair.token1.derivedETH)

			value = value.plus(reserve.times(priceByEth).times(ethPrice));
		}
	}

	if (data.wMATICPair) {
		const ethPrice = new BigNumber(data.bundle.ethPrice);

		if (data.wMATICPair.token0.derivedETH) {
			const reserve = new BigNumber(data.wMATICPair.reserve0);
			const priceByEth = new BigNumber(data.wMATICPair.token0.derivedETH)

			value = value.plus(reserve.times(priceByEth).times(ethPrice));
		} else if (data.wMATICPair.token1.derivedETH) {
			const reserve = new BigNumber(data.wMATICPair.reserve1);
			const priceByEth = new BigNumber(data.wMATICPair.token1.derivedETH)

			value = value.plus(reserve.times(priceByEth).times(ethPrice));
		}
	}

	return value;
}