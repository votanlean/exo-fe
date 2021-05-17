import React from 'react'
import PropTypes from 'prop-types'
import { Box, FormLabel, Grid, makeStyles, Paper, TextField, Typography, Button, Avatar } from '@material-ui/core'

Statistic.propTypes = {}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    height: 140,
    width: 100,
  },
  control: {
    padding: theme.spacing(2),
  },
  layout: {
    flexGrow: 1,
  },
}))

function Statistic(props) {
  const [spacing, setSpacing] = React.useState(2)
  const classes = useStyles()

  return (
    <Grid container className={classes.layout}>
      <Grid item  xs={12} sm={6} md={4} lg={4}>
        <Box bgcolor='white' color='black' borderRadius='20px' border='1px solid rgb(161, 169, 214)'>
          <Typography variant='h4'>
            Farms & Staking
          </Typography>
          <Avatar alt='tEXO' src='/static/images/logo-dark.svg' />

          <Typography variant='body1'>
            Gator to Harvest
          </Typography>
          <Typography variant='body1'>
            LOCKED
          </Typography>
          <Typography variant='body1'>
            ~$0.00
          </Typography>
          <Button variant='contained' color='primary'>Unlock Wallet</Button>
        </Box>
      </Grid>
      <Grid item  xs={12} sm={6} md={4} lg={4}>
        <Box bgcolor='white' color='black' borderRadius='20px' border='1px solid rgb(161, 169, 214)' margin={2}>
          <Typography variant='h4'>
            TEXO Stats
          </Typography>
          <Grid justify="space-around" direction={'row'}>
            <Typography>Total Gator Supply</Typography>
            <Typography>6,913,340</Typography>
          </Grid>
        </Box>
      </Grid>
      <Grid item  xs={12} sm={6} md={4} lg={4}>
        <Box bgcolor='white' color='black' borderRadius='20px' border='1px solid rgb(161, 169, 214)' margin={2}>
          <Typography variant='h4'>
            Total Value Locked (TVL)
          </Typography>
          <Typography variant='h4'>
            $16,293,407.17
          </Typography>
          <Typography variant='h4'>
            Across all Farms and Pools
          </Typography>
        </Box>
      </Grid>
    </Grid>
  )
}

export default Statistic
