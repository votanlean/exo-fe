import React from 'react';
import { createMuiTheme, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => {
  const theme = createMuiTheme({
    breakpoints: {
      values: {
        xs: 600,
        sm: 769,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  });

  return {
    tassetContainer: {
      paddingTop: '10rem',
      paddingBottom: '6rem',
      [theme.breakpoints.down('sm')]: {
        paddingTop: '7rem',
      },
    },
    title: {
      fontWeight: 700,
      fontSize: '64px',
      lineHeight: '48px',
      paddingBottom: '40px',
      [theme.breakpoints.down('sm')]: {
        fontSize: '32px',
        lineHeight: '38px',
      },
    },
    desc: {
      margin: '0px',
      fontSize: '14px',
      lineHeight: '20px',
      paddingBottom: '35px',
      maxWidth: '560px',
    },
    button: {
      padding: '0',
      minWidth: 'auto',
      lineHeight: '48px',
      '&:hover': {
        backgroundColor: 'unset',
      },
    },
    buttonLabel: {
      fontWeight: 600,
    },
    buttonLabelActive: {
      fontWeight: 600,
      color: 'rgb(0, 209, 255)',
    },
    gridButton: {
      display: 'grid',
      gridAutoFlow: 'column',
      justifyContent: 'start',
      gap: '50px',
      marginBottom: '40px',
      [theme.breakpoints.down('sm')]: {
        gridAutoFlow: 'initial',
        gridTemplateColumns: 'repeat(3, auto)',
        marginBottom: '20px',
        gap: 'initial',
        justifyContent: 'initial',
        justifyItems: 'start',
      },
    },
  };
});

export { useStyles };
