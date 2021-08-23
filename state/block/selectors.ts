import { useSelector } from "react-redux";

export const useBlockData = () => {
  return useSelector((state: any) => state.block.data);
}

export const useBlockDataLoading = () => {
  return useSelector((state: any) => state.block.loading)
}