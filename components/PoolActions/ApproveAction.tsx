import React from 'react';
import { Box, CircularProgress } from '@material-ui/core';

import Button from 'components/Button';
import { useApprove } from 'hooks/useApprove';
import { useERC20 } from 'hooks/useContract';
import { getAddress } from 'utils/addressHelpers';

import { useStyles } from './styles';

function ApproveAction(props: any) {
  const classes = useStyles();
  const { disabled, data } = props || {};
  const { stakingToken, orchestratorContract, id } = data || {};

  const tokenContract = useERC20(
    stakingToken.address ? getAddress(stakingToken.address) : '',
  );
  const { onApprove, isLoading } = useApprove(
    tokenContract,
    orchestratorContract,
    id,
  );

  return (
    <Box>
      <Button
        className={classes.button}
        onClick={onApprove}
        disabled={isLoading || disabled}
      >
        Approve
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

export default ApproveAction;
