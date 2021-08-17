import { createMuiTheme, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
  const customTheme = createMuiTheme({
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
    poolImg: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
      [customTheme.breakpoints.down('sm')]: {
        width: 24,
        height: 24,
        borderRadius: 12,
        marginRight: 5,
      },
    },
    poolTitle: {
      fontWeight: 600,
      fontSize: 16,
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
      background: theme.palette.tableRowBg.default,
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
      display: 'block',
      marginTop: 8,
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
      [customTheme.breakpoints.up('sm')]: {
        marginLeft: '20px',
        width: '100%',
      },
      [customTheme.breakpoints.down('sm')]: {
        marginBottom: '20px',
      },
    },
    rowDetail: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: '4px',
      marginBottom: '4px',
    },
    buttonBoxItem: {
      width: '50%',
      marginLeft: '20px',
      [customTheme.breakpoints.down('sm')]: {
        width: 'auto',
        marginLeft: '0',
      },
    },
    APRInfo: {
      [customTheme.breakpoints.down('sm')]: {
        display: 'none',
      },
    },
    mobileAPRInfo: {
      display: 'none',
      [customTheme.breakpoints.down('sm')]: {
        display: 'block',
      },
    },
    APRColumn: {
      [customTheme.breakpoints.down('sm')]: {
        paddingLeft: '0px !important',
        paddingRight: '0px !important',
      },
    },
    ArrowColumn: {
      [customTheme.breakpoints.down('sm')]: {
        paddingLeft: '8px !important',
        paddingRight: '8px !important',
      },
    },
  };
});

export { useStyles };
