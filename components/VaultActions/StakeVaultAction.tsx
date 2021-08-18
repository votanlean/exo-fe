import { useState } from 'react';

import { StakeDialog } from 'components/Dialogs';
import { useVaultStake } from 'hooks/useStake';
import Button from 'components/Button';


import { useStyles } from './styles';
import { getDecimals } from 'utils/decimalsHelper';
import { useNetwork } from 'state/hooks';
import { Box } from '@material-ui/core';

function StakeVaultAction(props: any) {
  const classes = useStyles();
  const { disabled, data, onAction } = props || {};
  const {
    requestingContract,
    symbol,
    depositFee,
    maxAmountStake,
    stakingToken,
  } = data || {};
  const [openStakeDialog, setOpenStakeDialog] = useState(false);

  const { onVaultStake, isLoading } = useVaultStake(requestingContract);
  const { id: chainId } = useNetwork();

  const handleConfirmStake = async (amount) => {
    const decimals = getDecimals(stakingToken.decimals, chainId);
    await onVaultStake(amount,decimals);
    onAction();
  };

  const handleToggleStake = () => {
    setOpenStakeDialog(!openStakeDialog);
  };

  return (
    <Box>
      <Button
        className={classes.button}
        onClick={handleToggleStake}
        disabled={disabled}
      >
        Stake
      </Button>
      <StakeDialog
        open={openStakeDialog}
        title="Stake"
        onClose={handleToggleStake}
        onConfirm={handleConfirmStake}
        unit={symbol}
        depositFee={depositFee}
        maxAmount={maxAmountStake}
        isLoading={isLoading}
        decimals={stakingToken.decimals}
      />
    </Box>
  );
}

export default StakeVaultAction;
