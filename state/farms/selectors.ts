import { Farm } from "config/constants/types";
import { useSelector } from "react-redux";

export const useFarmFromPid = (pid): Farm => {
  const farm = useSelector((state: any) => state.farms.data.find((f) => f.pid === pid));

  return farm;
}