import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
  return {
    networkBtn: {
      padding: 2,
      borderRadius: 20,
      paddingRight: 12,
      background: 'linear-gradient(-90deg, #0f0f0f 0%, #103c5b 100%)',
      marginRight: 20,
      [theme.breakpoints.down('sm')]: {
        paddingRight: 2,
        marginRight: 5,
        minWidth: 0,
      },
    },
    networkIcon: {
      width: 34,
      height: 34,
    },
    networkName: {
      fontSize: 14,
      textTransform: 'initial',
      marginLeft: 8,
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    connectBtn: {
      height: 38,
      borderRadius: 20,
      background: 'linear-gradient(-90deg, #0f0f0f 0%, #103c5b 100%)',
      [theme.breakpoints.down('sm')]: {
        paddingLeft: 12,
        paddingRight: 2,
        marginRight: 5,
        minWidth: 0,
      },
    },
    accAddress: {
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    active: {
      opacity: '0.4',
    },
    toggleDarkModeBtn: {
      color: '#fff',
      [theme.breakpoints.down('sm')]: {
        padding: 7,
      },
    },
    headerBg: {
      background: theme.palette.headerBg.default,
    },
  };
});

export { useStyles };
