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
    buttonBoxItem: {
      "&:not(:first-child)": {
        marginTop: theme.spacing(1)
      },
      "&:not(:last-child)": {
        marginBottom: theme.spacing(1)
      },
      [theme.breakpoints.down('sm')]: {
        width: 'auto',
        marginLeft: '0',
      },
    },
  };
});

export { useStyles };
