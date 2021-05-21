import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
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
import { Close, ExitToApp } from '@material-ui/icons';

import { useStyles } from './styles';

HeaderPopup.propTypes = {
  onOpen: PropTypes.bool,
  onCloseDialog: PropTypes.func,
  dialogTitle: PropTypes.string,
  handleConnectMetamask: PropTypes.func,
  handleConnectBinanceChainWallet: PropTypes.func,
  isLogout: PropTypes.bool,
  handleLogout: PropTypes.func,
};

function HeaderPopup(props: any) {
  const classes: any = useStyles();
  const {
    onOpen,
    onCloseDialog,
    dialogTitle,
    handleConnectMetamask,
    handleConnectBinanceChainWallet,
    isLogout,
    handleLogout,
  } = props;

  return (
    <Dialog
      onClose={onCloseDialog}
      open={onOpen}
      classes={{ paper: classes.paper }}
    >
      {dialogTitle && (
        <DialogTitle className={classes.title}>
          <Typography variant="caption" className={classes.dialogTitleText}>
            {dialogTitle}
          </Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={onCloseDialog}
          >
            <Close />
          </IconButton>
        </DialogTitle>
      )}
      <DialogContent>
        {isLogout ? (
          <Button className={classes.button} onClick={handleLogout}>
            <Typography variant="caption" className={classes.titleButton}>
              Log out
            </Typography>
            <ExitToApp />
          </Button>
        ) : (
          <>
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default HeaderPopup;
