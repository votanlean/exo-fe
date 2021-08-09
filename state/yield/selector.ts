import { useSelector } from "react-redux"

export const useYieldFarms = () => {
	return useSelector((state: any) => state.yield)
}