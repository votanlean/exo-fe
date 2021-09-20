import React, { useState } from 'react';
import { Box } from '@material-ui/core';

import Button from 'components/Button';
import { useVaultUnstake, useUnstake } from 'hooks/useUnstake';

import { useStyles } from './styles';
import { useNetwork } from 'state/hooks';
import { getDecimals } from 'utils/decimalsHelper';
import { normalizeTokenDecimal } from 'utils/bigNumber';
import BigNumber from 'bignumber.js';

function WithdrawVaultAction(props: any) {
  const classes = useStyles();
  const { 
    disabled,
    data,
    onAction,
    onWithdrawComplete,
    amountWithdrawNumber,
    unstakeIfNeeded,
    onOpenOverLay,
    onCloseOverLay
  } = props || {};
  const {
    ecAssetPoolId,
    requestingContract: vaultContract,
    texoOrchestrator,
    inVaultBalance,
    stakingToken,
  } = data || {};

  const { onVaultUnstake, isLoading } = useVaultUnstake(vaultContract);
  const { onUnstake } = useUnstake(texoOrchestrator, ecAssetPoolId);
  const { id: chainId } = useNetwork();

  const decimals = getDecimals(stakingToken.decimals, chainId);
  const amount = new BigNumber(amountWithdrawNumber);

  const ecAssetInVaultBalance = normalizeTokenDecimal(inVaultBalance, +decimals);

  const handleConfirmWithdraw = async () => {
    onOpenOverLay();
    if (unstakeIfNeeded && amount.gt(ecAssetInVaultBalance)) {
      const missingPart = amount.minus(ecAssetInVaultBalance);
      await onUnstake(missingPart.toString(), decimals);
      await onVaultUnstake(amount.toString(), decimals);
    } else {
      await onVaultUnstake(amount.toString(), decimals);
    }
    onAction();
    onWithdrawComplete();
    onCloseOverLay();
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
