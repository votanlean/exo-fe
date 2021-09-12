import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  makeStyles,
  Box,
  Typography,
  IconButton,
} from '@material-ui/core';
import { Close, Launch } from '@material-ui/icons';
import {
  getRoi,
  tokenEarnedPerThousandDollars,
} from 'utils/compoundApyHelpers';

const useStyles = makeStyles((theme) => {
  return {
    paper: {
      width: 'auto',
      minWidth: '360px',
      borderRadius: '16px',
      background: theme.palette.themeBg.default,
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
      marginBottom: 28,
      display: 'block',
    },
    getTexoLink: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };
});

const CommonROIDialog = ({
  open,
  onClose,
  poolData = {},
  tokenEarnedPerThousand1D,
  tokenEarnedPerThousand7D,
  tokenEarnedPerThousand30D,
  tokenEarnedPerThousand365D,
  tokenSymbol = 'tEXO',
  isYieldROI
}: any = {}) => {
  const classes: any = useStyles();
  const { tokenPrice } = poolData;
  const oneThousandDollarsWorthOfToken = 1000 / tokenPrice;

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
              {tokenSymbol} per $1000
            </Typography>
          </div>
          <div>
            <Typography variant="caption" className={classes.tbody}>
              1d
            </Typography>
          </div>
          <div>
            <Typography variant="caption" className={classes.tbody}>
              {getRoi({
                amountEarned: tokenEarnedPerThousand1D,
                amountInvested: oneThousandDollarsWorthOfToken,
              }).toFixed(2)}
              %
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
              {getRoi({
                amountEarned: tokenEarnedPerThousand7D,
                amountInvested: oneThousandDollarsWorthOfToken,
              }).toFixed(2)}
              %
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
              {getRoi({
                amountEarned: tokenEarnedPerThousand30D,
                amountInvested: oneThousandDollarsWorthOfToken,
              }).toFixed(2)}
              %
            </Typography>
          </div>
          <div>
            <Typography variant="caption" className={classes.tbody}>
              {tokenEarnedPerThousand30D}
            </Typography>
          </div>
          <div>
            <Typography variant="caption" className={classes.tbody}>
              {isYieldROI ? '365d(APY)' : '365d(APR)'}
            </Typography>
          </div>
          <div>
            <Typography variant="caption" className={classes.tbody}>
              {getRoi({
                amountEarned: tokenEarnedPerThousand365D,
                amountInvested: oneThousandDollarsWorthOfToken,
              }).toFixed(2)}
              %
            </Typography>
          </div>
          <div>
            <Typography variant="caption" className={classes.tbody}>
              {tokenEarnedPerThousand365D}
            </Typography>
          </div>
        </Box>
        <Box textAlign="center">
          <a href="/exchange" target="_blank" className={classes.getTexoLink}>
            Get tEXO <Launch fontSize="small" />
          </a>
        </Box>
      </DialogContent>
      <DialogActions className={classes.footer}></DialogActions>
    </Dialog>
  );
};

const calculateAllTokenEarnedPerThousand = (data: any) => {
  const D1 = tokenEarnedPerThousandDollars({
    ...data,
    numberOfDays: 1,
  });

  const D7 = tokenEarnedPerThousandDollars({
    ...data,
    numberOfDays: 7,
  });

  const D30 = tokenEarnedPerThousandDollars({
    ...data,
    numberOfDays: 30,
  });

  const D365 = tokenEarnedPerThousandDollars({
    ...data,
    numberOfDays: 365,
  });

  return {
    tokenEarnedPerThousand1D: D1,
    tokenEarnedPerThousand7D: D7,
    tokenEarnedPerThousand30D: D30,
    tokenEarnedPerThousand365D: D365,
  }
}

export const ROIDialog = (props: any) => {
  const { poolData = {} } = props || {};
  const { apr, tokenPrice, autocompound, performanceFee, compoundFrequency } = poolData;

  const calculatedTokenEarned = calculateAllTokenEarnedPerThousand({
    farmApr: apr,
    tokenPrice,
    autocompound,
    performanceFee,
    compoundFrequency,
  })

  return (
    <CommonROIDialog
      {...props}
      {...calculatedTokenEarned}
      isYieldROI={false}
    />
  );
}

export const YieldFarmROIDialog = (props: any) => {
  const { poolData = {} } = props || {};
  const { apr, tokenPrice, performanceFee, compoundFrequency } = poolData;

  const { tokenRewardsApr, lpRewardsApr, tEXOApr } = apr || {
    tokenRewardsApr: 0,
    lpRewardsApr: 0,
    tEXOApr: 0,
  };

  const calculatedNonCompoundTokenEarned = calculateAllTokenEarnedPerThousand({
    farmApr: (lpRewardsApr || 0) + (tEXOApr || 0),
    tokenPrice,
  })

  const calculatedCompoundTokenEarned = calculateAllTokenEarnedPerThousand({
    farmApr: tokenRewardsApr || 0,
    tokenPrice,
    autocompound: true,
    performanceFee,
    compoundFrequency,
  });

  const calculatedTokenEarned = {
    tokenEarnedPerThousand1D: calculatedNonCompoundTokenEarned.tokenEarnedPerThousand1D + calculatedCompoundTokenEarned.tokenEarnedPerThousand1D,
    tokenEarnedPerThousand7D: calculatedNonCompoundTokenEarned.tokenEarnedPerThousand7D + calculatedCompoundTokenEarned.tokenEarnedPerThousand7D,
    tokenEarnedPerThousand30D: calculatedNonCompoundTokenEarned.tokenEarnedPerThousand30D + calculatedCompoundTokenEarned.tokenEarnedPerThousand30D,
    tokenEarnedPerThousand365D: calculatedNonCompoundTokenEarned.tokenEarnedPerThousand365D + calculatedCompoundTokenEarned.tokenEarnedPerThousand365D,
  }

  return (
    <CommonROIDialog
      {...props}
      {...calculatedTokenEarned}
      tokenSymbol='USDT'
      isYieldROI={true}
    />
  );
}