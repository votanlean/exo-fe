import BigNumber from 'bignumber.js';
import { BLOCKS_PER_YEAR, POLYGON_BLOCKS_PER_YEAR } from '../config';

/**
 * Get the APR value in %
 * @param stakingTokenPrice Token price in the same quote currency
 * @param rewardTokenPrice Token price in the same quote currency
 * @param totalStaked Total amount of stakingToken in the pool
 * @param tokenPerBlock Amount of new cake allocated to the pool for each new block
 * @param chainId network chain Id
 * @returns Null if the APR is NaN or infinite.
 */
export const getPoolApr = (
  stakingTokenPrice: number,
  rewardTokenPrice: number,
  totalStaked: number,
  tokenPerBlock: number,
  chainId: number,
): number => {
  let blockPerYear: BigNumber;

  switch (chainId) {
    case 137:
    case 80001:
      blockPerYear = POLYGON_BLOCKS_PER_YEAR;
      break;
    case 56:
    case 5600:
    case 97:
    default:
      blockPerYear = BLOCKS_PER_YEAR;
      break;
  }

  const totalRewardPricePerYear = new BigNumber(rewardTokenPrice)
    .times(tokenPerBlock)
    .times(blockPerYear);
  const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(
    totalStaked,
  );
  const apr = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100);

  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber();
};

/**
 * Get farm APR value in %
 * @param poolWeight allocationPoint / totalAllocationPoint
 * @param tEXOPriceUSD Cake price in USD
 * @param poolLiquidityUsd Total pool liquidity in USD
 * @param chainId network chain Id
 * @returns
 */
export const getFarmApr = (
  poolWeight: BigNumber,
  tEXOPriceUSD: BigNumber,
  poolLiquidityUsd: BigNumber,
  tEXOPerBlock: BigNumber,
  chainId: number,
): number => {
  let blockPerYear: BigNumber;

  switch (chainId) {
    case 137:
    case 80001:
      blockPerYear = POLYGON_BLOCKS_PER_YEAR;
      break;
    case 56:
    case 5600:
    case 97:
    default:
      blockPerYear = BLOCKS_PER_YEAR;
      break;
  }

  const yearlyCakeRewardAllocation = tEXOPerBlock
    .times(blockPerYear)
    .times(poolWeight);
  const apr = yearlyCakeRewardAllocation
    .times(tEXOPriceUSD)
    .div(poolLiquidityUsd)
    .times(100);
  return apr.isNaN() || !apr.isFinite() ? null : apr.toNumber();
};

export default null;
