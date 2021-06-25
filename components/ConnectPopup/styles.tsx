import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
  return {
    paper: {
      minWidth: '510px',
      borderRadius: '24px',
      background: 'linear-gradient(180deg, #0f0f0f 0%, #103c5b 100%)',
      paddingBottom: '15px',
      border: '1px solid rgb(161, 169, 214)',
			[theme.breakpoints.down('xs')]: {
				minWidth: "300px"
			}
    },
    title: {
      borderBottom: '1px solid rgb(161, 169, 214)',
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: '#fff',
    },
    dialogTitleText: {
      color: '#fff',
      fontSize: '18px',
      fontWeight: 600,
    },
    button: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: '16px',
      marginTop: '8px',
      backgroundColor: '#6a98c9',
      textTransform: 'capitalize',
      '&:hover': {
        backgroundColor: '#007EF3',
        color: '#fff',
      },
    },
    titleButton: {
      fontWeight: 'bold',
      fontSize: '18px',
    },

    stepperRoot: {
      backgroundColor: 'transparent',
      padding: 0,
      marginTop: 20,
    },
    stepLabel: {
      color: '#ffffff !important',
      fontSize: 16,
      fontWeight: 500,
    },
    textWhite: {
      color: '#ffffff',
    },

    buttonWalletRoot: {
      display: 'block',
      textAlign: 'center',
      borderRadius: 16,
      margin: '0 4px',
      '&:hover': {
        background: '#0e131c',
      },
    },
    iconWallet: {
      marginLeft: 'auto',
      marginRight: 'auto',
      width: 60,
      height: 60,
    },
    labelWallet: {
      textTransform: 'initial',
      fontSize: 12,
      lineHeight: '16px',
      color: '#ffffff',
      marginTop: 8,
    },
    buttonLabel: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'column',
      minHeight: 54,
      height: '100%',
    },
    iconDisable: {
      background: '#212a3b',
    },
    labelDisable: {
      color: '#7e96b8',
    },

    iconCheckContainer: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      padding: 2,
      borderRadius: '50%',
      width: 20,
      height: 20,
      background: '#191f2a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconCheck: {
      background: '#23C68A',
      borderRadius: '50%',
    },
    iconCheckSize: {
      fontSize: 18,
      fontWeight: 600,
    },
    iconCheckDisable: {
      background: '#212a3b',
      borderRadius: '50%',
    },

    checkboxRoot: {
      color: '#ffffff',
    },
  };
});

export { useStyles };
