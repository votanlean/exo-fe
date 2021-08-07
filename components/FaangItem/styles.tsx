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
    root: {
      border: '1px solid rgb(161, 169, 214)',
      borderRadius: '20px',
      background: 'rgb(255, 255, 255)',
      margin: '0px auto',
      padding: '18px',
      maxWidth: '100%',
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      }
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      marginBottom: '20px',
      [theme.breakpoints.down('xs')]: {
        justifyContent: 'space-between',
      }
    },
    rowItem: {
      width: '45%',
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      }
    },
    img: {
      height: '40px',
      marginRight: '10px',
      border: '1px solid rgb(161, 169, 214)',
      borderRadius: '24px',
    },
    title: {
      fontWeight: 700,
      fontSize: '20px',
      marginLeft: '20px',
    },
    flexRow: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      
    },
    button: {
      width: '100%',
      // marginTop: '20px',
    },
    pTitle: {
      fontWeight: 'bold',
      fontSize: '16px',
      lineHeight: 2,
    },
    iconButton: {
      padding: '9px',
    },
    disabled: {
      backgroundColor: 'darkgray !important',
      cursor: 'auto !important',
    },
    approveButton: {
      marginTop: '10px',
      marginBottom: 0,
    },
    doubleBtn:{
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '10px',
      flex: '50',
      margin: '0 -5px',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
        marginTop: '0px',
      }
    },
    btnItem: {
      flex: '1',
      margin: '0 5px',
    }
  };
});

export { useStyles };
