import { useSelector } from "react-redux";
import { FARM_ID } from "constant/farms";
import { useFarmFromPid } from "state/farms/selectors";
import BigNumber from "bignumber.js";

export const useTexoTokenData = () => {
  return useSelector((state: any) => state.texoToken.data);
}

export const useTexoTokenPrice = () => {
  const texoBusdPool = useFarmFromPid(FARM_ID.TEXO_BUSD);
  if (!texoBusdPool || !texoBusdPool.tokenPriceVsQuote) {
    return new BigNumber(0);
  }

  const { tokenPriceVsQuote } = texoBusdPool;

  return tokenPriceVsQuote.toNumber();
}

export const usePoolFromPid = (pid): any => {
  const pool = useSelector((state: any) => state.pools.data.find((f) => f.pid === pid));

  return pool;
}