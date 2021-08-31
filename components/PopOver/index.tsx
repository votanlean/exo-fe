import React from 'react';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { WarningRounded } from '@material-ui/icons';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    popover: {
      pointerEvents: 'none',
    },
    paper: {
      padding: theme.spacing(2),
    },
  }),
);

export default function PopOver(props:any) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Typography
        aria-owns={open ? 'mouse-over-popover' : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
      >
        <WarningRounded fontSize="large" color="primary"/>
      </Typography>
      <Popover
        id="mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={!!anchorEl}
        anchorEl={anchorEl}
        transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography>Asset: <span style={{fontWeight:"bold"}}>{props.unit}</span></Typography>
        <Typography>fToken: <span style={{fontWeight:"bold"}}>fpancake_{props.unit}</span></Typography>
        <Typography>APY <span style={{fontWeight:"bold"}}>{props.apy || 'NaN'}:</span></Typography>
        <Typography>
            <span style={{fontWeight:"bold"}}>{props.apy || '0%'}: </span>
            Liquidity Provider APY
        </Typography>
        <Typography>
            <span style={{fontWeight:"bold"}}>{props.autoHarvestedEcCakeLP || '0%'}: </span>
            Auto harvested ecCAKE_LP
        </Typography>
        <Typography>
            <span style={{fontWeight:"bold"}}>{props.tEXOReward || '0%'}: </span>
            tEXO rewards
        </Typography>
      </Popover>
    </Box>
  );
}
