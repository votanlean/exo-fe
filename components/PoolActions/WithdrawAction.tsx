import React, { useState } from 'react';
import { Box } from '@material-ui/core';

import Button from 'components/Button';
import { WithdrawDialog } from 'components/Dialogs';
import { useUnstake } from 'hooks/useUnstake';

import { useStyles } from './styles';

function WithdrawAction(props: any) {
  const classes = useStyles();
  const { disabled, data } = props || {};
  const {
    id,
    orchestratorContract,
    symbol,
    maxAmountWithdraw,
    onPoolStateChange,
  } = data || {};
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);

  const { onUnstake, isLoading } = useUnstake(orchestratorContract, id);

  const handleConfirmWithdraw = async (amount) => {
    await onUnstake(amount);
    onPoolStateChange && onPoolStateChange();
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
      />
    </Box>
  );
}

export default WithdrawAction;
