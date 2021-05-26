import { useSelector } from "react-redux";
import { Pool, State } from "state/types";

export const usePools = (): Pool[] => {
  const pools = useSelector((state: State) => state.pools.data);

  return pools;
}