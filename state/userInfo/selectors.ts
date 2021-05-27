import { useSelector } from "react-redux";

export const useUserInfoData = () => {
  return useSelector((state: any) => state.userInfo.data);
}
