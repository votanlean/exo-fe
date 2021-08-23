import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => {
  return {
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: drawerWidth,
        flexShrink: 0,
      },
    },
    // necessary for content to be below app bar
    toolbar: {
      minHeight: 70,
    },
    drawerPaper: {
      width: drawerWidth,
      background: theme.palette.themeBg.default,
    },
    listItem: {
      display: 'block',
    },
    activeMenu: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 5,
      height: '100%',
      background: '#007EF3',
    },
    toolbarFooter: {
      maxHeight: 100,
      height: '100%',
      marginTop: 'auto',
    },
    toggleDarkModeBtn: {
      padding: '8px 16px',
    },
  };
});

export { useStyles };
