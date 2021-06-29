import React, { useState } from 'react';
import { Avatar, Box, Button, Grid, Typography } from '@material-ui/core';
import { useWeb3React } from '@web3-react/core';

import { BIG_TEN } from '../../config';
import ConnectPopup from '../ConnectPopup';

import { useStyles } from './styles';
import BigNumber from 'bignumber.js';
import useTokenBalance from '../../hooks/useTokenBalance';
import { getTEXOAddress } from '../../utils/addressHelpers';
import { getBalanceNumber } from '../../utils/formatBalance';
import { normalizeTokenDecimal } from 'utils/bigNumber';
import { useNetwork } from 'state/hooks';

function calculateMarketCap(tEXOPrice, totalSupply: string) {
  if (!tEXOPrice || !totalSupply) {
    return 0;
  }

  const bigNumberTotalSupply = new BigNumber(totalSupply).div(BIG_TEN.pow(18));
  const bigNumberTEXOPRice = new BigNumber(tEXOPrice);

  return bigNumberTotalSupply.times(bigNumberTEXOPRice).toFixed(2);
}

function Statistic(props) {
  const {
    totalSupply,
    tEXOPrice,
    currentTEXOPerBlock,
    burnAmount,
    tvl,
    tEXOReward,
  } = props;
  const normalizedTotalSupply = normalizeTokenDecimal(totalSupply).toNumber();
  const normalizedEmissionRate =
    normalizeTokenDecimal(currentTEXOPerBlock).toNumber();
  const normalizedBurnAmount = normalizeTokenDecimal(burnAmount).toNumber();
  const { id: chainId } = useNetwork();
  const tEXOBalance = getBalanceNumber(
    useTokenBalance(getTEXOAddress(chainId)),
  );

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
            tEXO Balance
          </Typography>
          <Avatar
            alt="tEXO"
            src="/static/images/tEXO-Icon.png"
            className={classes.avatar}
          />

          <Typography>tEXO to Harvest</Typography>
          <Typography className={classes.fadeText}>
            {active ? tEXOReward.toFixed(2) : 'LOCKED'}
          </Typography>
          <Typography gutterBottom>
            ~${(tEXOPrice * tEXOReward).toFixed(2)}
          </Typography>

          <Typography>tEXO in Wallet</Typography>
          <Typography className={classes.fadeText}>
            {active ? tEXOBalance.toFixed(2) : 'LOCKED'}
          </Typography>
          <Typography gutterBottom>
            ~${(tEXOPrice * tEXOBalance).toFixed(2)}
          </Typography>
          {!active && (
            <Button
              className={classes.btn}
              variant="contained"
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
            <Typography className={'font-bold'}>tEXO Price</Typography>
            <Typography className={'font-bold'}>
              ${Number(tEXOPrice).toFixed(2)}
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
              {normalizedEmissionRate} tEXO / block
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
            ${tvl.toFixed(2)}
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
