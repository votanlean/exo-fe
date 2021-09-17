import { bnbEcAssetPools } from 'config/constants/ecAssetPools'

export const getEcAssetPool = (chainId?: number): Array<any> => {
  if (chainId === 56 || chainId === 5600) {
    return bnbEcAssetPools
  }

  return []
}