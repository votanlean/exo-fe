import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      borderRadius: 20,
      maxWidth: 436,
      width: '100%',
      margin: '0 auto',
      background: theme.palette.themeBg.default,
    },
    header: {
      borderBottom: '1px solid rgb(233 234 235)',
    },
    box: {
      padding: 16,
      borderRadius: 12,
      background: theme.palette.tableRowBg.default,
    },
    iconAva: {
      width: 24,
      height: 24,
      marginRight: 8,
    },
    textInputRoot: {
      border: 'none',
      outline: 'none',
    },
    priceShareTitle: {
      padding: '1rem',
    },
    priceShareBox: {
      border:
        theme.palette.type === 'dark'
          ? '1px solid rgb(8, 6, 11)'
          : '1px solid rgb(250, 249, 250)',
      borderRadius: 20,
    },
    selectCurrencyText: {
      fontSize: 12,
      textTransform: 'initial',
    },
    disable: {
      display: 'none'
    },
    display: {
      display: 'block'
    }
  };
});

export default useStyles;
