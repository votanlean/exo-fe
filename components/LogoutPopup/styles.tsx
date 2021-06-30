import { createMuiTheme, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => {

  const theme = createMuiTheme({
    breakpoints: {
      values: {
        xs: 300,
        sm: 769,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  });

  return {
    accountListItem: {
      width: '435.953px',
      color: '#fff',
      '&:hover': {backgroundColor: '#6a98c9', color: '#fff'},
      borderRadius: '20px'
    },
    acountInfo: {
      width: '80px',
    },

    
    firstRow: {
      backgroundImage: `url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmq2trOAsHP4xdRuwJCq0kizbC4ge-Su3ZRzNeOmDEafDUueLVv4lmBL-NfpPQB7vxZ04&usqp=CAU")`,
      color: '#fff',
      width: '100%',
    },
    
    table: {
      width: '100%'
    },

    accountAddressBox: {
      maxWidth: '100%',
      borderRadius: '16px',
      backgroundColor: '#6a98c9',
      marginTop: '15px',
      color: '#fff',
      padding: '10px 20px',
    },
    accountAddress: {
      fontSize: '1.15rem',
      width: '100%',
      [theme.breakpoints.down('xs')]: {
        display: 'none'
			}
    },
    subAccountAddress: {
      fontSize: '1.15rem',
      display: 'none',
      [theme.breakpoints.down('xs')]: {
        display: 'block'
			}
    },

    AccImgCell: {
      [theme.breakpoints.down('xs')]: {
        display: "none"
			}
    },
    
    accountImage:{
      color: '#fff',
      borderRadius: '70px',
      padding: '24px 16px',
      width: '80px',
      [theme.breakpoints.down('xs')]: {
				width: "50px",
			}
    },

    paper: {
      borderRadius: '24px',
      background: 'linear-gradient(180deg, #0f0f0f 0%, #103c5b 100%)',
      paddingBottom: '15px',
      border: '1px solid rgb(161, 169, 214)',
      
    },
    button: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: '16px',
      marginTop: '8px',
      marginRight: '10px',
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
    titlePopup: {
      color: '#fff',
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
  };
});

export { useStyles };
