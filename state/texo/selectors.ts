import { useSelector } from 'react-redux';
import { FARM_ID } from 'constant/farms';
import { useFarmFromPid } from 'state/farms/selectors';
import BigNumber from 'bignumber.js';
import { State } from '../types';

export const useTexoTokenData = () => {
  return useSelector((state: State) => state.texoToken.data);
};

export const useTexoTokenPrice = () => {
  return useFarmQuoteTokenPrice(FARM_ID.TEXO_BUSD);
};

export const useFarmQuoteTokenPrice = (farmId) => {
  const farm = useFarmFromPid(farmId);
  if (!farm || !farm.tokenPriceVsQuote) {
    return new BigNumber(0);
  }

  const { tokenPriceVsQuote } = farm;

  return tokenPriceVsQuote;
};

export const usePoolFromPid = (pid): any => {
  const pool = useSelector((state: any) =>
    state.pools.data.find((f) => f.id === pid),
  );

  return pool;
};
