import dayjs from 'dayjs';
import Countdown from 'countdown';
import { useRef, useMemo, useEffect, useState } from 'react';
import { useBlockData, useBlockDataLoading } from 'state/block/selectors';
import { useNetwork } from 'state/hooks';
import getClaimRewardsDate from 'utils/getClaimRewardsDate';

export default function useCountdownString(block: any, isBlockLoading: boolean = false) {
  const [dateString, setDateString] = useState('');
  const { currentBlock } = useBlockData();
  const isCurrentBlockLoading = useBlockDataLoading();
  const network = useNetwork();
  const countdownInterval = useRef(null);

  const date = useMemo(() =>
    getClaimRewardsDate(
      currentBlock,
      block,
      dayjs(),
      network.secondsPerBlock
    )
    , [currentBlock, block, network.secondsPerBlock]);

  useEffect(() => {
    if (
      !currentBlock ||
      isCurrentBlockLoading ||
      !block ||
      isBlockLoading ||
      countdownInterval.current
    ) {
      return
    }

    const interval = setInterval(() => {
      const hasPassedDate = dayjs().isAfter(dayjs(date));
      if (hasPassedDate) {
        countdownInterval.current = null;
        clearInterval(interval);
        setDateString('0 seconds');

        return;
      }

      const countDownString = Countdown(new Date(), date).toString();

      setDateString(countDownString);
    }, 1000);

    countdownInterval.current = interval;

    return (() => {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
        countdownInterval.current = null;
      }
    })
  }, [date.toString()]);

  return dateString;
}