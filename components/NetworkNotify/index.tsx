import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Typography } from '@material-ui/core';
import { useWeb3React } from '@web3-react/core';

import { useNetwork } from 'state/hooks';
import { getNetworks } from 'utils/networkHelpers';

declare const window: any;

import { useStyles } from './style';

index.propTypes = {
  clickHandle: PropTypes.func,
};

const networks = getNetworks();

function index(props) {
  const { clickHandle } = props;
  const appNetwork = useNetwork();
  const { library } = useWeb3React();
  const classes = useStyles();

  useEffect(() => {
    if (appNetwork.id !== parseInt(library?.networkVersion) &&
    typeof library?.networkVersion !== 'undefined') {
			// try to request the user to connect to the current app network
			if (window.ethereum) {
				window.ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{
						chainId: `0x${appNetwork.id.toString(16)}`
					}]
				}).catch((switchError) => {
					if (switchError.code === 4902) {
						// wallet dont have the network id, try adding it
						window.ethereum.request({
							method: 'wallet_addEthereumChain',
							params: [{
								chainId: `0x${appNetwork.id.toString(16)}`,
								chainName: appNetwork.name,
								nativeCurrency: {
									name: appNetwork.symbol,
									symbol: appNetwork.symbol,
									decimals: 18,
								  },
								rpcUrls: [appNetwork.rpcUrl],
								blockExplorerUrls: [appNetwork.blockExplorerUrl],
							}]
						}).then(() => {
							window.ethereum.request({
								method: 'wallet_switchEthereumChain',
								params: [{
									chainId: `0x${appNetwork.id.toString(16)}`
								}]
							})
						})
					}

					throw switchError
				}).catch((error) => {
					console.log('RPC Error: ', error)
				})
			}
		}
  }, [appNetwork.id]);

  if (
    appNetwork.id !== parseInt(library?.networkVersion) &&
    typeof library?.networkVersion !== 'undefined'
  ) {
    return (
      <div className={classes.notify}>
        <Typography className={classes.p}>
          App network ({appNetwork.id}) doesn't match to network selected in
          wallet: {library?.networkVersion}. Please change your wallet network
          or
        </Typography>
        <Button className={classes.button} onClick={clickHandle}>
          Change App network
        </Button>
      </div>
    );
  } else {
    return <></>;
  }
}

export default index;

function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}
