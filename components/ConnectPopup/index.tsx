import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Box,
} from '@material-ui/core';
import { Close } from '@material-ui/icons';

import { useAppDispatch } from 'state';
import { useNetwork } from 'state/hooks';
import { changeNetwork } from 'state/network';
import {
  connectorLocalStorageKey,
  ConnectorNames,
} from '../../utils/web3React';
import { networks, walletsConfig } from 'config/constants/walletData';
import NetworkItem from './NetworkItem';
import WalletItem from './WalletItem';

import { useStyles } from './styles';
import useAuth from '../../hooks/useAuth';

ConnectPopup.propTypes = {
  onOpen: PropTypes.bool,
  onCloseDialog: PropTypes.func,
};

function getSteps() {
  return ['Choose Network', 'Choose Wallet'];
}

function ConnectPopup(props: any) {
  const { login } = useAuth();
  const dispatch = useAppDispatch();
  const currentNetwork = useNetwork();

  const classes: any = useStyles();
  const { onOpen, onCloseDialog } = props;
  const [activeStep, setActiveStep] = useState(0);
  const steps = getSteps();

  const wallets = useMemo(() => {
    return walletsConfig.filter((item) =>
      item.network.includes(currentNetwork.type),
    );
  }, [currentNetwork]);

  const handleConnectWallet = async (name: ConnectorNames) => {
    await login(name);
    window.localStorage.setItem(connectorLocalStorageKey, name);
    onCloseDialog();
  };

  const handleNetWorkChange = (item) => {
    dispatch(changeNetwork(item));
  };

  const renderNetwork = () => {
    return (
      <Box display="grid" gridTemplateColumns="1fr 1fr 1fr">
        {networks.map((item, index) => (
          <NetworkItem
            key={index}
            icon={item.icon}
            label={item.name}
            onClick={() => handleNetWorkChange(item)}
            selected={currentNetwork.id === item.id}
          />
        ))}
      </Box>
    );
  };

  const renderWallet = () => (
    <Box display="grid" gridTemplateColumns="1fr 1fr 1fr">
      {wallets.map((item, index) => {
        return (
          <WalletItem
            key={index}
            icon={item.icon}
            label={item.label}
            onClick={() => handleConnectWallet(item.connectorName)}
          />
        );
      })}
    </Box>
  );

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
        <Stepper
          activeStep={activeStep}
          orientation="vertical"
          className={classes.stepperRoot}
        >
          {steps.map((label, index) => (
            <Step key={index} expanded={true}>
              <StepLabel
                classes={{
                  label: classes.stepLabel,
                  active: classes.stepLabel,
                }}
              >
                {label}
              </StepLabel>
              <StepContent>
                {index === 0 && renderNetwork()}
                {index === 1 && renderWallet()}
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </DialogContent>
    </Dialog>
  );
}

export default ConnectPopup;
