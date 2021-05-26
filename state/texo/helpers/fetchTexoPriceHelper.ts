import { FARM_ID } from "constant/farms"
import { useFarmFromPid } from "state/farms/selectors"

export const getTexoTokenPrice = () => {
  const texoBusdPool = useFarmFromPid(FARM_ID.TEXO_BUSD);

  const { tokenPriceVsQuote } = texoBusdPool;

  return tokenPriceVsQuote;
}