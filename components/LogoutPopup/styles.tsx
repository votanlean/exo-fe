import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
  return {
    accountListItem: {
      width: '435.953px',
      color: '#fff',
      '&:hover': {backgroundColor: '#6a98c9', color: '#fff'},
      borderRadius: '20px'
    },
    acountInfo: {
      minWidth: '140px'
    },

    accountListButton: {
      display: 'flex',
      width: '100%', 
      alignItems: 'center',
      justifyContent: 'space-between',
      borderRadius: '16px',
      color: '#fff', 
      marginTop: '10px', 
      backgroundColor: '#007EF3',
      textTransform: 'capitalize',
    },
    firstRow: {
      backgroundImage: `url("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmq2trOAsHP4xdRuwJCq0kizbC4ge-Su3ZRzNeOmDEafDUueLVv4lmBL-NfpPQB7vxZ04&usqp=CAU")`,
      color: '#fff',
      minWidth: '600px'
    },
    
    accountAddress: {
      maxWidth: '100%',
      borderRadius: '16px',
      backgroundColor: '#6a98c9',
      marginTop: '15px',
      fontSize: '1.15rem',
      color: '#fff',
      padding: '10px 20px',
    },
    paper: {
      width: 'auto',
      minWidth: '700px',
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
