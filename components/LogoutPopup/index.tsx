import React, { useEffect } from 'react';
import Router from 'next/router';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogContent,
  Button,
  Typography,
} from '@material-ui/core';
import { ExitToApp } from '@material-ui/icons';
import { useWeb3React } from '@web3-react/core';

import { getErrorMessage } from '../../utils/web3React';

import { useStyles } from './styles';

LogoutPopup.propTypes = {
  onOpen: PropTypes.bool,
  onCloseDialog: PropTypes.func,
};

function LogoutPopup(props: any) {
  const classes: any = useStyles();
  const {
    onOpen,
    onCloseDialog,
  } = props;

  const { error, deactivate } = useWeb3React();

  const onClickLogout = () => {
    deactivate();
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
      <DialogContent>
        <Button className={classes.button} onClick={onClickLogout}>
          <Typography variant="caption" className={classes.titleButton}>
            Log out
          </Typography>
          <ExitToApp />
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default LogoutPopup;
