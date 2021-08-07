import BigNumber from "bignumber.js";
import { useSelector } from "react-redux";

export const useAllChainTotalValue = (): any => {
  const tlv = useSelector((state: any) => state.tlv);

  return new BigNumber(tlv);
}