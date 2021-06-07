import React, { useState } from 'react';
import { Box, IconButton, Link, Typography } from '@material-ui/core';

import Button from '../Button';

import { useStyles } from './styles';
import { ROIDialog } from 'components/Dialogs';

function FaangItem({ pool }) {
  const { icon } = pool;
  const classes = useStyles();
  const [openRoiDialog, setOpenRoiDialog] = useState(false);

  const onToggleRoiDialog = () => {
    setOpenRoiDialog(!openRoiDialog);
  };

  return (
    <>
      <Box className={classes.root}>
        <Box className={classes.header}>
          <img src={icon} className={classes.img} />
        </Box>
        <Box className={classes.rowItem}>
          <Box className={classes.flexRow}>
            <Typography
              component="p"
              className={classes.pTitle}
              style={{ color: '#6A98C9' }}
            >
              APR
            </Typography>
            <Box display="flex" alignItems="center">
              <IconButton
                className={classes.iconButton}
                onClick={onToggleRoiDialog}
              >
                <img src="/static/images/calculate.svg" />
              </IconButton>
              <Typography
                component="p"
                className={classes.pTitle}
                style={{ color: '#6A98C9' }}
              >
                N/A
              </Typography>
            </Box>
          </Box>
          <Box className={classes.flexRow}>
            <Typography
              component="p"
              className={classes.pTitle}
              style={{ color: '#6A98C9' }}
            >
              My Stake
            </Typography>
            <Typography
              component="p"
              className={classes.pTitle}
              style={{ color: '#6A98C9' }}
            >
              0.0000 tEXO
            </Typography>
          </Box>
          <Box className={classes.flexRow}>
            <Typography
              component="p"
              className={classes.pTitle}
              style={{ color: '#6A98C9' }}
            >
              Deposit Fee
            </Typography>
            <Typography
              component="p"
              className={classes.pTitle}
              style={{ color: '#6A98C9' }}
            >
              0%
            </Typography>
          </Box>
          <Box className={classes.flexRow}>
            <Typography
              component="p"
              className={classes.pTitle}
              style={{ color: '#6A98C9' }}
            >
              My Rewards
            </Typography>
            <Typography
              component="p"
              className={classes.pTitle}
              style={{ color: '#6A98C9' }}
            >
              0.0000 FAANG
            </Typography>
          </Box>
          <Box className={classes.flexRow}>
            <Typography component="p" className={classes.pTitle}>
              Total Staked
            </Typography>
            <Typography component="p" className={classes.pTitle}>
              0.0000 tEXO
            </Typography>
          </Box>
          <Box className={classes.flexRow}>
            <Typography component="p" className={classes.pTitle}>
              Wallet Balance
            </Typography>
            <Typography component="p" className={classes.pTitle}>
              0.0000 tEXO
            </Typography>
          </Box>
        </Box>
        <Box
          className={classes.rowItem}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box>
            <Box className={classes.flexRow}>
              <Typography
                component="p"
                className={classes.pTitle}
                style={{ color: '#6A98C9' }}
              >
                Deposit:
              </Typography>
              <Typography
                component="p"
                className={classes.pTitle}
                style={{ color: '#6A98C9' }}
              >
                tEXO
              </Typography>
            </Box>
            <Box className={classes.flexRow}>
              <Typography
                component="p"
                className={classes.pTitle}
                style={{ color: '#6A98C9' }}
              >
                Total liquidity:
              </Typography>
              <Typography
                component="p"
                className={classes.pTitle}
                style={{ color: '#6A98C9' }}
              >
                $0.00
              </Typography>
            </Box>
            <Link
              href="https://bscscan.com/address/0x52261b4262087500b0c5e4604b030a917303b346"
              target="_blank"
            >
              <Typography
                component="p"
                style={{ fontSize: '19px', color: '#007EF3' }}
              >
                View on Bscan
              </Typography>
            </Link>
          </Box>
          <Button className={classes.button}>Approve</Button>
        </Box>
      </Box>
      <ROIDialog open={openRoiDialog} onClose={onToggleRoiDialog} />
    </>
  );
}

export default FaangItem;
