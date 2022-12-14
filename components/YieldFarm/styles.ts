import { createMuiTheme, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((customTheme) => {
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
    root: {
      cursor: 'pointer',
      '& > *': {
        // borderBottom: 'unset',
      },
    },
    poolImg1: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: -15,
      position: "relative",
      zIndex: 1,
      [theme.breakpoints.down('sm')]: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: -5,
      },
    },
    poolImg2: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
      zIndex: 0,
      position: "relative",
      [theme.breakpoints.down('sm')]: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 0,
      },
    },
    poolTitle: {
      fontWeight: 600,
      fontSize: 16,
      [theme.breakpoints.down('sm')]: {
        fontSize: 12
      },
    },
    aprIconButton: {
      marginLeft: 8,
    },
    aprIcon: {
      width: 20,
      height: 20,
    },
    collapseRow: {
      paddingBottom: 0,
      paddingTop: 0,
      borderBottom: 'unset',
      background: customTheme.palette.tableRowBg.default,
    },
    label: {
      fontSize: 16,
      fontWeight: 500,
    },
    linkDetail: {
      fontSize: 16,
      color: '#007EF3',
      display: 'flex',
      alignItems: 'center',
    },
    button: {
      width: '100%',
    },
    disabled: {
      backgroundColor: 'darkgray !important',
      cursor: 'auto !important',
    },

    boxButton: {
      borderRadius: '16px',
      padding: '8px',
      border: '2px solid rgb(238, 234, 244)',
      minHeight: '80px',
      [theme.breakpoints.up('sm')]: {
        marginLeft: '20px',
        width: '100%',
      },
      [theme.breakpoints.down('sm')]: {
        marginBottom: '20px',
      },
    },
    rowDetail: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '4px',
      marginBottom: '4px',
      [theme.breakpoints.down('sm')]: {
        width: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
      },
    },
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
    helperText: {
      textAlign: 'right',
    },
    buttonToggle : {
      width: '100%',
      marginTop: '21px',
      display: 'flex',
      justifyContent: 'space-between'
    },
    tableRow: {
      position: 'relative'
    },
  };
});

export { useStyles };
