import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  makeStyles,
  Box,
  Typography,
  IconButton,
} from '@material-ui/core'
import { Close, Launch } from '@material-ui/icons'
import { getRoi, tokenEarnedPerThousandDollarsCompounding } from 'utils/compoundApyHelpers'

const useStyles = makeStyles(theme => {
  return {
    paper: {
      width: 'auto',
      minWidth: '360px',
      borderRadius: '16px',
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
    },
    dialogTitle: {
      borderBottom: '1px solid rgb(233, 234, 235)',
      marginBottom: 24,
    },
    dialogTitleText: {
      fontWeight: 600,
    },
    thead: {
      color: 'rgb(132, 148, 167)',
      fontSize: 12,
      fontWeight: 600,
      lineHeight: 1.5,
      textTransform: 'uppercase',
      marginBottom: 20,
      display: 'block',
    },
    tbody: {
      color: 'rgb(71, 95, 123)',
      fontSize: 16,
      fontWeight: 400,
      lineHeight: 1.5,
    },
    desc: {
      color: 'rgb(132, 148, 167)',
      fontSize: 12,
      fontWeight: 400,
      lineHeight: 1.5,
      maxWidth: 320,
      marginBottom: 28,
      display: 'block',
    },
    getTexoLink: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  }
})

const ROIDialog = (props: any) => {
  const {
    open,
    onClose,
    poolData = {},
  } = props || {};
  const classes: any = useStyles();
  const { apr, tokenPrice } = poolData;
  const oneThousandDollarsWorthOfToken = 1000 / tokenPrice;

  const tokenEarnedPerThousand1D = tokenEarnedPerThousandDollarsCompounding({
    numberOfDays: 1,
    farmApr: apr,
    tokenPrice,
  });

  const tokenEarnedPerThousand7D = tokenEarnedPerThousandDollarsCompounding({
    numberOfDays: 7,
    farmApr: apr,
    tokenPrice,
  });

  const tokenEarnedPerThousand30D = tokenEarnedPerThousandDollarsCompounding({
    numberOfDays: 30,
    farmApr: apr,
    tokenPrice,
  });
  
  const tokenEarnedPerThousand365D = tokenEarnedPerThousandDollarsCompounding({
    numberOfDays: 365,
    farmApr: apr,
    tokenPrice,
  })

  const onCloseDialog = () => {
    onClose()
  }

  return (
    <Dialog
      onClose={onCloseDialog}
      open={open}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle disableTypography className={classes.dialogTitle}>
        <Typography variant="h6" className={classes.dialogTitleText}>
          ROI
        </Typography>
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          display="grid"
          gridTemplateColumns="repeat(3, 1fr)"
          gridTemplateRows="repeat(4, auto)"
          marginBottom={2.5}
        >
          <div>
            <Typography variant="caption" className={classes.thead}>
              Timeframe
            </Typography>
          </div>
          <div>
            <Typography variant="caption" className={classes.thead}>
              ROI
            </Typography>
          </div>
          <div>
            <Typography variant="caption" className={classes.thead}>
              tEXO per $1000
            </Typography>
          </div>
          <div>
            <Typography variant="caption" className={classes.tbody}>
              1d
            </Typography>
          </div>
          <div>
            <Typography variant="caption" className={classes.tbody}>
              {getRoi({ amountEarned: tokenEarnedPerThousand1D, amountInvested: oneThousandDollarsWorthOfToken }).toFixed(2)}%
            </Typography>
          </div>
          <div>
            <Typography variant="caption" className={classes.tbody}>
              {tokenEarnedPerThousand1D}
            </Typography>
          </div>
          <div>
            <Typography variant="caption" className={classes.tbody}>
              7d
            </Typography>
          </div>
          <div>
            <Typography variant="caption" className={classes.tbody}>
            {getRoi({ amountEarned: tokenEarnedPerThousand7D, amountInvested: oneThousandDollarsWorthOfToken }).toFixed(2)}%
            </Typography>
          </div>
          <div>
            <Typography variant="caption" className={classes.tbody}>
              {tokenEarnedPerThousand7D}
            </Typography>
          </div>
          <div>
            <Typography variant="caption" className={classes.tbody}>
              30d
            </Typography>
          </div>
          <div>
            <Typography variant="caption" className={classes.tbody}>
            {getRoi({ amountEarned: tokenEarnedPerThousand30D, amountInvested: oneThousandDollarsWorthOfToken }).toFixed(2)}%
            </Typography>
          </div>
          <div>
            <Typography variant="caption" className={classes.tbody}>
              {tokenEarnedPerThousand30D}
            </Typography>
          </div>
          <div>
            <Typography variant="caption" className={classes.tbody}>
              365d(APY)
            </Typography>
          </div>
          <div>
            <Typography variant="caption" className={classes.tbody}>
            {getRoi({ amountEarned: tokenEarnedPerThousand365D, amountInvested: oneThousandDollarsWorthOfToken }).toFixed(2)}%
            </Typography>
          </div>
          <div>
            <Typography variant="caption" className={classes.tbody}>
              {tokenEarnedPerThousand365D}
            </Typography>
          </div>
        </Box>
        <Box>
          <Typography variant="caption" className={classes.desc}>
            Calculated based on current rates. Compounding once daily. Rates are
            estimates provided for your convenience only, and by no means
            represent guaranteed returns.
          </Typography>
        </Box>
        <Box textAlign="center">
          <a href="/exchange" target="_blank" className={classes.getTexoLink}>
            Get tEXO <Launch fontSize="small" />
          </a>
        </Box>
      </DialogContent>
      <DialogActions className={classes.footer}></DialogActions>
    </Dialog>
  )
}

export default ROIDialog
