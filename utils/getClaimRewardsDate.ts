import dayjs from 'dayjs';

export default function getClaimRewardsDate(
  currentBlock,
  canClaimRewardsBlock,
  startDate,
  secondPerBlock,
) {
  if (!currentBlock || !canClaimRewardsBlock) {
    return dayjs();
  }

  const blockDiff = canClaimRewardsBlock - currentBlock;
  if (blockDiff <= 0) {
    return dayjs();
  }

  const secondsDiff = Math.ceil(blockDiff * secondPerBlock);
  const claimRewardDate = startDate.add(secondsDiff, 'seconds');
  return claimRewardDate;
}