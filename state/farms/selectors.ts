import { useEffect, useState } from 'react'
import BigNumber from "bignumber.js";
import { BSC_FARM_ID, POLYGON_FARM_ID } from "constant/farms";
import { useSelector } from "react-redux";
import { useFarmQuoteTokenPrice, useTexoTokenPrice } from "state/texo/selectors";
import tokens from "config/constants/tokens";
import { useNetwork } from "state/hooks";
import { usePools } from "state/pools/selectors";
import { useAppPrices } from "state/prices/selectors";
import { getAddress } from 'utils/addressHelpers';
import { getDecimals } from 'utils/decimalsHelper';
import { useFAANGPools } from "state/fAANGpools/selectors";
import { useYieldFarmsData } from 'state/yield/selector';
import { normalizeTokenDecimal } from "utils/bigNumber";

export const useFarmFromPid = (pid): any => {
  const farm = useSelector((state: any) => state.farms.data.find((f) => f.pid === pid));

  return farm;
}

export const useFarms = () => {
  return useSelector((state: any) => state.farms.data);
}

export const useFarmsLoading = () => {
  return useSelector((state: any) => state.farms.loading);
}

export const useTotalValue = (): BigNumber => {
  const stableCoinPrice = new BigNumber(1);
  const texoPrice = new BigNumber(useTexoTokenPrice());

  const { id: chainId } = useNetwork();
  const pools = usePools();
  const fAANGs = useFAANGPools();
  const yieldFarms = useYieldFarmsData();
  const allTokenPrices = useAppPrices();

  const [yieldFarmsValue, setYieldFarmValue] = useState(0)

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

  const quoteTokenPrice = quoteTokenPerTexoPrice != (new BigNumber(0)) ? texoPrice.div(quoteTokenPerTexoPrice) : (new BigNumber(1));
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

  fAANGs.forEach((faang) => {
    const totalStaked = normalizeTokenDecimal(faang.totalStaked);
    const val = totalStaked.times(texoPrice)
    value = value.plus(val)
  })

  useEffect(() => {
    let total = new BigNumber(0)

    yieldFarms.forEach((yieldFarm) => {
      const { lpTotalInQuoteTokenVault } = yieldFarm

      let stakingTokenPrice = 0

      if (allTokenPrices.data) {
        stakingTokenPrice =
          allTokenPrices.data[
          getAddress(yieldFarm.underlying.quote.address, chainId)?.toLowerCase()
          ];
      }

      const totalPriceUnderlyingDeposit = (new BigNumber(lpTotalInQuoteTokenVault)).times(new BigNumber(stakingTokenPrice));

      total = total.plus(totalPriceUnderlyingDeposit)
    })

    setYieldFarmValue(total.toNumber() || 0)
  }, [yieldFarms])

  value = value.plus(yieldFarmsValue)

  return value;
}
