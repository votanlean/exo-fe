import React, { useEffect, useState, ChangeEventHandler } from 'react';
import Head from 'next/head';
import { TextField, Typography, Switch, TableContainer, Table, TableBody } from '@material-ui/core';
import { useDebounceCallback } from '@react-hook/debounce'
import { useWeb3React } from '@web3-react/core';

import classes from './yield.module.scss';
import YieldFarm from 'components/YieldFarm';
import { usePools } from 'state/pools/selectors';
import { useAppPrices } from 'state/prices/selectors';
import { getAddress } from 'utils/addressHelpers';
import { useNetwork } from 'state/hooks';
import { useTexoTokenPrice } from 'state/texo/selectors';

export default function Yield() {
	const [searchText, setSearchText] = useState<undefined | null | string>();

	const { account } = useWeb3React();
	const { id: chainId } = useNetwork();
	const poolsData = usePools();
	const allTokenPrices = useAppPrices();
	const tEXOPrice = useTexoTokenPrice();

	const refreshAppGlobalData = () => {
		console.log('refresh');
	};

	const onSearch: ChangeEventHandler<HTMLInputElement> = (e) => {
		setSearchText(e.target.value)
	}

	const debounceFunc = useDebounceCallback((text) => {
		console.log(text)
	}, 500);

	useEffect(() => {	
		debounceFunc(searchText);
	}, [searchText])

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
						onChange={onSearch}
					/>
				</div>

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
                  <YieldFarm
                    key={pool.id}
                    pool={pool}
                    account={account}
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