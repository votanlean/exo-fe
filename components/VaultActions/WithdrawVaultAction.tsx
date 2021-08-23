import React, { useState } from 'react';
import { Box } from '@material-ui/core';

import Button from 'components/Button';
import { WithdrawDialog } from 'components/Dialogs';
import { useVaultUnstake } from 'hooks/useUnstake';

import { useStyles } from './styles';
import { useNetwork } from 'state/hooks';
import { getDecimals } from 'utils/decimalsHelper';

function WithdrawAction(props: any) {
  const classes = useStyles();
  const { disabled, data, onAction } = props || {};
  const {
    requestingContract: vaultContract,
    symbol,
    maxAmountWithdraw,
    stakingToken,
  } = data || {};
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);

  const { onVaultUnstake, isLoading } = useVaultUnstake(vaultContract);
  const { id: chainId } = useNetwork();

  const handleConfirmWithdraw = async (amount) => {
    const decimals = getDecimals(stakingToken.decimals, chainId);
    await onVaultUnstake(amount, decimals);
    onAction();
  };

  const handleToggleWithdraw = () => {
    setOpenWithdrawDialog(!openWithdrawDialog);
  };

  return (
    <Box>
      <Button
        className={classes.button}
        onClick={handleToggleWithdraw}
        disabled={disabled}
      >
        Withdraw
      </Button>
      <WithdrawDialog
        open={openWithdrawDialog}
        title="Withdraw"
        onClose={handleToggleWithdraw}
        onConfirm={handleConfirmWithdraw}
        unit={symbol}
        maxAmount={maxAmountWithdraw}
        isLoading={isLoading}
        decimals={stakingToken.decimals}
      />
    </Box>
  );
}

export default WithdrawAction;
