import {
  Avatar,
  Box,
  Button,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core'
import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { BIG_TEN } from 'config';
import ConnectPopup from '../ConnectPopup';

function calculateMarketCap(tEXOPrice, totalSupply) {
  if (!tEXOPrice || !totalSupply) {
    return 0;
  }

  return totalSupply.times(tEXOPrice);
}

const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: theme.spacing(4),
    marginBottom: theme.spacing(5),
    borderBottom: '1px solid rgb(161, 169, 214)',
  },
  box: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',

    height: '200px',
    margin: theme.spacing(1.5),
    padding: theme.spacing(2),

    color: '#6A98C9',
    borderRadius: '20px',
    border: '1px solid rgb(161, 169, 214)',
  },
  avatar: {
    margin: theme.spacing(1.5, 0),
  },
  fadeText: {
    color: theme.palette.text.disabled,
    margin: theme.spacing(1, 0),
  },
  btn: {
    textTransform: 'none',
    borderRadius: '12px',
    padding: '10px',
    fontSize: '20px',
    fontWeight: '700',
  },
  boldText: {
    fontWeight: '700',
  },
}))

function normalizeBigNumber(bigNum) {
  return bigNum ? bigNum.div(BIG_TEN.pow(18)).toNumber(): 0;
}

function Statistic(props) {
  const {
    totalSupply,
    tEXOPrice,
    currentTEXOPerBlock,
    burnAmount,
  } = props;

  const normalizedTotalSupply = normalizeBigNumber(totalSupply);
  const normalizedEmissionRate = normalizeBigNumber(currentTEXOPerBlock);
  const normalizedBurnAmount = normalizeBigNumber(burnAmount);

  // console.log(totalSupply.div(BIG_TEN.pow(18)));

  const classes = useStyles()
  const { active } = useWeb3React()
  const [openPopup, setOpenPopup] = useState(false)

  const handleConnectPopup = popupState => {
    setOpenPopup(popupState)
  }

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
          <Typography variant="h4" className={classes.boldText}>
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
              color="rgb(255, 255, 255)"
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
            className={classes.boldText}
            gutterBottom
          >
            TEXO Stats
          </Typography>

          <Box display="flex" justifyContent="space-between">
            <Typography className={classes.boldText}>
              Total tEXO Supply
            </Typography>
            <Typography className={classes.boldText}>
              {Math.round(normalizedTotalSupply)}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography className={classes.boldText}>Market Cap</Typography>
            <Typography className={classes.boldText}>
              ${calculateMarketCap(tEXOPrice, normalizedTotalSupply)}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography className={classes.boldText}>
              Total tEXO Burned
            </Typography>
            <Typography className={classes.boldText}>{normalizedBurnAmount}</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography className={classes.boldText}>New tEXO/block</Typography>
            <Typography className={classes.boldText}>{normalizedEmissionRate}</Typography>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} sm={6} md={4} lg={4}>
        <Box className={classes.box}>
          <Typography
            variant="h5"
            color="textPrimary"
            className={classes.boldText}
            gutterBottom
          >
            Total Value Locked (TVL)
          </Typography>

          <Typography variant="h4" className={classes.boldText}>
            $0
          </Typography>

          <Typography color="textPrimary" className={classes.boldText}>
            Across all Farms and Pools
          </Typography>
        </Box>
      </Grid>
      {openPopup && <ConnectPopup connectPopup={handleConnectPopup} />}
    </Grid>
  )
}

export default Statistic
