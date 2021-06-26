import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import Cookies from 'universal-cookie';

import Button from 'components/Button';
import { StakeDialog } from 'components/Dialogs';
import { useStake } from 'hooks/useStake';
import { isAddress } from 'utils/web3';
import rot13 from 'utils/encode';

import { useStyles } from './styles';

function StakeAction(props: any) {
  const classes = useStyles();
  const { disabled, data } = props || {};
  const {
    id,
    orchestratorContract,
    symbol,
    depositFee,
    maxAmountStake,
    refStake,
  } = data || {};
  const [openStakeDialog, setOpenStakeDialog] = useState(false);

  const { onStake, isLoading } = useStake(orchestratorContract, id);

  const handleConfirmStake = async (amount) => {
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
    await onStake(amount, ref);
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
      />
    </Box>
  );
}

export default StakeAction;
