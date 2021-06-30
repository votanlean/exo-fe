import React, { useState } from 'react';
import { Box } from '@material-ui/core';

import Button from 'components/Button';
import { WithdrawDialog } from 'components/Dialogs';
import { useUnstake } from 'hooks/useUnstake';

import { useStyles } from './styles';
import { useNetwork } from 'state/hooks';
import { getDecimals } from 'utils/decimalsHelper';

function WithdrawAction(props: any) {
  const classes = useStyles();
  const { disabled, data } = props || {};
  const {
    id,
    orchestratorContract,
    symbol,
    maxAmountWithdraw,
    onPoolStateChange,
    stakingToken,
  } = data || {};
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);

  const { onUnstake, isLoading } = useUnstake(orchestratorContract, id);
  const { id: chainId } = useNetwork();

  const handleConfirmWithdraw = async (amount) => {
    const decimals = getDecimals(stakingToken.decimals, chainId);
    await onUnstake(amount, decimals);
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
        decimals={stakingToken.decimals}
      />
    </Box>
  );
}

export default WithdrawAction;
