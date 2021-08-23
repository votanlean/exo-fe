import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      paddingBottom: theme.spacing(9),
    },
    box: {
      display: 'flex',
      justifyContent: 'space-between',
      flexDirection: 'column',

      minHeight: '234px',
      margin: theme.spacing(1.5),
      padding: theme.spacing(2),

      color: '#6A98C9',
      borderRadius: '20px',
      border: '1px solid rgb(161, 169, 214)',
      background: theme.palette.themeBg.default,
      [theme.breakpoints.down('xs')]: {
        minHeight: 'auto',
        margin: 0,
        marginBottom: 24,
      },
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
      color: 'rgb(255, 255, 255)',
      background: '#007EF3',
      '&:hover': {
        background: 'rgb(0, 88, 170)',
      },
    },
    title: {
      fontSize: '1.825rem',
      [theme.breakpoints.down('sm')]: {
        fontSize: '1.375rem',
      },
    },
  };
});

export { useStyles };
