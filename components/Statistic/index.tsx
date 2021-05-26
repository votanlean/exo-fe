import React, { useState } from 'react';
import { Avatar, Box, Button, Grid, Typography } from '@material-ui/core';
import { useWeb3React } from '@web3-react/core';

import { BIG_TEN } from '../../config';
import ConnectPopup from '../ConnectPopup';

import { useStyles } from './styles';
import BigNumber from 'bignumber.js';

function calculateMarketCap(tEXOPrice, totalSupply: string) {
  if (!tEXOPrice || !totalSupply) {
    return 0;
  }

  const bigNumberTotalSupply = new BigNumber(totalSupply);
  const bigNumberTEXOPRice = new BigNumber(tEXOPrice);

  return bigNumberTotalSupply.times(bigNumberTEXOPRice).toString();
}

function normalizeBigNumber(data: string) {
  const bigNumber = new BigNumber(data);

  return bigNumber.div(BIG_TEN.pow(18)).toNumber();
}

function Statistic(props) {
  const { totalSupply, tEXOPrice, currentTEXOPerBlock, burnAmount } = props;
  const normalizedTotalSupply = normalizeBigNumber(totalSupply);
  const normalizedEmissionRate = normalizeBigNumber(currentTEXOPerBlock);
  const normalizedBurnAmount = normalizeBigNumber(burnAmount);

  const classes = useStyles();
  const { active } = useWeb3React();
  const [openPopup, setOpenPopup] = useState(false);

  const handleConnectPopup = () => {
    setOpenPopup(!openPopup);
  };

  return (
    <Grid container className={classes.root}>
      <Grid item xs={12} sm={6} md={4} lg={4}>
        <Box
          bgcolor="white"
          borderRadius="20px"
          border="1px solid rgb(161, 169, 214)"
          m={1.5}
          p={2}
        >
          <Typography variant="h4" className={'font-bold'}>
            Farms & Staking
          </Typography>
          <Avatar
            alt="tEXO"
            src="/static/images/tEXO-Icon.png"
            className={classes.avatar}
          />

          <Typography>tEXO to Harvest</Typography>
          <Typography className={classes.fadeText}>
            {active ? 0.0 : 'LOCKED'}
          </Typography>
          <Typography gutterBottom>~$0.00</Typography>

          <Typography>tEXO to Wallet</Typography>
          <Typography className={classes.fadeText}>
            {active ? 0.0 : 'LOCKED'}
          </Typography>
          <Typography gutterBottom>~$0.00</Typography>
          {!active && (
            <Button
              className={classes.btn}
              variant="contained"
              // color="rgb(255, 255, 255)"
              fullWidth
              onClick={handleConnectPopup}
            >
              Unlock Wallet
            </Button>
          )}
        </Box>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={4}>
        <Box className={classes.box}>
          <Typography
            variant="h4"
            color="textPrimary"
            className={'font-bold'}
            gutterBottom
          >
            TEXO Stats
          </Typography>

          <Box display="flex" justifyContent="space-between">
            <Typography className={'font-bold'}>Total tEXO Supply</Typography>
            <Typography className={'font-bold'}>
              {Math.round(normalizedTotalSupply)} tEXO
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography className={'font-bold'}>Market Cap</Typography>
            <Typography className={'font-bold'}>
              ${calculateMarketCap(tEXOPrice, totalSupply)}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography className={'font-bold'}>Total tEXO Burned</Typography>
            <Typography className={'font-bold'}>
              {normalizedBurnAmount} tEXO
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography className={'font-bold'}>New tEXO/block</Typography>
            <Typography className={'font-bold'}>
              {normalizedEmissionRate} / block
            </Typography>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={4}>
        <Box className={classes.box}>
          <Typography
            variant="h5"
            color="textPrimary"
            className={'font-bold'}
            gutterBottom
          >
            Total Value Locked (TVL)
          </Typography>

          <Typography variant="h4" className={'font-bold'}>
            $0
          </Typography>

          <Typography color="textPrimary" className={'font-bold'}>
            Across all Farms and Pools
          </Typography>
        </Box>
      </Grid>

      <ConnectPopup onOpen={openPopup} onCloseDialog={handleConnectPopup} />
    </Grid>
  );
}

export default Statistic;
