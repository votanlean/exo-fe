import { useSelector } from 'react-redux';
import { BSC_FARM_ID, POLYGON_FARM_ID } from 'constant/farms';
import { useFarmFromPid } from 'state/farms/selectors';
import BigNumber from 'bignumber.js';
import { State } from '../types';
import { useNetwork } from 'state/hooks';

export const useTexoTokenData = () => {
  return useSelector((state: State) => state.texoToken.data);
};

export const useTexoTokenPrice = () => {
  const { id: chainId } = useNetwork();
  let farmId: number;

  switch (chainId) {
    case 56:
    case 5600:
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
  const price = useFarmQuoteTokenPrice(farmId);
  return price;
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
