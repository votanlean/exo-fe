import {  makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {

  return {
    userInfo: {
      color: '#fff',
      height: '160px',
      width: '100%',
      backgroundColor: '#6a98c9',
      borderRadius: '16px',
      [theme.breakpoints.down('xs')]: {
        height: 'auto',
        paddingBottom: '10px'
      }
    },
    accImg: {
      width: '25%',
      padding: '16px',
      borderRadius: '50%',
      float: 'left',
      [theme.breakpoints.down('xs')]: {
        display: 'none'
			}
    },
    infoItem: {
        float: 'left',
        width: '22%',
        display: 'block',
        textAlign: 'center',
        marginTop: '20px',
        fontSize: '20px',
        [theme.breakpoints.down('xs')]: {
          float: 'none',
          width: '100%',
          marginTop: '10px',
        }
    },
    caption: {
      width: '100%',
      opacity: '0.6',
      lineHeight: '40px'
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

    
    
    

    paper: {
      borderRadius: '24px',
      background: 'linear-gradient(180deg, #0f0f0f 0%, #103c5b 100%)',
      paddingBottom: '15px',
      border: '1px solid rgb(161, 169, 214)',
      
    },
    buttonArea: {
      width: '100%',
      marginTop: '16px',
      textAlign: 'center',
      
    },
    button: {
      color: '#fff',
      width: '48%',
      padding: '10px 15px',
      display: 'flex',
      margin: '0px 0%',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: '16px',
      backgroundColor: '#6a98c9',
      textTransform: 'capitalize',
      float: 'left',
      '&:hover': {
        backgroundColor: '#007EF3',
        color: '#fff',
      },
      '&:first-child': {
        marginRight: '16px',
      },
      [theme.breakpoints.down('xs')]: {
        width: '100%',
        '&:first-child': {
          marginBottom: '16px',
        },
			}

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
