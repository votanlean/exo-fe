import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import seedingPools from 'config/constants/seedingPools';
import Countdown from 'countdown';
import { useWeb3React } from '@web3-react/core';
import dayjs from 'dayjs';
import { Typography } from '@material-ui/core';

import PoolItem from '../../components/PoolItem';
import Statistic from '../../components/Statistic';
import { usePrices } from '../../hookApi/prices';

import styles from './pool.module.scss';
import { useBlockData } from 'state/block/selectors';
import { useTexoTokenData, useTexoTokenPrice } from 'state/texo/selectors';
import { useAppDispatch } from 'state';
import { fetchFarmsPublicDataAsync, fetchFarmUserDataAsync } from 'state/farms/reducer';
import { getAddress } from 'utils/addressHelpers';
import { fetchTexoTokenDataThunk } from 'state/texo/reducer';
import { fetchOrchestratorDataThunk } from 'state/orchestrator/reducer';
import { useOrchestratorData } from 'state/orchestrator/selectors';
import { fetchBlockDataThunk } from 'state/block/reducer';
import { usePools } from 'state/pools/selectors';
import { fetchPoolsPublicDataAsync, fetchPoolsUserDataAsync } from 'state/pools/reducer';

function getClaimRewardsDate(
  currentBlock,
  canClaimRewardsBlock,
  startDate,
) {
  if (!currentBlock || !canClaimRewardsBlock) {
    return dayjs()
  }

  const blockDiff = canClaimRewardsBlock - currentBlock
  if (blockDiff <= 0) {
    return dayjs()
  }

  const secondsDiff = Math.ceil(blockDiff * 3)
  const claimRewardDate = startDate.add(secondsDiff, 'seconds')

  return claimRewardDate
}

function Pool() {
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const [countDownString, setCountDownString] = useState('');

  const allTokenPrices = usePrices();
  console.log('allTokenPrices', allTokenPrices);
  const tEXOPrice = useTexoTokenPrice();
  const poolsData = usePools();

  const { currentBlock } = useBlockData();
  const { totalSupply: tEXOTotalSupply, tEXOBurned: burnAmount } = useTexoTokenData();
  const { tEXOPerBlock, canClaimRewardsBlock } = useOrchestratorData();

  useEffect(() => {
    dispatch(fetchFarmsPublicDataAsync);
    dispatch(fetchTexoTokenDataThunk);
    dispatch(fetchOrchestratorDataThunk);
    dispatch(fetchBlockDataThunk);
    dispatch(fetchPoolsPublicDataAsync);

    if (account) {
      dispatch(fetchFarmUserDataAsync(account));
      dispatch(fetchPoolsUserDataAsync(account));
    }
  }, [account, dispatch]);

  const countDownInterval = useRef(null);

  useEffect(() => {
    if (!canClaimRewardsBlock || !currentBlock || countDownInterval.current) { return; }
    
    const claimRewardDate = getClaimRewardsDate(currentBlock, canClaimRewardsBlock, dayjs()).toDate();
    
    const interval = setInterval(() => {
      const hasPassedRewardLockDate = dayjs().isAfter(dayjs(claimRewardDate));

      if (hasPassedRewardLockDate) {
        countDownInterval.current = null;
        clearInterval(interval);
        setCountDownString('0 seconds');

        return;
      }

      const countDownString = Countdown(new Date(), claimRewardDate).toString();

      setCountDownString(countDownString);
    }, 1000)

    countDownInterval.current = interval;

    return () => {
      if (countDownInterval.current) {
        clearInterval(countDownInterval.current);
        countDownInterval.current = null;
      };
    };
  }, [currentBlock, canClaimRewardsBlock])

  return (
    <>
      <Head>
        <title>Pool</title>
      </Head>

      <div className="container pool-container">
        <Statistic
          tEXOPrice={tEXOPrice}
          totalSupply={tEXOTotalSupply}
          currentTEXOPerBlock={tEXOPerBlock}
          burnAmount={burnAmount}
        />

         {/* <div className="pool-grid">
          {lpPoolToken.map(pool => (
            <PoolItem
              selectedAccount={account}
              currentBlock={currentBlock}
              onPoolStateChange={getCurrentBlockHeight}
              stakingTokenPrice={allTokenPrices[pool.address] || 0}
              tEXOPrice={allTokenPrices[tEXOAddress] || 0}
              data={pool}
              key={pool.id}
              isLiquidityPool={true}
            />
          ))}
        </div> */}

        <div className={styles.countdownContainer}>
         <Typography variant="h4" style={{ marginBottom: '10px' }}>
           Count Down To Claim Rewards and Farming
         </Typography>
         <Typography variant="h3" color="primary">
           {countDownString}
         </Typography>
        </div>

        <div className="pool-grid">
          {seedingPools.map((pool, index) => (
            <PoolItem
              selectedAccount={account}
              canClaimReward={currentBlock && currentBlock <= canClaimRewardsBlock}
              currentBlockHeight={currentBlock}
              stakingTokenPrice={allTokenPrices[getAddress(pool.stakingToken.address)]}
              tEXOPrice={tEXOPrice}
              poolData={poolsData[index]}
              key={pool.id}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default Pool
