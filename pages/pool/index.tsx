import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
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

import ApolloClient from 'components/ApolloClient';
import Statistic from 'components/Statistic';
import PoolRow from 'components/PoolRow';

import styles from './pool.module.scss';
import { useBlockData } from 'state/block/selectors';
import { useTexoTokenData, useTexoTokenPrice } from 'state/texo/selectors';
import { useAppDispatch } from 'state';
import {
  fetchFarmsPublicDataAsync,
  fetchFarmUserDataAsync,
} from 'state/farms/reducer';
import { getAddress } from 'utils/addressHelpers';
import { fetchTexoTokenDataThunk } from 'state/texo/reducer';
import { fetchOrchestratorDataThunk } from 'state/orchestrator/reducer';
import { useOrchestratorData } from 'state/orchestrator/selectors';
import { fetchBlockDataThunk } from 'state/block/reducer';
import { usePools } from 'state/pools/selectors';
import { fetchAppPrices } from 'state/prices/reducer';
import { useAppPrices } from 'state/prices/selectors';
import { useFarms, useTotalValue } from 'state/farms/selectors';
import FarmItem from 'components/FarmItem';
import { fetchUserInfoDataThunk } from '../../state/userInfo/reducer';
import { useUserInfoData } from '../../state/userInfo/selectors';
import FaangItem from 'components/FaangItem';
import { useFAANGPools } from '../../state/fAANGpools/selectors';
import {
  fetchFAANGPoolsPublicDataAsync,
  fetchFAANGPoolsUserDataAsync,
} from '../../state/fAANGpools/reducer';
import {
  fetchPoolsPublicDataAsync,
  fetchPoolsUserDataAsync,
  replacePoolAsync,
} from '../../state/pools/reducer';
import { useNetwork } from 'state/hooks';
import { getFarms } from 'utils/farmsHelpers';
import network from 'state/network';
import { Network } from 'state/types';
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

function getClaimRewardsDate(
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

function Pool() {
  const poolPageReady =
    // @ts-ignore
    process.env.POOL_PAGE_READY == true ||
    process.env.POOL_PAGE_READY == 'true';
  const classes: any = useStyles();
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const [countDownString, setCountDownString] = useState('');
  const [countDownStringFarm, setCountDownStringFarm] = useState('');
  const allTokenPrices = useAppPrices();
  const tEXOPrice = useTexoTokenPrice();
  const poolsData = usePools();
  const { id: chainId } = useNetwork();
  const fAANGData = useFAANGPools();
  const farmsData = useFarms();
  const tvl = useTotalValue();

  const { currentBlock } = useBlockData();

  const { totalSupply: tEXOTotalSupply, tEXOBurned: burnAmount } =
    useTexoTokenData();
  const {
    tEXOPerBlock,
    canClaimRewardsBlock,
    seedingStartBlock,
    seedingFinishBlock,
  } = useOrchestratorData();

  const { tEXOReward } = useUserInfoData();
  const network = useNetwork();

  const refreshAppGlobalData = () => {
    dispatch(fetchFarmsPublicDataAsync(chainId));
    dispatch(fetchTexoTokenDataThunk(chainId));
    dispatch(fetchOrchestratorDataThunk(chainId, network));
    dispatch(fetchBlockDataThunk(chainId));
    dispatch(replacePoolAsync(chainId));
    dispatch(fetchAppPrices(chainId));
    dispatch(fetchFAANGPoolsPublicDataAsync(chainId));

    if (account) {
      dispatch(fetchFarmUserDataAsync(account, chainId));
      dispatch(fetchPoolsUserDataAsync(account, chainId));
      dispatch(fetchFAANGPoolsUserDataAsync(account, chainId));
      dispatch(fetchUserInfoDataThunk(account, chainId));
    }
  };

  useEffect(refreshAppGlobalData, [account, dispatch, chainId]);

  const countDownInterval = useRef(null);
  const countDownIntervalFarm = useRef(null);

  useEffect(() => {
    const updateAppDataInterval = setInterval(() => {
      dispatch(fetchFarmsPublicDataAsync(chainId));
      dispatch(fetchTexoTokenDataThunk(chainId));
      dispatch(fetchPoolsPublicDataAsync(chainId));
      dispatch(fetchFAANGPoolsPublicDataAsync(chainId));

      if (account) {
        dispatch(fetchFarmUserDataAsync(account, chainId));
        dispatch(fetchPoolsUserDataAsync(account, chainId));
        dispatch(fetchFAANGPoolsUserDataAsync(account, chainId));
        dispatch(fetchUserInfoDataThunk(account, chainId));
      }
    }, 30000);

    return () => {
      clearInterval(updateAppDataInterval);
    };
  }, [chainId]);

  useEffect(() => {
    if (
      !canClaimRewardsBlock ||
      !seedingFinishBlock ||
      !currentBlock ||
      countDownInterval.current
    ) {
      return;
    }
    const claimRewardDate = getClaimRewardsDate(
      currentBlock,
      canClaimRewardsBlock,
      dayjs(),
      network.secondsPerBlock,
    ).toDate();

    const claimFarmRewardDate = getClaimRewardsDate(
      currentBlock,
      seedingFinishBlock,
      dayjs(),
      network.secondsPerBlock,
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

    const intervalFarm = setInterval(() => {
      const hasPassedRewardLockDate = dayjs().isAfter(
        dayjs(claimFarmRewardDate),
      );
      if (hasPassedRewardLockDate) {
        countDownIntervalFarm.current = null;
        clearInterval(intervalFarm);
        setCountDownStringFarm('0 seconds');
        return;
      }

      const countDownString = Countdown(
        new Date(),
        claimFarmRewardDate,
      ).toString();

      setCountDownStringFarm(countDownString);
    }, 1000);

    countDownIntervalFarm.current = intervalFarm;
    countDownInterval.current = interval;

    return () => {
      if (countDownInterval.current) {
        clearInterval(countDownInterval.current);
        countDownInterval.current = null;
      }
      if (countDownIntervalFarm.current) {
        clearInterval(countDownIntervalFarm.current);
        countDownIntervalFarm.current = null;
      }
    };
  }, [currentBlock, canClaimRewardsBlock, seedingFinishBlock]);

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
            {poolPageReady ? countDownStringFarm : 'Coming Soon'}
          </Typography>
        </div>

        <div className={styles.lpPoolGrid}>
          {getFarms(chainId).map((farm, index) => {
            let stakingTokenPrice = 0;

            if (allTokenPrices.data) {
              stakingTokenPrice =
                allTokenPrices.data[
                  getAddress(farm.quoteToken.address, chainId)
                ];
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
                countDownString={countDownString}
              />
            );
          })}
        </div>

        <div className={styles.titleSection}>
          <Typography
            variant="h5"
            align="center"
            style={{ lineHeight: '40px' }}
          >
            Stake tEXO for FAANG
          </Typography>
        </div>

        <div className={styles.lpPoolGrid}>
          {fAANGData.map((pool) => (
            <FaangItem
              key={pool.id}
              pool={pool}
              tEXOPrice={tEXOPrice}
              account={account}
            />
          ))}
        </div>

        {currentBlock > seedingFinishBlock ? (
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
              {poolPageReady
                ? `Seed Pools reward startblock at ${seedingStartBlock}`
                : ''}
              <br />
              Users can harvest tEXO in
            </Typography>
            <Typography variant="h3" color="primary">
              {poolPageReady ? countDownString : 'Coming Soon'}
            </Typography>
          </div>
        )}

        <TableContainer className={classes.tableContainer}>
          <Table aria-label="collapsible table">
            <TableBody>
              {poolsData.map((pool) => {
                let stakingTokenPrice = 0;

                if (allTokenPrices.data) {
                  stakingTokenPrice =
                    allTokenPrices.data[
                      getAddress(pool.stakingToken.address, chainId)
                    ];
                }
                return (
                  <PoolRow
                    key={pool.id}
                    pool={pool}
                    account={account}
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

const PoolWrapper = () => {
  return (
    <ApolloClient>
      <Pool />
    </ApolloClient>
  );
};

export default PoolWrapper;
