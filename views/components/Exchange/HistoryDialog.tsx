import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  makeStyles,
  Typography,
} from '@material-ui/core'

const useStyles = makeStyles(theme => {
  const augmentBlue = theme.palette.augmentColor({ main: '#007EF3' })
  return {
    paper: {
      width: 'auto',
      minWidth: '320px',
      borderRadius: '8px',
    },
  }
})

const HistoryDialog = ({ open, onClose }) => {
  const classes: any = useStyles()

  // const isDisabled = false && (disableButton || !amount || amount > maxAmount)

  const onCloseDialog = () => {
    onClose()
  }

  return (
    <Dialog
      onClose={onCloseDialog}
      open={open}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle className={classes.title}>Recent transactions</DialogTitle>
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
  )
}

export default HistoryDialog
