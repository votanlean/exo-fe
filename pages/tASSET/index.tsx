import React, { useState } from 'react';
import Head from 'next/head';
import { Box, Button, Grid, Typography } from '@material-ui/core';

import { tAssetData } from 'constant/tASSETData';
import TAssetItem from 'components/TAssetItem';

import { useStyles } from 'styles/pages/tAsset/styles';

const buttonData = [
  {
    id: 0,
    title: 'all',
  },
  {
    id: 1,
    title: 'crypto',
  },
  {
    id: 2,
    title: 'forex',
  },
  {
    id: 3,
    title: 'equities',
  },
  {
    id: 4,
    title: 'commodity',
  },
];

function tASSET() {
  const classes = useStyles();
  const [activeBtnId, setActiveBtnId] = useState(0);
  const [tAsset, setTAsset] = useState(tAssetData);

  const onButtonClick = (id, title) => {
    setActiveBtnId(id);
    const filters = tAssetData.filter((item) => item.filter === title);
    if (id === 0) {
      setTAsset(tAssetData);
    } else {
      setTAsset(filters);
    }
  };

  return (
    <>
      <Head>
        <title>tASSET</title>
      </Head>

      <Box className={`container ${classes.tassetContainer}`}>
        <Typography variant="h2" className={classes.title}>
          tASSET
        </Typography>
        <Typography variant="body2" component="p" className={classes.desc}>
          tASSET allows traders to have price exposure and trading opportunities
          to off-chain assets while enabling fractional ownership, open access
          and censorship resistance as any other cryptocurrency.
        </Typography>

        <Box className={classes.gridButton}>
          {buttonData.map((button) => (
            <Button
              key={button.id.toString()}
              disableRipple
              onClick={() => onButtonClick(button.id, button.title)}
              classes={{
                root: classes.button,
                label:
                  activeBtnId === button.id
                    ? classes.buttonLabelActive
                    : classes.buttonLabel,
              }}
            >
              {button.title}
            </Button>
          ))}
        </Box>

        <Grid spacing={4} container>
          {tAsset.map((item) => (
            <Grid key={item.id.toString()} xs={12} sm={12} md={4} item>
              <TAssetItem data={item} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
}

export default tASSET;
