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
        paddingRight: 5,
        marginRight: 0,
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
      height: '34px',
      borderRadius: 20,
      padding: '8px ​12px',
      background: 'linear-gradient(-90deg, #0f0f0f 0%, #103c5b 100%)',
    },
    accAddress:{
      [theme.breakpoints.down('xs')]: {
        display: 'none',
      },
    },
    active:{
      opacity: '0.4'
    }
  };
});

export { useStyles };
