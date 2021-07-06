import React from 'react';
import { Box, CircularProgress } from '@material-ui/core';

import Button from 'components/Button';
import { useHarvest } from 'hooks/useHarvest';

import { useStyles } from './styles';

function ClaimRewardsAction(props: any) {
  const classes = useStyles();
  const { disabled, data } = props || {};
  const { orchestratorContract, id, refStake } = data || {};

  const { onReward, isLoading } = useHarvest(orchestratorContract, id);
  const handleClaimReward = async () => {
    let ref;

    if (refStake) {
      ref = '0x0000000000000000000000000000000000000000';
    }
    await onReward(ref);
  };

  return (
    <Box>
      <Button
        className={classes.button}
        onClick={handleClaimReward}
        disabled={isLoading || disabled}
      >
        Claim Rewards
        {isLoading ? (
          <CircularProgress
            size={15}
            classes={{ colorPrimary: classes.colorLoading }}
            style={{ marginLeft: '10px' }}
          />
        ) : null}
      </Button>
    </Box>
  );
}

export default ClaimRewardsAction;
