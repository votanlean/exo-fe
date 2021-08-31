import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import Cookies from 'universal-cookie';

import Button from 'components/Button';
import { useStakeAllECAsset } from 'hooks/useStake';
import { isAddress } from 'utils/web3';
import rot13 from 'utils/encode';

import { useStyles } from './styles';
import { getDecimals } from 'utils/decimalsHelper';
import { useNetwork } from 'state/hooks';

function StakeAllAction(props: any) {
  const classes = useStyles();
  const { disabled, data } = props || {};
  const {
    id,
    requestingContract,
    amountStake,
    refStake,
    stakingToken,
    sender
  } = data || {};

  const { onStake, isLoading } = useStakeAllECAsset(requestingContract, id, sender);
  const { id: chainId } = useNetwork();

  const handleConfirmStake = async () => {
    let ref;

    if (refStake) {
      const cookies = new Cookies();
      if (cookies.get('ref')) {
        if (isAddress(rot13(cookies.get('ref')))) {
          ref = rot13(cookies.get('ref'));
        }
      } else {
        ref = '0x0000000000000000000000000000000000000000';
      }
    }
    const decimals = getDecimals(stakingToken.decimals, chainId);
    await onStake(amountStake, ref, decimals);
  };

  return (
    <Box>
      <Button
        className={classes.button}
        onClick={handleConfirmStake}
        disabled={disabled || isLoading}
      >
        Stake All
      </Button>
    </Box>
  );
}

export default StakeAllAction;
