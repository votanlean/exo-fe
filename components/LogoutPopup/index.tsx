import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, TableCell, TableRow, Typography } from '@material-ui/core';
import { Close, ExitToApp } from '@material-ui/icons';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import { useWeb3React } from '@web3-react/core';
import useWeb3 from 'hooks/useWeb3';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useNetwork } from 'state/hooks';
import { walletsConfig } from '../../config/constants/walletData';
import useAuth from '../../hooks/useAuth';
import { getErrorMessage } from '../../utils/web3React';
import { useStyles } from './styles';
LogoutPopup.propTypes = {
  onOpen: PropTypes.bool,
  onCloseDialog: PropTypes.func,
};

function LogoutPopup(props: any) {
  const classes: any = useStyles();
  const { onOpen, onCloseDialog } = props;
  const { logout } = useAuth();
  const [icon, setIcon] = useState('');
  const [copy, setCopy] = useState('Copy Address');
  const [wallet, setWallet] = useState('');
  const [balance, setBalance] = React.useState(0);

  const { error, deactivate, account, active, connector, library } = useWeb3React();

  const onClickLogout = () => {
    logout();
    onCloseDialog();
  };
  const network = useNetwork();
  const { name: networkName, symbol } = network || {};
  // const coinBalance = useCoinBalanceSelector();

  const web3 = useWeb3();

  useEffect( () => {
    if(active){
      const bal = web3.eth.getBalance(account).then( (balance) => {
        setBalance(parseInt(balance)*0.000000000000000001);
      }
      );
    }
  },[account, active, library]);
  //If have error
  useEffect(() => {
    if (error) {
      alert(getErrorMessage(error));
    }
  }, [error]);
  useEffect(() => {
    if(typeof library?.isMetaMask !== "undefined"){
      setWallet(walletsConfig[1].label);
      setIcon(walletsConfig[1].icon);
    }else if(typeof library?.bnbSign !== "undefined"){
      setWallet(walletsConfig[2].label);
      setIcon(walletsConfig[2].icon);
    } else if(typeof library?.isMetaMask === "undefined" && typeof library?.bnbSign === "undefined"){
      setWallet(walletsConfig[0].label);
      setIcon(walletsConfig[0].icon);
    }
  },[account]);
    
  return (
    <Dialog
      onClose={onCloseDialog}
      open={onOpen}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle className={classes.title}>
        <Typography variant="caption" className={classes.dialogTitleText}>
          Account
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
        <TableRow className={classes.firstRow}>
            <TableCell style={{ padding: '24px 16px' }} component="th" scope="row">
              <Box display="flex" alignItems="center">
                <img src='/static/images/Account_icon.png' alt='metamask-logo' style={{ color: '#fff',borderRadius: '70px',width: '100px',}}/>
              </Box>
            </TableCell>
            <TableCell align="left" className={classes.acountInfo}>
              <Typography variant="caption">
                Balance
              </Typography >
              <Typography variant="h6" className={classes.label}>
                {balance.toFixed(4)} {symbol}
              </Typography>
            </TableCell>
            
            <TableCell align="left" className={classes.acountInfo}>
              <Typography variant="caption">
                Network
              </Typography >
              <Typography variant="h6" className={classes.label}>
                {networkName}
              </Typography>
            </TableCell>

            <TableCell align="left" className={classes.acountInfo}>
              <Typography variant="caption">
                Wallet
              </Typography >
              <Typography variant="h6" className={classes.label}>
                {wallet}
              </Typography>
            </TableCell>
          </TableRow>
          <Box display="flex" alignItems="center" className={classes.accountAddress}>
            <img src={icon} alt='logo' style={{width: '24px', marginRight: '5px', borderRadius: '20px'}}/>
            {account}
          </Box>
        <Box display="flex" alignItems="center" style={{marginTop: '20px'}}>
        <CopyToClipboard text={account}>
          <Button className={classes.button} onClick={()=>{setCopy('copied')}}>
            <Typography variant="caption" className={classes.titleButton}>
              {copy}
            </Typography>
            <FileCopyIcon />
          </Button>
          </CopyToClipboard >
          <Button className={classes.button} onClick={onClickLogout}>
            <Typography variant="caption" className={classes.titleButton}>
              Log out
            </Typography>
            <ExitToApp />
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default LogoutPopup;
