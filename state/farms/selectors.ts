import BigNumber from "bignumber.js";
import { BSC_FARM_ID, POLYGON_FARM_ID } from "constant/farms";
import { useSelector } from "react-redux";
import { useFarmQuoteTokenPrice, useTexoTokenPrice } from "state/texo/selectors";
import tokens from "config/constants/tokens";
import { useNetwork } from "state/hooks";
import { gql, useQuery } from '@apollo/client'
import { usePools } from "state/pools/selectors";
import { useAppPrices } from "state/prices/selectors";
import { getAddress } from 'utils/addressHelpers';
import { getDecimals } from 'utils/decimalsHelper';
import { useFAANGPools } from "state/fAANGpools/selectors";
import { normalizeTokenDecimal } from "utils/bigNumber";

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
    const pools = usePools();
    const fAANGs = useFAANGPools();
    const allTokenPrices = useAppPrices();

    let farmId: number;

    switch (chainId) {
        case 56:
        case 5600:
        case 97:
            farmId = BSC_FARM_ID.TEXO_BNB;
            break;
        case 137:
        case 80001:
            farmId = POLYGON_FARM_ID.TEXO_MATIC;
            break;
        default:
            break;
    }

  const quoteTokenPerTexoPrice = new BigNumber(useFarmQuoteTokenPrice(farmId));

  const quoteTokenPrice = quoteTokenPerTexoPrice != (new BigNumber(0)) ? texoPrice.div(quoteTokenPerTexoPrice): (new BigNumber(1));
  const farms = useFarms();
  let value = new BigNumber(0);
  for (let i = 0; i < farms.length; i++) {
    const farm = farms[i];
    if (farm.lpTotalInQuoteToken) {
      let val;

      if (farm.quoteToken.symbol === tokens.wbnb.symbol || farm.quoteToken.symbol === tokens.wmatic.symbol) {
        val = (quoteTokenPrice.times(farm.lpTotalInQuoteToken));
      } else if (farm.quoteToken.symbol === tokens.busd.symbol || farm.quoteToken.symbol === tokens.usdc.symbol) {
        val = (stableCoinPrice.times(farm.lpTotalInQuoteToken));
      } else {
        val = (farm.lpTotalInQuoteToken);
      }
      value = value.plus(val);
    }
  }
    pools.forEach((pool) => {
        let stakingTokenPrice = 0;

        if (allTokenPrices.data) {
            stakingTokenPrice =
                allTokenPrices.data[
                    getAddress(pool.stakingToken.address, chainId)?.toLowerCase()
                ];
        }
        const decimal = getDecimals(pool.stakingToken.decimals as any, chainId);
        const poolTotal = pool.totalStaked?.div(new BigNumber(10).pow(decimal)).times(stakingTokenPrice) || 0;

        value = value.plus(poolTotal);
    })

    fAANGs.forEach((faang)=>{
        const totalStaked = normalizeTokenDecimal(faang.totalStaked);
        const val = totalStaked.times(texoPrice)
        value = value.plus(val)
    })
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
