import { BSC_FARM_ID } from "constant/farms"
import { useFarmFromPid } from "state/farms/selectors"

export const getTexoTokenPrice = () => {
  const texoBusdPool = useFarmFromPid(BSC_FARM_ID.TEXO_BUSD);

  const { tokenPriceVsQuote } = texoBusdPool;

  return tokenPriceVsQuote;
}