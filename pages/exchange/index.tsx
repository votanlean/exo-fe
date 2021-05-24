import { useState } from 'react';
import Head from 'next/head';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardContent,
  Button,
  Typography,
  Box,
  CardHeader,
  IconButton,
  Avatar,
} from '@material-ui/core';
import { Tune, History, ExpandMore } from '@material-ui/icons';

import SelectTokenDialog from '../../components/Exchange/SelectTokenDialog';
import HistoryDialog from '../../components/Exchange/HistoryDialog';
import SettingsDialog from '../../components/Exchange/SettingsDialog';
import { poolToken } from '../../blockchain/tokenFactory';

const useStyles = makeStyles({
  root: {
    borderRadius: 20,
    maxWidth: 436,
    width: '100%',
    margin: '0 auto',
  },
  header: {
    borderBottom: '1px solid rgb(233 234 235)',
  },
  box: {
    padding: 16,
    borderRadius: 12,
  },
  iconDown: {
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
    backgroundColor: 'rgb(239, 244, 245)',
    borderRadius: 16,
    padding: 0,
    minWidth: 32,
  },
  iconAva: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
});

function Pool() {
  const classes = useStyles();
  const [isOpenTokenDialog, setOpenTokenDialog] = useState(false);
  const [isOpenHistoryDialog, setOpenHistoryDialog] = useState(false);
  const [isOpenSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [fromValue, setFromValue] = useState(poolToken[0]);
  const [toValue, setToValue] = useState(poolToken[1]);
  const [fromTo, setFromTo] = useState('');

  const toggleTokenDialog = (value) => {
    setOpenTokenDialog(true);
    setFromTo(value);
  };

  const onCloseTokenDialog = () => {
    setOpenTokenDialog(false);
  };

  const toggleHistoryDialog = () => {
    setOpenHistoryDialog(!isOpenHistoryDialog);
  };

  const handleConfirmTokenModal = (value) => {
    fromTo === 'from' ? setFromValue(value) : setToValue(value);
    onCloseTokenDialog();
  };

  const toggleSettingsDialog = () => {
    setOpenSettingsDialog(!isOpenSettingsDialog);
  };

  const handleSwapToken = () => {
    setFromValue(toValue);
    setToValue(fromValue);
  };

  return (
    <>
      <Head>
        <title>Exchange</title>
      </Head>

      <div className="container pool-container">
        <div className="exchange-grid">
          <Card className={classes.root}>
            <CardHeader
              className={classes.header}
              title="Exchange"
              subheader="Trade tokens in an instant"
              action={
                <Box display="flex" alignItems="center">
                  <IconButton onClick={toggleSettingsDialog}>
                    <Tune color="primary" />
                  </IconButton>
                  <IconButton onClick={toggleHistoryDialog}>
                    <History color="primary" />
                  </IconButton>
                </Box>
              }
            />
            <CardContent>
              <Box display="grid" gridAutoRows="auto" gridRowGap={20}>
                <Box className={classes.box} bgcolor="#B8DDFF">
                  <Typography variant="subtitle2">From</Typography>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    marginTop={1.5}
                  >
                    <Typography variant="body1">0.0</Typography>
                    <Button onClick={() => toggleTokenDialog('from')}>
                      <Avatar
                        className={classes.iconAva}
                        src={fromValue.icon}
                      />
                      <Typography variant="subtitle2">
                        {fromValue.symbol}
                      </Typography>
                      <ExpandMore color="primary" />
                    </Button>
                  </Box>
                </Box>

                <Box>
                  <Button
                    className={classes.iconDown}
                    onClick={handleSwapToken}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      color="#007EF3"
                      width="24px"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M11 5V16.17L6.11997 11.29C5.72997 10.9 5.08997 10.9 4.69997 11.29C4.30997 11.68 4.30997 12.31 4.69997 12.7L11.29 19.29C11.68 19.68 12.31 19.68 12.7 19.29L19.29 12.7C19.68 12.31 19.68 11.68 19.29 11.29C18.9 10.9 18.27 10.9 17.88 11.29L13 16.17V5C13 4.45 12.55 4 12 4C11.45 4 11 4.45 11 5Z"></path>
                    </svg>
                  </Button>
                </Box>

                <Box className={classes.box} bgcolor="#B8DDFF">
                  <Typography variant="subtitle2">To</Typography>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    marginTop={1.5}
                  >
                    <Typography variant="body1">0.0</Typography>
                    <Button onClick={() => toggleTokenDialog('to')}>
                      <Avatar className={classes.iconAva} src={toValue.icon} />
                      <Typography variant="subtitle2">
                        {toValue.symbol}
                      </Typography>
                      <ExpandMore color="primary" />
                    </Button>
                  </Box>
                </Box>
                <Box>
                  <button className="button btn-secondary">
                    <span>Unlock Wallet</span>
                  </button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </div>
      </div>

      <SelectTokenDialog
        open={isOpenTokenDialog}
        title="Select a token"
        onClose={onCloseTokenDialog}
        onConfirm={handleConfirmTokenModal}
        fromTo={fromTo}
      />
      <HistoryDialog open={isOpenHistoryDialog} onClose={toggleHistoryDialog} />
      <SettingsDialog
        open={isOpenSettingsDialog}
        onClose={toggleSettingsDialog}
      />
    </>
  );
}

export default Pool;
