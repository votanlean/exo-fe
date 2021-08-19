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
  replaceFarmWithoutUserDataAsync,
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
  replaceFAANGPoolsWithoutUserData,
} from '../../state/fAANGpools/reducer';
import {
  fetchPoolsPublicDataAsync,
  fetchPoolsUserDataAsync,
  replacePoolWithoutUserDataAsync,
} from '../../state/pools/reducer';
import { useNetwork } from 'state/hooks';
import { getFarms } from 'utils/farmsHelpers';
import { useFAANGOrchestratorData } from '../../state/FAANGOrchestrator/selectors';
import { fetchFAANGOrchestratorDataThunk } from 'state/FAANGOrchestrator/reducer';
import { useAllChainTotalValue } from 'state/tlv/selectors';
import { fetchTLV } from 'state/tlv/reducer';
import BannerCoinTelegraph from 'components/BannerCoinTelegraph';

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
  const [countDownStringToConcludeFAANG, setCountDownStringToConcludeFAANG] =
    useState('');
  const [fAANGFinishBlock, setFAANGFinishBlock] = useState(null);
  const [countDownStringFarm, setCountDownStringFarm] = useState('');
  const allTokenPrices = useAppPrices();
  const tEXOPrice = useTexoTokenPrice();
  const poolsData = usePools();
  const { id: chainId, blockExplorerUrl } = useNetwork();
  const fAANGData = useFAANGPools();
  const farmsData = useFarms();
  const tvl = useTotalValue();
  const totalTvl = useAllChainTotalValue();
  const { FAANGFinishBlock } = useFAANGOrchestratorData();

  const { currentBlock } = useBlockData();

  const { totalSupply: tEXOTotalSupply, tEXOBurned: burnAmount } =
    useTexoTokenData();
  const {
    tEXOPerBlock,
    canClaimRewardsBlock,
    seedingStartBlock,
    seedingFinishBlock,
    farmStartBlock,
  } = useOrchestratorData();

  const { tEXOReward } = useUserInfoData();
  const network = useNetwork();

  let blockExplorerToCountDownSeeding;

  if (currentBlock < seedingStartBlock) {
    blockExplorerToCountDownSeeding =
      blockExplorerUrl + '/block/countdown/' + seedingStartBlock;
  } else if (currentBlock < canClaimRewardsBlock) {
    blockExplorerToCountDownSeeding =
      blockExplorerUrl + '/block/countdown/' + canClaimRewardsBlock;
  } else {
    blockExplorerToCountDownSeeding =
      blockExplorerUrl + '/block/countdown/' + seedingFinishBlock;
  }

  const blockExplorerToCountDownFAANG =
    blockExplorerUrl + '/block/countdown/' + fAANGFinishBlock;

  const refreshAppGlobalData = () => {
    dispatch(replaceFarmWithoutUserDataAsync(chainId));
    dispatch(fetchTexoTokenDataThunk(chainId));
    dispatch(fetchOrchestratorDataThunk(chainId, network));
    dispatch(fetchFAANGOrchestratorDataThunk(chainId, network));
    dispatch(fetchBlockDataThunk(chainId));
    dispatch(replacePoolWithoutUserDataAsync(chainId));
    dispatch(fetchAppPrices(chainId));
    dispatch(replaceFAANGPoolsWithoutUserData(chainId));
    dispatch(fetchTLV);

    if (account) {
      dispatch(fetchFarmUserDataAsync(account, chainId));
      dispatch(fetchPoolsUserDataAsync(account, chainId));
      dispatch(fetchFAANGPoolsUserDataAsync(account, chainId));
      dispatch(fetchUserInfoDataThunk(account, chainId));
    }
  };

  useEffect(refreshAppGlobalData, [account, dispatch, chainId]);

  useEffect(() => {
    if (chainId === 56) {
      setFAANGFinishBlock(10770888);
    }
    
    if (chainId === 137) {
      setFAANGFinishBlock(19089090);
    }
  }, [chainId])

  const countDownInterval = useRef(null);
  const countDownIntervalFAANGConclude= useRef(null);
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
  }, [chainId, account]);

  useEffect(() => {
    if (
      !farmStartBlock ||
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

    const seedingStartDate = getClaimRewardsDate(
      currentBlock,
      seedingStartBlock,
      dayjs(),
      network.secondsPerBlock,
    ).toDate();

    const claimFarmRewardDate = getClaimRewardsDate(
      currentBlock,
      farmStartBlock,
      dayjs(),
      network.secondsPerBlock,
    ).toDate();

    const fAANGConcludeDate = getClaimRewardsDate(
      currentBlock,
      fAANGFinishBlock,
      dayjs(),
      network.secondsPerBlock,
    ).toDate();

    const intervalFAANG = setInterval(() => {
      const hasPassedFAANGConcludeDate = dayjs().isAfter(dayjs(fAANGConcludeDate));
      if (hasPassedFAANGConcludeDate) {
        countDownIntervalFAANGConclude.current = null;
        clearInterval(intervalFAANG);
        setCountDownStringToConcludeFAANG('0 seconds');

        return;
      }

      const countDownString = Countdown(new Date(), fAANGConcludeDate).toString();

      setCountDownStringToConcludeFAANG(countDownString);
    }, 1000);

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
    countDownIntervalFAANGConclude.current = intervalFAANG;

    return () => {
      if (countDownInterval.current) {
        clearInterval(countDownInterval.current);
        countDownInterval.current = null;
      }
      if (countDownIntervalFarm.current) {
        clearInterval(countDownIntervalFarm.current);
        countDownIntervalFarm.current = null;
      }
      if (countDownIntervalFAANGConclude.current) {
        clearInterval(countDownIntervalFAANGConclude.current);
        countDownIntervalFAANGConclude.current = null;
      }
    };
  }, [
    currentBlock,
    canClaimRewardsBlock,
    seedingStartBlock,
    seedingFinishBlock,
    farmStartBlock,
    network?.secondsPerBlock,
  ]);

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
          allChainTvl={totalTvl}
        />

        <BannerCoinTelegraph />

        <div className={styles.countdownContainer}>
          <Typography
            variant="h5"
            align="center"
            style={{ marginBottom: '30px', lineHeight: '40px' }}
          >
            {chainId === 56 || chainId === 97
              ? 'Stake tEXO LPs (PCS V2) for tEXO reward.'
              : 'Stake tEXO LPs (Quickswap) for tEXO reward.'}
            <br />
            {currentBlock && currentBlock < farmStartBlock
              ? 'Farming reward will be generated in'
              : null}
          </Typography>
          {currentBlock && currentBlock < farmStartBlock ? (
            <Typography variant="h3" color="primary" align="center">
              {poolPageReady ? countDownStringFarm : 'Coming Soon'}
            </Typography>
          ) : null}
        </div>

        <div className={styles.lpPoolGrid}>
          {getFarms(chainId).map((farm, index) => {
            let stakingTokenPrice = 0;

            if (allTokenPrices.data) {
              stakingTokenPrice =
                allTokenPrices.data[
                  getAddress(farm.quoteToken.address, chainId).toLowerCase()
                ];
            }

            return (
              <FarmItem
                selectedAccount={account}
                onPoolStateChange={refreshAppGlobalData}
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
          {currentBlock < fAANGFinishBlock && (
            <>
              <Typography
                variant="h5"
                align="center"
                paragraph
                style={{ marginBottom: '10px', lineHeight: '40px' }}
              >
                FAANG pool concludes in
              </Typography>
              <Typography variant="h3" color="primary" align="center">
                {countDownStringToConcludeFAANG}
              </Typography>
              <Typography align="center" variant="h6">
                <a
                  target="_blank"
                  style={{ color: '#007EF3' }}
                  href={blockExplorerToCountDownFAANG}
                >
                  Check explorer for the most accurate countdown
                </a>
                <br />
              </Typography>
            </>
          )}
        </div>

        <div className={styles.lpPoolGrid}>
          {fAANGData.map((pool) => (
            <FaangItem
              key={pool.id}
              pool={pool}
              tEXOPrice={tEXOPrice}
              account={account}
              FAANGFinish={currentBlock >= FAANGFinishBlock}
            />
          ))}
        </div>

        {currentBlock >= seedingFinishBlock && (
          <div className={styles.countdownContainer}>
            <Typography variant="h5" color="primary">
              Seed phase already completed. Deposit paused. Users may withdraw
              their deposits and harvest tEXO for farming.
            </Typography>
          </div>
        )}

        {currentBlock < seedingFinishBlock && (
          <div className={styles.countdownContainer}>
            <Typography
              variant="h5"
              align="center"
              paragraph
              style={{ marginBottom: '10px', lineHeight: '40px' }}
            >
              {chainId === 56 || chainId === 97
                ? 'Equitable Distribution of tEXO in seed pools. Stake BEP-20 tokens for tEXO.'
                : 'Equitable Distribution of tEXO in seed pools. Stake ERC-20 tokens for tEXO.'}
              <br />
              (4% Deposit Fee applies for tEXO liquidity)
              <br />
              {currentBlock < canClaimRewardsBlock &&
                'Users can harvest tEXO in'}
              {currentBlock >= canClaimRewardsBlock &&
              currentBlock < seedingFinishBlock ? (
                <>
                  <span>
                    Users may now harvest tEXO and provide liquidity for LP
                    farming
                  </span>
                  <br />
                  <span>tEXO rewards in seed pool will stop in</span>
                </>
              ) : null}
            </Typography>

            {currentBlock < canClaimRewardsBlock && (
              <Typography variant="h3" color="primary" align="center">
                {countDownString}
              </Typography>
            )}

            {currentBlock >= canClaimRewardsBlock &&
              currentBlock < seedingFinishBlock && (
                <Typography variant="h3" color="primary" align="center">
                  {countDownStringFarm}
                </Typography>
              )}

            {currentBlock < seedingFinishBlock && (
              <>
                <Typography align="center" variant="h6">
                  <a
                    target="_blank"
                    style={{ color: '#007EF3' }}
                    href={blockExplorerToCountDownSeeding}
                  >
                    Check explorer for the most accurate countdown
                  </a>
                  <br />
                </Typography>
                <br />
              </>
            )}
            <br />
            <Typography
              variant="h5"
              align="center"
              paragraph
              style={{ marginBottom: '10px', lineHeight: '40px' }}
            >
              Click{' '}
              <a
                target="_blank"
                style={{ color: '#007EF3' }}
                href="https://texo.gitbook.io/exoniumdex/launch"
              >
                here
              </a>{' '}
              for more information about tEXO seed pools. Always verify{' '}
              <a
                style={{ color: '#007EF3' }}
                target="_blank"
                href="https://texo.gitbook.io/exoniumdex/smart-contracts-and-audits/smart-contracts"
              >
                contracts
              </a>{' '}
              before depositing. Click{' '}
              <a
                style={{ color: '#007EF3' }}
                target="_blank"
                href="https://texo.gitbook.io/exoniumdex/smart-contracts-and-audits/audits"
              >
                here
              </a>{' '}
              for audit reports.
            </Typography>
          </div>
        )}

        <TableContainer className={classes.tableContainer && styles.lpPoolGrid}>
          <Table aria-label="collapsible table">
            <TableBody>
              {poolsData.map((pool) => {
                let stakingTokenPrice = 0;

                if (allTokenPrices.data) {
                  stakingTokenPrice =
                    allTokenPrices.data[
                      getAddress(
                        pool.stakingToken.address,
                        chainId,
                      )?.toLowerCase()
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
                    seedingFinish={
                      currentBlock && currentBlock > seedingFinishBlock
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
