import React from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  IconButton,
  Avatar,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';

import {
  connectorLocalStorageKey,
  ConnectorNames,
} from '../../utils/web3React';

import { useStyles } from './styles';
import useAuth from '../../hooks/useAuth';

ConnectPopup.propTypes = {
  onOpen: PropTypes.bool,
  onCloseDialog: PropTypes.func,
};

function ConnectPopup(props: any) {
  const { login } = useAuth();

  const classes: any = useStyles();
  const { onOpen, onCloseDialog } = props;

  const handleConnectMetamask = async () => {
    await login(ConnectorNames.Injected);
    window.localStorage.setItem(
      connectorLocalStorageKey,
      ConnectorNames.Injected,
    );
    onCloseDialog();
  };

  const handleConnectWalletConnect = async () => {
    await login(ConnectorNames.WalletConnect);
    window.localStorage.setItem(
      connectorLocalStorageKey,
      ConnectorNames.WalletConnect,
    );
    onCloseDialog();
  };

  const handleConnectBinanceChainWallet = async () => {
    await login(ConnectorNames.BSC);
    window.localStorage.setItem(connectorLocalStorageKey, ConnectorNames.BSC);
    onCloseDialog();
  };

  return (
    <Dialog
      onClose={onCloseDialog}
      open={onOpen}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle className={classes.title}>
        <Typography variant="caption" className={classes.dialogTitleText}>
          Connect to wallet
        </Typography>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onCloseDialog}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Button className={classes.button} onClick={handleConnectWalletConnect}>
          <Typography variant="caption" className={classes.titleButton}>
            Wallet Connect
          </Typography>
          <Avatar
            className={classes.img}
            src="/static/images/walletconnect-logo.png"
            alt="walletconnect-logo"
          />
        </Button>
        <Button className={classes.button} onClick={handleConnectMetamask}>
          <Typography variant="caption" className={classes.titleButton}>
            Metamask
          </Typography>
          <Avatar
            className={classes.img}
            src="/static/images/metamask-logo.jpeg"
            alt="metamask-logo"
          />
        </Button>
        <Button
          className={classes.button}
          onClick={handleConnectBinanceChainWallet}
        >
          <Typography variant="caption" className={classes.titleButton}>
            Binance Chain Wallet
          </Typography>
          <Avatar
            className={classes.img}
            src="/static/images/binance-chain-wallet-logo.jpeg"
            alt="binance-chain-wallet-logo"
          />
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default ConnectPopup;
