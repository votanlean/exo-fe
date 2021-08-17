import React, { useEffect, useState, ChangeEvent, useCallback } from 'react';
import Head from 'next/head';
import { TextField, Typography, Switch, TableContainer, Table, TableBody } from '@material-ui/core';
import { useDebounceCallback } from '@react-hook/debounce'
import { useWeb3React } from '@web3-react/core';
import { useDispatch } from 'react-redux';

import classes from './yield.module.scss';
import YieldFarm from 'components/YieldFarm';
import { useAppPrices } from 'state/prices/selectors';
import { getAddress } from 'utils/addressHelpers';
import { useNetwork } from 'state/hooks';
import { useTexoTokenPrice } from 'state/texo/selectors';
import { useYieldFarms } from 'state/yield/selector';

import { fetchYieldFarmPublicData, fetchYieldUserData } from 'state/yield/reducer';

export default function Yield() {
  const [searchText, setSearchText] = useState<undefined | null | string>();

  const { account } = useWeb3React();
  const { id: chainId } = useNetwork();
  const yieldFarms = useYieldFarms();
  const allTokenPrices = useAppPrices();
  const tEXOPrice = useTexoTokenPrice();
  const dispatch = useDispatch();

  const refreshAppGlobalData = useCallback(() => {
    dispatch(fetchYieldFarmPublicData(chainId));

    if (account) {
      dispatch(fetchYieldUserData(account, chainId));
    }
  }, [account, chainId]);

  const debounceFunc = useDebounceCallback<[ChangeEvent<HTMLInputElement>]>((e) => {
    setSearchText(e.target.value)
  }, 500);

  useEffect(() => {
    refreshAppGlobalData()
  }, [account, chainId]);

  return (
    <>
      <Head>
        <title>Yield Farming</title>
      </Head>
      <div className={`container ${classes.yieldContainer}`}>
        <Typography variant='h4' className='font-bold'>
          VAULT LIST
        </Typography>
        <div className={classes.header}>
          <div>
            Deposited only <Switch />
          </div>
          <TextField
            placeholder='Search vault'
            variant='outlined'
            onChange={debounceFunc}
          />
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
                    key={yieldFarm.pid}
                    yieldFarmData={yieldFarm}
                    selectedAccount={account}
                    onPoolStateChange={refreshAppGlobalData}
                    stakingTokenPrice={stakingTokenPrice}
                    tEXOPrice={tEXOPrice}
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
