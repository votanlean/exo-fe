import React, { useState } from 'react';
import { Box } from '@material-ui/core';

import Button from 'components/Button';
import { WithdrawDialog } from 'components/Dialogs';
import { useVaultUnstake, useEmergencyWithdraw } from 'hooks/useUnstake';

import { useStyles } from './styles';
import { useNetwork } from 'state/hooks';
import { getDecimals } from 'utils/decimalsHelper';
import { normalizeTokenDecimal } from 'utils/bigNumber';

function WithdrawVaultAction(props: any) {
  const classes = useStyles();
  const { disabled, data, onAction, amountWithdrawNumber } = props || {};
  const {
    ecAsserPoolId, //currently, i use this for demo, i will refactor later
    requestingContract: vaultContract,
    texoOrchestrator, //currently, i use this for demo, i will refactor later
    symbol,
    ecAssetStakedBalance,
    stakingToken,
  } = data || {};
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);

  const { onVaultUnstake, isLoading } = useVaultUnstake(vaultContract);
  const { onEmergencyWithdraw } = useEmergencyWithdraw(texoOrchestrator, ecAsserPoolId);
  const { id: chainId } = useNetwork();

  const handleConfirmWithdraw = async () => {
    const decimals = getDecimals(stakingToken.decimals, chainId);
    // await onEmergencyWithdraw();
    // //must replace amount here to right value, just use maxAmountWithdraw for demostration
    // const amount = normalizeTokenDecimal(ecAssetStakedBalance, +decimals);
    // await onVaultUnstake(amount, decimals);
  
    const amount = normalizeTokenDecimal(amountWithdrawNumber, +decimals);
    console.log('amount', amountWithdrawNumber.toString());
    await onVaultUnstake(amountWithdrawNumber, decimals);

    onAction();
  };

  const handleToggleWithdraw = () => {
    setOpenWithdrawDialog(!openWithdrawDialog);
  };

  return (
    <Box>
      <Button
        className={classes.button}
        onClick={handleConfirmWithdraw}
        disabled={disabled || isLoading}
      >
        Withdraw
      </Button>
    </Box>
  );
}

export default WithdrawVaultAction;
