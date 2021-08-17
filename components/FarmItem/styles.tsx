import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      background: theme.palette.themeBg.default,
    },
  };
});

export { useStyles };
