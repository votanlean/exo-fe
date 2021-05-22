import React from 'react'
import { Box, Container, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import LogoTitle from '../LogoTitle'

const ComingSoon = () => {
  const classes = makeStyles(theme => {
    return {

    }
  })
  return (
    <Box height="100vh" display="flex" alignItems="center" flexDirection="row" justifyContent="center" textAlign="center">
      <Box marginRight="70px">
        <LogoTitle/>
      </Box>
      <Box>
        <Typography variant='h1'>Coming Soon</Typography>
        <Typography variant='h2'>Are you ready?</Typography>
      </Box>
    </Box>
  )
}

export default ComingSoon;
