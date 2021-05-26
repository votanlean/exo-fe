import BigNumber from "bignumber.js";
import { FARM_ID } from "constant/farms";
import { useSelector } from "react-redux";
import { useFarmQuoteTokenPrice, useTexoTokenPrice } from "state/texo/selectors";
import tokens from "config/constants/tokens";

export const useFarmFromPid = (pid): any => {
  const farm = useSelector((state: any) => state.farms.data.find((f) => f.pid === pid));

  return farm;
}

export const useFarms = () => {
  return useSelector((state: any) => state.farms.data);
}

export const useTotalValue = (): BigNumber => {
  const busdPrice = new BigNumber(1);
  const texoPrice = new BigNumber(useTexoTokenPrice());
  const bnbPerTexoPrice = new BigNumber(useFarmQuoteTokenPrice(FARM_ID.TEXO_BNB));
  const bnbPrice = bnbPerTexoPrice.times(texoPrice);
  const farms = useFarms();
  let value = new BigNumber(0);

  for (let i = 0; i < farms.length; i++) {
    const farm = farms[i];

    if (farm.lpTotalInQuoteToken) {
      let val;

      if (farm.quoteTokenSymbol === tokens.wbnb) {
        val = (bnbPrice.times(farm.lpTotalInQuoteToken));
      } else if (farm.quoteTokenSymbol === tokens.busd) {
        val = (busdPrice.times(farm.lpTotalInQuoteToken));
      } else {
        val = (farm.lpTotalInQuoteToken);
      }

      value = value.plus(val);
    }
  }

  return value;
}