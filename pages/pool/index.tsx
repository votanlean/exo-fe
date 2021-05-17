import { useEffect, useState } from 'react';
import Head from 'next/head';
import styles from './pool.module.scss';

import web3 from '../../binance/web3';
import PoolItem from '~views/components/PoolItem'
import {poolToken} from '../../binance/tokenFactory';
import { useWeb3React } from '@web3-react/core';
import orchestratorInstance from 'binance/orchestrator';
import Countdown from 'countdown';
import dayjs from 'dayjs';
import Statistic from '../../views/components/Statistic';


function getClaimRewardsDate(currentBlockHeight, canClaimRewardBlockHeight, startDate) {
  if (!currentBlockHeight || !canClaimRewardBlockHeight) {
    return dayjs();
  }

  const blockDiff = canClaimRewardBlockHeight - currentBlockHeight;
  if (blockDiff <= 0) {
    return dayjs();
  }

  const secondsDiff = Math.ceil(blockDiff * 3);
  const claimRewardDate = startDate.add(secondsDiff, 'seconds');

  return claimRewardDate;
}

function Pool() {
  const { account } = useWeb3React();
  const [currentBlockHeight, setCurrentBlockHeight] = useState(0);
  const [countDownString, setCountDownString] = useState('');
  const [countDownInterval, setCountDownInterval] = useState(null);
  const [canClaimRewardBlockHeight, setCanClaimRewardBlockHeight] = useState(0);

  const getCurrentBlockHeight = async () => {
    const currentBlockHeight = await web3.eth.getBlockNumber();
    setCurrentBlockHeight(currentBlockHeight);
  }

  const getGlobalCanClaimRewardsBlockHeight = async () => {
    const globalCanClaimRewardsBlockHeight = await orchestratorInstance.methods.globalBlockToUnlockClaimingRewards().call();

    setCanClaimRewardBlockHeight(globalCanClaimRewardsBlockHeight);
  }

  useEffect(() => {
    getGlobalCanClaimRewardsBlockHeight();
    const interval = setInterval(getCurrentBlockHeight, 500);

    return () => {
      clearInterval(interval)
      clearInterval(countDownInterval);
    };
  }, []);

  useEffect(() => {
    if (!canClaimRewardBlockHeight || !currentBlockHeight || countDownInterval) {
      return;
    }

    const claimRewardDate = getClaimRewardsDate(currentBlockHeight, canClaimRewardBlockHeight, dayjs()).toDate();

    const interval = setInterval(() => {
      const countDownString = Countdown(new Date(), claimRewardDate).toString();

      setCountDownString(countDownString);
    }, 1000);

    setCountDownInterval(interval);
  }, [canClaimRewardBlockHeight, currentBlockHeight]);


  return (
    <>
      <Head>
        <title>Pool</title>
      </Head>

      <div className={styles.countdownContainer}>
        <h1 style={{ marginBottom: '10px' }}>Count Down To Claim Rewards</h1>
        <h2>{countDownString}</h2>
      </div>

      <div className="container pool-container">
        <div className="pool-grid">
          {
            poolToken.map(pool => <PoolItem
              selectedAccount={account}
              currentBlockHeight={currentBlockHeight}
              onPoolStateChange={getCurrentBlockHeight}
              data={pool}
              key={pool.id}
            />)
          }
        </div>
        <Statistic/>
      </div>

    </>
  )
}

export default Pool
