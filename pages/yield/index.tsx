import React, { useEffect, useState, ChangeEvent, useCallback } from 'react';
import Head from 'next/head';
import { Typography, TableContainer, Table, TableBody, makeStyles } from '@material-ui/core';
import { useDebounceCallback } from '@react-hook/debounce'
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';

import classes from './yield.module.scss';
import YieldFarm from 'components/YieldFarm';
import { useAppPrices, useAppPricesLoading } from 'state/prices/selectors';
import { getAddress } from 'utils/addressHelpers';
import { useNetwork } from 'state/hooks';
import { useTexoTokenPrice, useTexoTokenLoading } from 'state/texo/selectors';
import { useYieldFarmsData, useYieldFarmsLoading } from 'state/yield/selector';
import { useOrchestratorData, useOrchestratorLoading } from 'state/orchestrator/selectors';
import { useFarmsLoading } from 'state/farms/selectors';

import { fetchYieldFarmPublicData, fetchYieldUserData } from 'state/yield/reducer';
import { fetchTexoTokenDataThunk } from 'state/texo/reducer';
import { fetchOrchestratorDataThunk } from 'state/orchestrator/reducer';
import { fetchAppPrices } from 'state/prices/reducer';
import { fetchFarmsPublicDataAsync } from 'state/farms/reducer';

const useStyles = makeStyles((theme) => {
  return {
    tableContainer: {
      filter: "drop-shadow(rgba(25, 19, 38, 0.15) 0px 1px 4px)",
      width: "100%",
      borderRadius: "16px",
      background: theme.palette.themeBg.default,
    },
  };
});

export default function Yield() {
  const [searchText, setSearchText] = useState<undefined | null | string>();

  const appPriceLoading = useAppPricesLoading();
  const texoTokenLoading = useTexoTokenLoading();
  const yieldFarmLoading = useYieldFarmsLoading();
  const orchestratorLoading = useOrchestratorLoading();
  const farmLoading = useFarmsLoading();
  const tableStyle = useStyles();

  const isDataLoading =
    appPriceLoading || texoTokenLoading || yieldFarmLoading || orchestratorLoading || farmLoading;

  const { account } = useWeb3React();
  const network = useNetwork();
  const { id: chainId } = network;

  const yieldFarms = useYieldFarmsData();
  const allTokenPrices = useAppPrices();
  const tEXOPrice = useTexoTokenPrice();
  const { tEXOPerBlock, totalAllocPoint } = useOrchestratorData();
  const dispatch = useDispatch();

  const refreshAppGlobalData = useCallback(() => {
    dispatch(fetchYieldFarmPublicData(chainId));
    dispatch(fetchTexoTokenDataThunk(chainId));
    dispatch(fetchOrchestratorDataThunk(chainId, network));
    dispatch(fetchAppPrices(chainId));
    dispatch(fetchFarmsPublicDataAsync(chainId));

    if (account) {
      dispatch(fetchYieldUserData(account, chainId));
    }
  }, [account, chainId]);

  const debounceFunc = useDebounceCallback<[ChangeEvent<HTMLInputElement>]>((e) => {
    setSearchText(e.target.value);
  }, 500);

  useEffect(() => {
    refreshAppGlobalData();

    const updateUserData = setInterval(() => {
      refreshAppGlobalData();
    }, 60000);

    return () => {
      clearInterval(updateUserData);
    };
  }, [account, chainId]);

  const onApprove = useCallback(() => {
    dispatch(fetchYieldUserData(account, chainId));
  }, [dispatch, account, chainId]);

  const onAction = useCallback(() => {
    dispatch(fetchYieldFarmPublicData(chainId));
    if (account) {
      dispatch(fetchYieldUserData(account, chainId));
    }
  }, [dispatch, account, chainId]);

  return (
    <>
      <Head>
        <title>Yield Farming</title>
      </Head>
      <div className={`container ${classes.yieldContainer}`}>
        <Typography variant="h4" className="font-bold">
          EXO-Compound
        </Typography>

        <TableContainer className={tableStyle.tableContainer}>
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
                    onPoolStateChange={refreshAppGlobalData}
                    stakingTokenPrice={stakingTokenPrice}
                    tEXOPrice={tEXOPrice}
                    tEXOPerBlock={tEXOPerBlock}
                    onApprove={onApprove}
                    onAction={onAction}
                    allTokenPrices={allTokenPrices.data || []}
                    totalAllocPoint={totalAllocPoint}
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
