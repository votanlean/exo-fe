import React, { useEffect } from 'react';
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
import { useWeb3React } from '@web3-react/core';

import { getErrorMessage } from '../../lib/error';
import { bsc, metamask } from '../../lib/connector';

import { useStyles } from './styles';

ConnectPopup.propTypes = {
  onOpen: PropTypes.bool,
  onCloseDialog: PropTypes.func,
};

function ConnectPopup(props: any) {
  const classes: any = useStyles();
  const {
    onOpen,
    onCloseDialog,
  } = props;

  const { error, activate } = useWeb3React();

  const handleConnectMetamask = async () => {
    await activate(metamask);
    onCloseDialog();
  };

  const handleConnectBinanceChainWallet = async () => {
    await activate(bsc);
    onCloseDialog();
  };

  //If have error
  useEffect(() => {
    if (error) {
      alert(getErrorMessage(error));
    }
  }, [error]);

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
