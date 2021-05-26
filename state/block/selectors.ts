import { useSelector } from "react-redux";

export const useBlockData = () => {
  return useSelector((state: any) => state.block.data);
}
