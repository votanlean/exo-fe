import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import seedingPools from 'config/constants/seedingPools';
import farms from 'config/constants/farms';
import Countdown from 'countdown';
import { useWeb3React } from '@web3-react/core';
import dayjs from 'dayjs';
import {
  makeStyles,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from '@material-ui/core';
import BigNumber from 'bignumber.js';

import Statistic from '../../components/Statistic';
import PoolRow from '../../components/PoolRow';

import styles from './pool.module.scss';
import { useBlockData } from 'state/block/selectors';
import { useTexoTokenData, useTexoTokenPrice } from 'state/texo/selectors';
import { useAppDispatch } from 'state';
import {
  fetchFarmsPublicDataAsync,
  fetchFarmUserDataAsync,
} from 'state/farms/reducer';
import { getAddress, getTEXOAddress } from 'utils/addressHelpers';

import { fetchTexoTokenDataThunk } from 'state/texo/reducer';
import { fetchOrchestratorDataThunk } from 'state/orchestrator/reducer';
import { useOrchestratorData } from 'state/orchestrator/selectors';
import { fetchBlockDataThunk } from 'state/block/reducer';
import { usePools } from 'state/pools/selectors';
import {
  fetchPoolsPublicDataAsync,
  fetchPoolsUserDataAsync,
} from 'state/pools/reducer';
import { fetchAppPrices } from 'state/prices/reducer';
import { useAppPrices } from 'state/prices/selectors';
import { useFarms, useTotalValue } from 'state/farms/selectors';
import FarmItem from 'components/FarmItem';
import { fetchUserInfoDataThunk } from '../../state/userInfo/reducer';
import { useUserInfoData } from '../../state/userInfo/selectors';

const useStyles = makeStyles((theme) => {
  return {
    tableContainer: {
      filter: 'drop-shadow(rgba(25, 19, 38, 0.15) 0px 1px 4px)',
      width: '100%',
      background: 'rgb(255, 255, 255)',
      borderRadius: '16px',
      margin: '16px 0px',
    },
  };
});

function getClaimRewardsDate(currentBlock, canClaimRewardsBlock, startDate) {
  if (!currentBlock || !canClaimRewardsBlock) {
    return dayjs();
  }

  const blockDiff = canClaimRewardsBlock - currentBlock;
  if (blockDiff <= 0) {
    return dayjs();
  }

  const secondsDiff = Math.ceil(blockDiff * 3);
  const claimRewardDate = startDate.add(secondsDiff, 'seconds');

  return claimRewardDate;
}

function Pool() {
  const classes: any = useStyles();
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const [countDownString, setCountDownString] = useState('');

  const allTokenPrices = useAppPrices();
  const tEXOPrice = useTexoTokenPrice();
  const poolsData = usePools();
  const farmsData = useFarms();
  const tvl = useTotalValue();

  const { currentBlock } = useBlockData();
  const { totalSupply: tEXOTotalSupply, tEXOBurned: burnAmount } =
    useTexoTokenData();
  const { tEXOPerBlock, canClaimRewardsBlock } = useOrchestratorData();
  const { tEXOReward } = useUserInfoData();

  const refreshAppGlobalData = () => {
    dispatch(fetchFarmsPublicDataAsync());
    dispatch(fetchTexoTokenDataThunk);
    dispatch(fetchOrchestratorDataThunk);
    dispatch(fetchBlockDataThunk);
    dispatch(fetchPoolsPublicDataAsync);
    dispatch(fetchAppPrices);

    if (account) {
      dispatch(fetchFarmUserDataAsync(account));
      dispatch(fetchPoolsUserDataAsync(account));
      dispatch(fetchUserInfoDataThunk(account));
    }
  };

  useEffect(refreshAppGlobalData, [account, dispatch]);

  const countDownInterval = useRef(null);

  useEffect(() => {
    const updateAppDataInterval = setInterval(() => {
      dispatch(fetchFarmsPublicDataAsync());
      dispatch(fetchTexoTokenDataThunk);
      dispatch(fetchPoolsPublicDataAsync);

      if (account) {
        dispatch(fetchFarmUserDataAsync(account));
        dispatch(fetchPoolsUserDataAsync(account));
      }
    }, 30000);

    return () => {
      clearInterval(updateAppDataInterval);
    };
  }, []);

  useEffect(() => {
    if (!canClaimRewardsBlock || !currentBlock || countDownInterval.current) {
      return;
    }

    const claimRewardDate = getClaimRewardsDate(
      currentBlock,
      canClaimRewardsBlock,
      dayjs(),
    ).toDate();

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
    }, 1000);

    countDownInterval.current = interval;

    return () => {
      if (countDownInterval.current) {
        clearInterval(countDownInterval.current);
        countDownInterval.current = null;
      }
    };
  }, [currentBlock, canClaimRewardsBlock]);

  return (
    <>
      <Head>
        <title>Pool</title>
      </Head>

      <div className="container pool-container">
        <Statistic
          tEXOPrice={tEXOPrice}
          tvl={tvl}
          totalSupply={tEXOTotalSupply}
          currentTEXOPerBlock={tEXOPerBlock}
          burnAmount={burnAmount}
          tEXOReward={new BigNumber(tEXOReward)}
        />

        <div className={styles.countdownContainer}>
          <Typography
            variant="h5"
            align="center"
            style={{ marginBottom: '30px', lineHeight: '40px' }}
          >
            Stake tEXO LPs (PCS V2) for tEXO reward.
            <br />
            Farming reward will be generated in
          </Typography>
          <Typography variant="h3" color="primary">
            {countDownString}
          </Typography>
        </div>

        <div className={styles.lpPoolGrid}>
          {farms.map((farm, index) => {
            let stakingTokenPrice = 0;

            if (allTokenPrices.data) {
              stakingTokenPrice =
                allTokenPrices.data[getAddress(farm.quoteToken.address)];
            }

            return (
              <FarmItem
                selectedAccount={account}
                onPoolStateChange={refreshAppGlobalData}
                canClaimReward={
                  currentBlock && currentBlock >= canClaimRewardsBlock
                }
                stakingTokenPrice={stakingTokenPrice}
                tEXOPrice={tEXOPrice}
                farmData={farmsData[index]}
                key={farm.pid}
                isLiquidityPool={true}
                countDownString={countDownString}
              />
            );
          })}
        </div>
        {currentBlock && currentBlock >= canClaimRewardsBlock ? (
          <div className={styles.countdownContainer}>
            <Typography variant="h3" color="primary">
              Seed phase already completed
            </Typography>
          </div>
        ) : (
          <div className={styles.countdownContainer}>
            <Typography
              variant="h5"
              align="center"
              paragraph
              style={{ marginBottom: '10px', lineHeight: '40px' }}
            >
              Equitable Distribution of tEXO in seed pools. Stake BEP-20 tokens
              for tEXO.
              <br />
              (4% Deposit Fee applies for tEXO liquidity)
              <br />
              Seed Pools reward startblock at (to be added in later)
              <br />
              Users can harvest tEXO in
            </Typography>
            <Typography variant="h3" color="primary">
              {countDownString}
            </Typography>
          </div>
        )}

        <TableContainer className={classes.tableContainer}>
          <Table aria-label="collapsible table">
            <TableBody>
              {seedingPools.map((pool, index) => {
                let stakingTokenPrice = 0;

                if (allTokenPrices.data) {
                  stakingTokenPrice =
                    allTokenPrices.data[getAddress(pool.stakingToken.address)];
                }

                return (
                  <PoolRow
                    key={pool.id}
                    data={poolsData[index]}
                    selectedAccount={account}
                    onPoolStateChange={refreshAppGlobalData}
                    canClaimReward={
                      currentBlock && currentBlock >= canClaimRewardsBlock
                    }
                    stakingTokenPrice={stakingTokenPrice}
                    tEXOPrice={tEXOPrice}
                    countDownString={countDownString}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default Pool;
