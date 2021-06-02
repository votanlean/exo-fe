import React from 'react';
import { Box, Container, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
  return {
    comingSoonLogo: {
      [theme.breakpoints.down('sm')]: {
        width: '80px',
      },
    },
    comingSoonText: {
      [theme.breakpoints.down('sm')]: {
        fontSize: '2.7rem',
      },
    },
  };
});

const ComingSoon = () => {
  const classes = useStyles();
  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      flexDirection="row"
      justifyContent="center"
      textAlign="center"
    >
      <img
        className={classes.comingSoonLogo}
        src="/static/images/icon-white.svg"
        alt="logo title"
      />
      <Box>
        <Typography variant="h1" className={classes.comingSoonText}>
          Coming Soon
        </Typography>
        <Typography variant="h2" className={classes.comingSoonText}>
          Are you ready?
        </Typography>
      </Box>
    </Box>
  );
};

export default ComingSoon;

