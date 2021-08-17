import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  makeStyles,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => {
  return {
    paper: {
      width: 'auto',
      minWidth: '320px',
      borderRadius: '8px',
      background: theme.palette.themeBg.default,
    },
    dialogTitle: {
      borderBottom: '1px solid rgb(233, 234, 235)',
    },
  };
});

const HistoryDialog = ({ open, onClose }) => {
  const classes: any = useStyles();

  // const isDisabled = false && (disableButton || !amount || amount > maxAmount)

  const onCloseDialog = () => {
    onClose();
  };

  return (
    <Dialog
      onClose={onCloseDialog}
      open={open}
      classes={{ paper: classes.paper }}
      disableScrollLock
    >
      <DialogTitle className={`${classes.title} ${classes.dialogTitle}`}>
        Recent transactions
      </DialogTitle>
      <DialogContent>
        <Typography variant="h6">
          Please connect your wallet to view your recent transactions
        </Typography>
      </DialogContent>
      <DialogActions className={classes.footer}>
        <Button
          onClick={onCloseDialog}
          variant="contained"
          // disabled={isDisabled}
          className={classes.button}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HistoryDialog;
