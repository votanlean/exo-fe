import React from 'react';

import { useVaultStake } from 'hooks/useStake';
import Button from 'components/Button';

import { useStyles } from './styles';
import { getDecimals } from 'utils/decimalsHelper';
import { useNetwork } from 'state/hooks';
import { Box } from '@material-ui/core';

function StakeVaultAction(props: any) {
  const classes = useStyles();
  const { data, amountStakeNumber, onAction, onStakeComplete } = props || {};
  const {
    requestingContract: vaultContract,
    maxAmountStake,
    stakingToken,
  } = data || {};

  const isDisabled = (!amountStakeNumber|| amountStakeNumber > maxAmountStake || +amountStakeNumber === 0);

  const { onVaultStake, isLoading } = useVaultStake(vaultContract);
  const { id: chainId } = useNetwork();
  
  const handleConfirmStake = async () => {
    const decimals = getDecimals(stakingToken.decimals, chainId);

    //TODO: Please check these lines (With these, if we stake all, it's ok else it converts to wrong value)
    // const amount = normalizeTokenDecimal(amountStakeNumber,+decimals);
    // console.log('amount converted: ', amount.toString())
    await onVaultStake(amountStakeNumber, decimals);
    onAction();
    onStakeComplete();
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
