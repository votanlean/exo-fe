import { useSelector } from "react-redux";

export const useAppPrices = () => {
  return useSelector((state: any) => state.appPrices.data);
}