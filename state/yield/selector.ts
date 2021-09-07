import { useSelector } from "react-redux"

export const useYieldFarmsData = () => {
  return useSelector((state: any) => state.yield.data)
}

export const useYieldFarmsLoading = () => {
  return useSelector((state: any) => state.yield.loading)
}