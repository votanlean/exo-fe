import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
  return {
    paper: {
      width: 'auto',
      minWidth: '360px',
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
  };
});

export { useStyles };
