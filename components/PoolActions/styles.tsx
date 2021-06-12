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
    button: {
      width: '100%',
      marginBottom: '20px',
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
    colorLoading: {
      color: 'white',
    },
  };
});

export { useStyles };
