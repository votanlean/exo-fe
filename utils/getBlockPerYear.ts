import { BLOCKS_PER_YEAR, POLYGON_BLOCKS_PER_YEAR } from "config";

export const getBlockPerYear = (chainId: number) => {
  switch (chainId) {
    case 137:
    case 80001:
      return POLYGON_BLOCKS_PER_YEAR;
    case 56:
    case 5600:
    case 97:
    default:
      return BLOCKS_PER_YEAR;
  }
}