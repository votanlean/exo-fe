import { useState } from 'react';
import Head from 'next/head';
import {
  Card,
  CardContent,
  Button,
  Typography,
  Box,
  CardHeader,
  IconButton,
  Avatar,
  Paper,
  Input,
} from '@material-ui/core';
import { Tune, History, ExpandMore } from '@material-ui/icons';
import { useWeb3React } from '@web3-react/core';

import SelectTokenDialog from '../../components/Exchange/SelectTokenDialog';
import HistoryDialog from '../../components/Exchange/HistoryDialog';
import SettingsDialog from '../../components/Exchange/SettingsDialog';
import { usePools } from '../../state/pools/selectors';
import useStyles from './styles';

function Liquidity() {
  const classes = useStyles();
  const { account } = useWeb3React();
  const balanceFrom = 2;
  const balanceTo = 3;

  const [isOpenTokenDialog, setOpenTokenDialog] = useState(false);
  const [isOpenHistoryDialog, setOpenHistoryDialog] = useState(false);
  const [isOpenSettingsDialog, setOpenSettingsDialog] = useState(false);
  const poolToken = usePools();
  const [fromValue, setFromValue] = useState(null);
  console.log('fromValue: ', fromValue);
  const [toValue, setToValue] = useState(null);
  const [fromTo, setFromTo] = useState('');
  const [inputFrom, setInputFrom] = useState('');
  const [inputTo, setInputTo] = useState('');

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

  const onInputFromChange = (event) => {
    setInputFrom(event.target.value);
  };

  const onInputToChange = (event) => {
    setInputTo(event.target.value);
  };

  const onMaxBalanceFromClick = () => {
    setInputFrom(`${balanceFrom}`);
  };

  const onMaxBalanceToClick = () => {
    setInputTo(`${balanceTo}`);
  };

  return (
    <Paper className="paper-root">
      <Head>
        <title>Liquidity | tExo</title>
      </Head>

      <div className="container pool-container">
        <div className="exchange-grid" style={{ paddingTop: 40 }}>
          <Card className={classes.root}>
            <CardHeader
              className={classes.header}
              title="Add Liquidity"
              subheader="Add liquidity to receive LP tokens"
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
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="subtitle2">Input</Typography>
                    {account ? (
                      <Typography variant="subtitle2">
                        Balance: {balanceFrom}
                      </Typography>
                    ) : null}
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    marginTop={1.5}
                  >
                    <Input
                      type="number"
                      placeholder="0.0"
                      disableUnderline
                      value={inputFrom}
                      onChange={onInputFromChange}
                    />
                    <Box display="flex">
                      {balanceFrom > 0 ? (
                        <Button onClick={onMaxBalanceFromClick}>MAX</Button>
                      ) : null}
                      <Button onClick={() => toggleTokenDialog('from')}>
                        {!fromValue ? (
                          <Typography className={classes.selectCurrencyText}>
                            Select a currency
                          </Typography>
                        ) : (
                          <>
                            <Avatar
                              className={classes.iconAva}
                              src={fromValue.icon}
                            />
                            <Typography variant="subtitle2">
                              {fromValue.symbol}
                            </Typography>
                          </>
                        )}
                        <ExpandMore color="primary" />
                      </Button>
                    </Box>
                  </Box>
                </Box>

                <Box>
                  <Typography align="center">+</Typography>
                </Box>

                <Box className={classes.box} bgcolor="#B8DDFF">
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Typography variant="subtitle2">Input</Typography>
                    {account ? (
                      <Typography variant="subtitle2">
                        Balance: {balanceTo}
                      </Typography>
                    ) : null}
                  </Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    marginTop={1.5}
                  >
                    <Input
                      type="number"
                      placeholder="0.0"
                      disableUnderline
                      value={inputTo}
                      onChange={onInputToChange}
                    />
                    <Box display="flex">
                      {balanceTo > 0 ? (
                        <Button onClick={onMaxBalanceToClick}>MAX</Button>
                      ) : null}
                      <Button onClick={() => toggleTokenDialog('to')}>
                        {!toValue ? (
                          <Typography className={classes.selectCurrencyText}>
                            Select a currency
                          </Typography>
                        ) : (
                          <>
                            <Avatar
                              className={classes.iconAva}
                              src={toValue.icon}
                            />
                            <Typography variant="subtitle2">
                              {toValue.symbol}
                            </Typography>
                          </>
                        )}
                        <ExpandMore color="primary" />
                      </Button>
                    </Box>
                  </Box>
                </Box>
                {fromValue && toValue ? (
                  <>
                    <Box className={classes.priceShareBox}>
                      <Typography className={classes.priceShareTitle}>
                        Prices and pool share
                      </Typography>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        padding="1rem"
                        className={classes.priceShareBox}
                      >
                        <Box>
                          <Typography align="center">
                            {inputFrom && inputTo
                              ? parseFloat(inputFrom) + parseFloat(inputTo)
                              : '-'}
                          </Typography>
                          <Typography align="center">
                            {fromValue.symbol} per {toValue.symbol}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography align="center">
                            {inputFrom && inputTo
                              ? parseFloat(inputFrom) + parseFloat(inputTo)
                              : '-'}
                          </Typography>
                          <Typography align="center">
                            {toValue.symbol} per {fromValue.symbol}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography align="center">0%</Typography>
                          <Typography align="center">Share of Pool</Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <button className="button btn-secondary">
                        <span>Approve {fromValue.symbol}</span>
                      </button>
                      <Box marginRight={2} />
                      <button className="button btn-secondary">
                        <span>Approve {toValue.symbol}</span>
                      </button>
                    </Box>
                  </>
                ) : null}
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
    </Paper>
  );
}

export default Liquidity;
