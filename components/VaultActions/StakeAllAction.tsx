import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import Cookies from 'universal-cookie';

import Button from 'components/Button';
import { StakeDialog } from 'components/Dialogs';
import { useStake } from 'hooks/useStake';
import { isAddress } from 'utils/web3';
import rot13 from 'utils/encode';

import { useStyles } from './styles';
import { getDecimals } from 'utils/decimalsHelper';
import { useNetwork } from 'state/hooks';

function StakeAllAction(props: any) {
  const classes = useStyles();
  const { disabled, data, stakingTokenPrice } = props || {};
  const {
    id,
    requestingContract,
    symbol,
    depositFee,
    maxAmountStake,
    refStake,
    stakingToken,
  } = data || {};
  const [openStakeDialog, setOpenStakeDialog] = useState(false);

  const { onStake, isLoading } = useStake(requestingContract, id);
  const { id: chainId } = useNetwork();

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
    const decimals = getDecimals(stakingToken.decimals, chainId);
    await onStake(amount, ref, decimals);
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
        Stake For tEXO Reward
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
        stakingTokenPrice={stakingTokenPrice}
      />
    </Box>
  );
}

export default StakeAllAction;
