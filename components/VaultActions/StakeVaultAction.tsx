import React from 'react';

import { useVaultStake } from 'hooks/useStake';
import Button from 'components/Button';

import { useStyles } from './styles';
import { getDecimals } from 'utils/decimalsHelper';
import { useNetwork } from 'state/hooks';
import { Box } from '@material-ui/core';

function StakeVaultAction(props: any) {
  const classes = useStyles();
  const { data, onAction, onStakeComplete } = props || {};
  const {
    requestingContract: vaultContract,
    maxAmountStake,
    stakingToken,
    amountStakeNumber,
  } = data || {};

  const isDisabled = (!amountStakeNumber|| amountStakeNumber > maxAmountStake);
  
  const { onVaultStake, isLoading } = useVaultStake(vaultContract);
  const { id: chainId } = useNetwork();
  
  const handleConfirmStake = async () => {
    const decimals = getDecimals(stakingToken.decimals, chainId);
    await onVaultStake(amountStakeNumber, decimals);
    console.log(amountStakeNumber)
    onStakeComplete();
    onAction();
  };

  return (
    <Box>
      <Button
        className={classes.button}
        onClick={handleConfirmStake}
        disabled={isDisabled || isLoading}
      >
        Deposit
      </Button>
    </Box>
  );
}

export default StakeVaultAction;
