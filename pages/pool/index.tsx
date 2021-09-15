import React, { useCallback, useEffect, useState } from "react";
import Head from "next/head";
import { useWeb3React } from "@web3-react/core";
import dayjs from "dayjs";
import {
  Box,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableContainer,
  Typography,
} from "@material-ui/core";
import BigNumber from "bignumber.js";

import ApolloClient from "components/ApolloClient";
import Statistic from "components/Statistic";
import PoolRow from "components/PoolRow";
import YieldFarm from "components/YieldFarm";

import styles from "./pool.module.scss";
import { useBlockData, useBlockDataLoading } from "state/block/selectors";
import { useTexoTokenData, useTexoTokenLoading, useTexoTokenPrice } from "state/texo/selectors";
import { useAppDispatch } from "state";
import {
  fetchFarmsPublicDataAsync,
  fetchFarmUserDataAsync,
  replaceFarmWithoutUserDataAsync,
} from "state/farms/reducer";
import { getAddress } from "utils/addressHelpers";
import { fetchTexoTokenDataThunk } from "state/texo/reducer";
import { fetchOrchestratorDataThunk } from "state/orchestrator/reducer";
import { useOrchestratorData, useOrchestratorLoading } from "state/orchestrator/selectors";
import { fetchBlockDataThunk } from "state/block/reducer";
import { usePools } from "state/pools/selectors";
import { fetchAppPrices } from "state/prices/reducer";
import { useAppPrices, useAppPricesLoading } from "state/prices/selectors";
import { useFarms, useFarmsLoading, useTotalValue } from "state/farms/selectors";
import FarmItem from "components/FarmItem";
import { fetchUserInfoDataThunk } from "state/userInfo/reducer";
import { useUserInfoData } from "state/userInfo/selectors";
import FaangItem from "components/FaangItem";
import { useFAANGPools } from "state/fAANGpools/selectors";
import {
  fetchFAANGPoolsPublicDataAsync,
  fetchFAANGPoolsUserDataAsync,
  replaceFAANGPoolsWithoutUserData,
} from "state/fAANGpools/reducer";
import {
  fetchPoolsPublicDataAsync,
  fetchPoolsUserDataAsync,
  replacePoolWithoutUserDataAsync,
} from "state/pools/reducer";
import { useNetwork } from "state/hooks";
import { getFarms } from "utils/farmsHelpers";
import { useFAANGOrchestratorData } from "state/FAANGOrchestrator/selectors";
import { fetchFAANGOrchestratorDataThunk } from "state/FAANGOrchestrator/reducer";
import { useAllChainTotalValue } from "state/tlv/selectors";
import { fetchTLV } from "state/tlv/reducer";
import BannerCoinTelegraph from "components/BannerCoinTelegraph";
import useCountdownString from "hooks/useCountdownString";
import { useYieldFarmsData, useYieldFarmsLoading } from "state/yield/selector";
import { fetchYieldFarmPublicData, fetchYieldUserData } from "state/yield/reducer";

const useStyles = makeStyles((theme) => {
  return {
    tableContainer: {
      filter: "drop-shadow(rgba(25, 19, 38, 0.15) 0px 1px 4px)",
      width: "100%",
      borderRadius: "16px",
      background: theme.palette.themeBg.default,
    },
    comingSoonLogo: {
      [theme.breakpoints.down("sm")]: {
        width: "80px",
      },
    },
    comingSoonText: {
      [theme.breakpoints.down("sm")]: {
        fontSize: "2rem",
      },
    },
  };
});

function getClaimRewardsDate(currentBlock, canClaimRewardsBlock, startDate, secondPerBlock) {
  if (!currentBlock || !canClaimRewardsBlock) {
    return dayjs();
  }

  const blockDiff = canClaimRewardsBlock - currentBlock;
  if (blockDiff <= 0) {
    return dayjs();
  }

  const secondsDiff = Math.ceil(blockDiff * secondPerBlock);
  const claimRewardDate = startDate.add(secondsDiff, "seconds");
  return claimRewardDate;
}

function Pool() {
  const poolPageReady =
    // @ts-ignore
    process.env.POOL_PAGE_READY == true || process.env.POOL_PAGE_READY == "true";
  const classes: any = useStyles();
  const dispatch = useAppDispatch();
  const { account } = useWeb3React();
  const [fAANGFinishBlock, setFAANGFinishBlock] = useState(null);
  const [yieldFarmStartBlock, setYieldFarmStartBlock] = useState(null);
  const allTokenPrices = useAppPrices();
  const tEXOPrice = useTexoTokenPrice();
  const poolsData = usePools();
  const { id: chainId, blockExplorerUrl } = useNetwork();
  const fAANGData = useFAANGPools();
  const farmsData = useFarms();
  const tvl = useTotalValue();
  const totalTvl = useAllChainTotalValue();
  const yieldFarms = useYieldFarmsData();

  const { currentBlock } = useBlockData();
  const isCurrentBlockLoading = useBlockDataLoading();

  const { totalSupply: tEXOTotalSupply, tEXOBurned: burnAmount } = useTexoTokenData();
  const {
    tEXOPerBlock,
    canClaimRewardsBlock,
    seedingStartBlock,
    seedingFinishBlock,
    farmStartBlock,
    totalAllocPoint,
  } = useOrchestratorData();

  const isOrchestratorLoading = useOrchestratorLoading();
  const appPriceLoading = useAppPricesLoading();
  const texoTokenLoading = useTexoTokenLoading();
  const yieldFarmLoading = useYieldFarmsLoading();
  const farmLoading = useFarmsLoading();

  const isDataLoading =
    appPriceLoading || texoTokenLoading || yieldFarmLoading || isOrchestratorLoading || farmLoading;

  const countDownStringFarm = useCountdownString(farmStartBlock, isOrchestratorLoading);
  const countDownString = useCountdownString(canClaimRewardsBlock, isOrchestratorLoading);
  const countDownStringToConcludeFAANG = useCountdownString(fAANGFinishBlock);
  const countDownStringStartYieldFarm = useCountdownString(yieldFarmStartBlock);

  const { tEXOReward } = useUserInfoData();
  const network = useNetwork();

  let blockExplorerToCountDownSeeding;

  if (currentBlock < seedingStartBlock) {
    blockExplorerToCountDownSeeding = blockExplorerUrl + "/block/countdown/" + seedingStartBlock;
  } else if (currentBlock < canClaimRewardsBlock) {
    blockExplorerToCountDownSeeding = blockExplorerUrl + "/block/countdown/" + canClaimRewardsBlock;
  } else {
    blockExplorerToCountDownSeeding = blockExplorerUrl + "/block/countdown/" + seedingFinishBlock;
  }

  const blockExplorerToCountDownFAANG = blockExplorerUrl + "/block/countdown/" + fAANGFinishBlock;

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
    dispatch(fetchYieldFarmPublicData(chainId));

    if (account) {
      dispatch(fetchFarmUserDataAsync(account, chainId));
      dispatch(fetchPoolsUserDataAsync(account, chainId));
      dispatch(fetchFAANGPoolsUserDataAsync(account, chainId));
      dispatch(fetchUserInfoDataThunk(account, chainId));
      dispatch(fetchYieldUserData(account, chainId));
    }
  };

  useEffect(refreshAppGlobalData, [account, dispatch, chainId]);

  useEffect(() => {
    if (chainId === 56) {
      setFAANGFinishBlock(10611291);
      setYieldFarmStartBlock(10938700);
    }

    if (chainId === 137) {
      setFAANGFinishBlock(18829657);
      setYieldFarmStartBlock(null);
    }
  }, [chainId]);

  useEffect(() => {
    const updateAppDataInterval = setInterval(() => {
      dispatch(fetchFarmsPublicDataAsync(chainId));
      dispatch(fetchTexoTokenDataThunk(chainId));
      dispatch(fetchPoolsPublicDataAsync(chainId));
      dispatch(fetchFAANGPoolsPublicDataAsync(chainId));
      dispatch(fetchYieldFarmPublicData(chainId));
    }, 60 * 1000);

    return () => {
      clearInterval(updateAppDataInterval);
    };
  }, [chainId, account]);

  const onApprove = useCallback(() => {
    dispatch(fetchPoolsUserDataAsync(account, chainId));
    dispatch(fetchFarmUserDataAsync(account, chainId));
    dispatch(fetchFAANGPoolsUserDataAsync(account, chainId));
    dispatch(fetchYieldUserData(account, chainId));
  }, [dispatch, account, chainId]);

  const onYieldApprove = useCallback(() => {
    dispatch(fetchYieldUserData(account, chainId));
  }, [dispatch, account, chainId]);

  const onYieldAction = useCallback(() => {
    dispatch(fetchYieldFarmPublicData(chainId));
    if (account) {
      dispatch(fetchYieldUserData(account, chainId));
    }
  }, [dispatch, account, chainId]);

  return (
    <Paper className="paper-root">
      <Head>
        <title>Pools | tExo</title>
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
            style={{ marginBottom: "30px", lineHeight: "40px" }}
          >
            {chainId === 56 || chainId === 97 || chainId === 5600
              ? "Stake tEXO LPs (PCS V2) for tEXO reward."
              : "Stake tEXO LPs (Quickswap) for tEXO reward."}
            <br />
            {currentBlock &&
            currentBlock < farmStartBlock &&
            !isCurrentBlockLoading &&
            !isOrchestratorLoading
              ? "Farming reward will be generated in"
              : null}
          </Typography>
          {currentBlock &&
          currentBlock < farmStartBlock &&
          !isCurrentBlockLoading &&
          !isOrchestratorLoading ? (
            <Typography variant="h3" color="primary" align="center">
              {poolPageReady ? countDownStringFarm : "Coming Soon"}
            </Typography>
          ) : null}
        </div>

        <div className={styles.lpPoolGrid}>
          {getFarms(chainId).map((farm, index) => {
            let stakingTokenPrice = 0;

            if (allTokenPrices.data) {
              stakingTokenPrice =
                allTokenPrices.data[getAddress(farm.quoteToken.address, chainId).toLowerCase()];
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
                onApprove={onApprove}
              />
            );
          })}
        </div>
        <div className={styles.lpPoolGrid}>
          {!yieldFarmStartBlock && (
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="center"
              textAlign="center"
              marginTop="4rem"
            >
              <img
                className={classes.comingSoonLogo}
                src="/static/images/icon-white.svg"
                alt="logo title"
              />
              <Box>
                <Typography className={classes.comingSoonText} variant="h1">
                  Exo-Compound
                </Typography>
                <Typography className={classes.comingSoonText} variant="h2">
                  is coming soon
                </Typography>
              </Box>
            </Box>
          )}
          {currentBlock &&
          currentBlock < (yieldFarmStartBlock || 0) &&
          !isCurrentBlockLoading &&
          !isOrchestratorLoading ? (
            <>
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                textAlign="center"
                marginTop="7rem"
              >
                <img
                  className={classes.comingSoonLogo}
                  src="/static/images/icon-white.svg"
                  alt="logo title"
                />
                <Box>
                  <Typography className={classes.comingSoonText} variant="h1">
                    Exo-Compound
                  </Typography>
                  <Typography className={classes.comingSoonText} variant="h2">
                    is coming soon
                  </Typography>
                </Box>
              </Box>
              <div className={styles.countdownContainer}>
                <Typography variant="h3" color="primary" align="center">
                  {countDownStringStartYieldFarm || "Coming Soon"}
                </Typography>
              </div>
            </>
          ) : null}
          {Boolean(currentBlock && yieldFarmStartBlock && currentBlock >= yieldFarmStartBlock) && (
            <>
              <div className={styles.countdownContainer}>
                <Typography variant="h5" align="center" style={{ lineHeight: "40px" }}>
                  Deposit LPs (PCS V2) for Auto-compounding and tEXO reward.
                </Typography>
              </div>
              <TableContainer className={classes.tableContainer}>
                <Table aria-label="collapsible table">
                  <TableBody>
                    {yieldFarms.map((yieldFarm) => {
                      let stakingTokenPrice = 0;

                      if (allTokenPrices.data) {
                        stakingTokenPrice =
                          allTokenPrices.data[
                            getAddress(yieldFarm.underlying.address, chainId)?.toLowerCase()
                          ];
                      }
                      return (
                        <YieldFarm
                          isLoading={isDataLoading}
                          key={yieldFarm.pid}
                          yieldFarmData={yieldFarm}
                          selectedAccount={account}
                          onPoolStateChange={refreshAppGlobalData} // checking
                          stakingTokenPrice={stakingTokenPrice}
                          tEXOPrice={tEXOPrice}
                          tEXOPerBlock={tEXOPerBlock}
                          onApprove={onYieldApprove}
                          onAction={onYieldAction}
                          allTokenPrices={allTokenPrices.data || []}
                          totalAllocPoint={totalAllocPoint}
                        />
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </div>
        <div className={styles.titleSection}>
          <Typography variant="h5" align="center" style={{ lineHeight: "40px" }}>
            FAANG distribution phase has concluded
          </Typography>
          {currentBlock < fAANGFinishBlock && (
            <>
              <Typography
                variant="h5"
                align="center"
                paragraph
                style={{ marginBottom: "10px", lineHeight: "40px" }}
              >
                FAANG pool concludes in
              </Typography>
              {!isCurrentBlockLoading && (
                <Typography variant="h3" color="primary" align="center">
                  {countDownStringToConcludeFAANG}
                </Typography>
              )}
              <Typography align="center" variant="h6">
                <a
                  target="_blank"
                  style={{ color: "#007EF3" }}
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
              FAANGFinish={currentBlock >= fAANGFinishBlock}
              onApprove={onApprove}
            />
          ))}
        </div>

        {currentBlock >= seedingFinishBlock && (
          <div className={styles.countdownContainer}>
            <Typography variant="h5" color="primary" align="center">
              Seed phase already completed. Deposit paused. Users may withdraw their deposits and
              harvest tEXO for farming.
            </Typography>
          </div>
        )}

        {currentBlock < seedingFinishBlock && (
          <div className={styles.countdownContainer}>
            <Typography
              variant="h5"
              align="center"
              paragraph
              style={{ marginBottom: "10px", lineHeight: "40px" }}
            >
              {chainId === 56 || chainId === 97 || chainId === 5600
                ? "Equitable Distribution of tEXO in seed pools. Stake BEP-20 tokens for tEXO."
                : "Equitable Distribution of tEXO in seed pools. Stake ERC-20 tokens for tEXO."}
              <br />
              (4% Deposit Fee applies for tEXO liquidity)
              <br />
              {currentBlock < canClaimRewardsBlock && "Users can harvest tEXO in"}
              {currentBlock >= canClaimRewardsBlock && currentBlock < seedingFinishBlock ? (
                <>
                  <span>Users may now harvest tEXO and provide liquidity for LP farming</span>
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
              currentBlock < seedingFinishBlock &&
              !isCurrentBlockLoading &&
              !isOrchestratorLoading && (
                <Typography variant="h3" color="primary" align="center">
                  {countDownStringFarm}
                </Typography>
              )}

            {currentBlock < seedingFinishBlock && (
              <>
                <Typography align="center" variant="h6">
                  <a
                    target="_blank"
                    style={{ color: "#007EF3" }}
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
              style={{ marginBottom: "10px", lineHeight: "40px" }}
            >
              Click{" "}
              <a
                target="_blank"
                style={{ color: "#007EF3" }}
                href="https://texo.gitbook.io/exoniumdex/launch"
              >
                here
              </a>{" "}
              for more information about tEXO seed pools. Always verify{" "}
              <a
                style={{ color: "#007EF3" }}
                target="_blank"
                href="https://texo.gitbook.io/exoniumdex/smart-contracts-and-audits/smart-contracts"
              >
                contracts
              </a>{" "}
              before depositing. Click{" "}
              <a
                style={{ color: "#007EF3" }}
                target="_blank"
                href="https://texo.gitbook.io/exoniumdex/smart-contracts-and-audits/audits"
              >
                here
              </a>{" "}
              for audit reports.
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
                      getAddress(pool.stakingToken.address, chainId)?.toLowerCase()
                    ];
                }
                return (
                  <PoolRow
                    key={pool.id}
                    pool={pool}
                    account={account}
                    onPoolStateChange={refreshAppGlobalData}
                    canClaimReward={currentBlock && currentBlock >= canClaimRewardsBlock}
                    seedingFinish={currentBlock && currentBlock > seedingFinishBlock}
                    stakingTokenPrice={stakingTokenPrice}
                    tEXOPrice={tEXOPrice}
                    countDownString={countDownString}
                    onApprove={onApprove}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Paper>
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
