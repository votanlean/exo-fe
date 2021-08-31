import React, { useEffect, useState } from 'react';
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
import ConnectPopup from 'components/ConnectPopup';
import SelectTokenDialog from '../../components/Exchange/SelectTokenDialog';
import HistoryDialog from '../../components/Exchange/HistoryDialog';
import SettingsDialog from '../../components/Exchange/SettingsDialog';
import { usePools } from '../../state/pools/selectors';
import useStyles from './styles';
import { useERC20, useFactoryContract, usePairContract, useRouterContract } from 'hooks/useContract';
import ApproveToken from 'components/ApproveToken';
import SupplyAction from 'components/SupplyAction';
import { useMemo } from 'react';
import BigNumber from 'bignumber.js';
import { BIG_TEN } from 'utils/bigNumber';

function Liquidity() {
  const classes = useStyles();
  const { account } = useWeb3React();
  const [isOpenTokenDialog, setOpenTokenDialog] = useState(false);
  const [isOpenHistoryDialog, setOpenHistoryDialog] = useState(false);
  const [isOpenSettingsDialog, setOpenSettingsDialog] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);
  const poolToken = usePools();
  const [fromValue, setFromValue] = useState(poolToken[1]);
  const [toValue, setToValue] = useState(poolToken[2]);
  const [fromTo, setFromTo] = useState('');
  const [inputFrom, setInputFrom] = useState('');
  const [inputTo, setInputTo] = useState('');
  const [approvedToken1, setApprovedToken1] = useState(false);
  const [approvedToken2, setApprovedToken2] = useState(false);
  const [balance1, setBalance1] = useState(new BigNumber(0));
  const [balance2, setBalance2] = useState(new BigNumber(0));
  const [price, setPrice] = useState(0);
  const [total, setTotal ] = useState(0);

  const routerAddress = '0x96583Bd1e5a792befaDF7C1B22b89bfACfb0e3ED'; //Router
  const token1Address = '0xae13d989dac2f0debff460ac112a837c89baa7cd'; //WBNB
  const token2Address = '0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7'; //BUSD
  const factoryAddress = '0x553BCC4C4b2365e2CA01d13a9b44B82c10154cA8'; //Factory
  const pairAd = '0x5E8E66cE8683a1D72e44B65627f21eFF942a78ED'; // Pair

  const router = useRouterContract(routerAddress);
  const factory = useFactoryContract(factoryAddress);
  const pair = pairAd && usePairContract(pairAd);
  
  
  
  const onApprove = null;
  const token1Contract = useERC20(token1Address);
  const token2Contract = useERC20(token2Address);

  

  const share = useMemo(() => {
    if(inputFrom === ''){
      return 0;
    }
    return parseFloat(inputFrom)*10**18/(parseFloat(inputFrom)*10**18 + total);
  }, [inputFrom, total]);


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
    const value = event.target.value;
    setInputFrom(value);
    setInputTo((value/price).toString());
  };

  const onInputToChange = (event) => {
    const value = event.target.value;
    setInputTo(value);
    setInputFrom((value*price).toString());
  };

  const onMaxBalanceFromClick = () => {
    setInputFrom(`${balance1.div(BIG_TEN.pow(18))}`);
    setInputTo(`${balance1.div(BIG_TEN.pow(18)).div(price)}`);

  };

  const onMaxBalanceToClick = () => {
    setInputTo(`${balance2.div(BIG_TEN.pow(18))}`);
    setInputFrom(`${parseFloat(balance1.div(BIG_TEN.pow(18)).toString())*price}`);

  };

  const handleConnectPopup = () => {
    setOpenPopup(!openPopup);
  };

  

  
  const checkApprove = async () => {
    if(account){
      const approved1 = await token1Contract.methods.allowance(account, routerAddress).call();
      if(approved1 > 0 ){
        setApprovedToken1(true);
      }else{
        setApprovedToken1(false);
      }
      const approved2 = await token2Contract.methods.allowance(account, routerAddress).call();
      if(approved2 > 0 ){
        setApprovedToken2(true);
      }else{
        setApprovedToken2(false);
      }
    }
  }

  const getBalance = async () => {
    if(account){
      const token1Balance = await token1Contract.methods.balanceOf(account).call();
      setBalance1(new BigNumber(token1Balance));
      const token2Balance = await token2Contract.methods.balanceOf(account).call();
      setBalance2(new BigNumber(token2Balance));
    }
  }

  const getPrice = async () => {
    pair.methods.getReserves().call()
        .then((result)=>{
          setPrice(result[1]/result[0])
          setTotal(parseFloat(result[1]));
        });
  }
  
useEffect(() => {
  checkApprove();
  getBalance();
  getPrice();
}, [account]);
  
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
                        Balance: {(`${balance1.div(BIG_TEN.pow(18)).toFixed(2)}`)}
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
                      {parseFloat(balance1.toString()) > 0 ? (
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
                        Balance: {`${balance2.div(BIG_TEN.pow(18)).toFixed(2)}`}
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
                      {parseFloat(balance2.toString()) > 0 ? (
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
                            {price.toFixed(5)}
                          </Typography>
                          <Typography align="center">
                            {fromValue.symbol} per {toValue.symbol}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography align="center">
                            {(1/price).toFixed(5)}
                          </Typography>
                          <Typography align="center">
                            {toValue.symbol} per {fromValue.symbol}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography align="center">{share.toFixed(2)}%</Typography>
                          <Typography align="center">Share of Pool</Typography>
                        </Box>
                      </Box>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <ApproveToken symbol={fromValue.symbol} disabled={approvedToken1} tokenContract={token1Contract} requestingContract={router} onApprove={onApprove}/>
                      {!approvedToken1 && !approvedToken2 && <Box marginRight={2} />}
                      <ApproveToken symbol={toValue.symbol} disabled={approvedToken2} tokenContract={token2Contract} requestingContract={router} onApprove={onApprove}/>
                    </Box>
                  </>
                ) : null}
                <Box>
                  {!account &&(        
                  <button className="button btn-secondary"
                    onClick={handleConnectPopup}
                  >
                    <span>Unlock Wallet</span>
                  </button>)}
                {account && (parseFloat(inputFrom) != 0) && (parseFloat(inputTo) != 0) && approvedToken2 && approvedToken1 && (
                  <SupplyAction router={router} inputFrom={inputFrom} inputTo={inputTo} token1={token1Address} token2={token2Address} />
                )}
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
      <ConnectPopup onOpen={openPopup} onCloseDialog={handleConnectPopup} />
    </Paper>
  );
}

export default Liquidity;
