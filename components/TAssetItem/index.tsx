import React, { useEffect, useMemo, useState } from 'react';
import { Avatar, Box, Link, Typography } from '@material-ui/core';

import { useStyles } from './styles';

function TAssetItem(props: any) {
  const classes = useStyles();
  const { data } = props || {};
  const { icon, symbol, desc, fee, status, price, link } = data || {};

  const statusColor = useMemo(() => {
    switch (status) {
      case 'onboarding':
        return 'rgb(255,215,0)';
      case 'pause':
        return 'rgb(252, 135, 56)';
      default:
        return 'rgb(237, 30, 255)';
    }
  }, [status]);

  return (
    <Link
      href="#"
      onClick={(e) => e.preventDefault()}
      target="_blank"
      rel="noopener"
      underline="none"
      className={classes.root}
    >
      <Box className={classes.box}>
        <Box className={classes.divide} />
        <Box display="flex" alignItems="center">
          <Avatar src={icon} />
          <Box marginLeft="25px">
            <Typography variant="h6" className={classes.symbol}>
              {symbol}
            </Typography>
            <Typography variant="caption" className={classes.priceLabel}>
              USD PRICE:
            </Typography>
            <Typography variant="body1" component="p" className={classes.price}>
              {price}
            </Typography>
          </Box>
        </Box>

        <Box display="flex" alignItems="center">
          <Typography variant="body2" component="p" className={classes.desc}>
            {desc}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="caption" className={classes.fee}>
            FEE: {fee}
          </Typography>
          <Box display="flex" alignItems="center">
            <Typography
              component="span"
              className={classes.dot}
              style={{ background: statusColor }}
            />
            <Typography
              variant="caption"
              className={classes.status}
              style={{ color: statusColor }}
            >
              {status}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Link>
  );
}

export default TAssetItem;
