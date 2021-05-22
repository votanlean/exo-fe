import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      paddingBottom: theme.spacing(4),
      marginBottom: theme.spacing(5),
      borderBottom: '1px solid rgb(161, 169, 214)',
    },
    box: {
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',

      height: '200px',
      margin: theme.spacing(1.5),
      padding: theme.spacing(2),

      color: '#6A98C9',
      borderRadius: '20px',
      border: '1px solid rgb(161, 169, 214)',
    },
    avatar: {
      margin: theme.spacing(1.5, 0),
    },
    fadeText: {
      color: theme.palette.text.disabled,
      margin: theme.spacing(1, 0),
    },
    btn: {
      textTransform: 'none',
      borderRadius: '12px',
      padding: '10px',
      fontSize: '20px',
      fontWeight: 700,
    },
  };
});

export { useStyles };
