import {
  Avatar,
  Box,
  Button,
  Grid,
  makeStyles,
  Typography,
} from '@material-ui/core'
import React from 'react'
import { useWeb3React } from '@web3-react/core'

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(5),
    paddingTop: theme.spacing(4),
    borderTop: '1px solid rgb(161, 169, 214)',
  },
  box: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',

    height: '200px',
    margin: theme.spacing(1.5),
    padding: theme.spacing(2),

    bgcolor: 'white',
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

function Statistic(props) {
  const classes = useStyles()
  const {active} = useWeb3React();

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
            src="/static/images/logo-dark.svg"
            className={classes.avatar}
          />

          <Typography>tEXO to Harvest</Typography>
          <Typography className={classes.fadeText}>{active ? 0.00 : 'LOCKED'}</Typography>
          <Typography gutterBottom>~$0.00</Typography>

          <Typography>tEXO to Wallet</Typography>
          <Typography className={classes.fadeText}>{active ? 0.00 : 'LOCKED'}</Typography>
          <Typography gutterBottom>~$0.00</Typography>

          <Button
            className={classes.btn}
            variant="contained"
            color="rgb(255, 255, 255)"
            fullWidth
          >
            Unlock Wallet
          </Button>
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
            <Typography className={classes.boldText}>6,913,340</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography className={classes.boldText}>Max Tx Amount</Typography>
            <Typography className={classes.boldText}>41,402</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography className={classes.boldText}>Market Cap</Typography>
            <Typography className={classes.boldText}>$1,049,754</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography className={classes.boldText}>
              Total tEXO Burned
            </Typography>
            <Typography className={classes.boldText}>1,205,310</Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography className={classes.boldText}>New tEXO/block</Typography>
            <Typography className={classes.boldText}>100</Typography>
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
            $16,293,407.17
          </Typography>

          <Typography color="textPrimary" className={classes.boldText}>
            Across all Farms and Pools
          </Typography>
        </Box>
      </Grid>
    </Grid>
  )
}

export default Statistic
