import { makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => {
  return {
    tableContainer: {
      filter: 'drop-shadow(rgba(25, 19, 38, 0.15) 0px 1px 4px)',
      width: '100%',
      background: 'rgb(255, 255, 255)',
      borderRadius: '16px',
      margin: '16px 0px',
    },
  };
});
