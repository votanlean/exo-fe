import React from 'react';

import { useVaultStake } from 'hooks/useStake';
import Button from 'components/Button';

import { useStyles } from './styles';
import { getDecimals } from 'utils/decimalsHelper';
import { useNetwork } from 'state/hooks';
import { Box } from '@material-ui/core';
import { useWeb3React } from '@web3-react/core';
import fetchUserData from 'state/yield/helpers/fetchUserData';
import { getYieldFarms } from 'utils/yieldFarmHelpers';

function StakeVaultAction(props: any) {
  const classes = useStyles();
  const { data, amountStakeNumber, onAction, onStakeComplete, pid } = props || {};
  const {
    requestingContract: vaultContract,
    maxAmountStake,
    stakingToken,
  } = data || {};
  const { account } = useWeb3React();

  const isDisabled = (!amountStakeNumber || (+amountStakeNumber > +maxAmountStake) || (+amountStakeNumber === 0));

  const { onVaultStake, isLoading } = useVaultStake(vaultContract);
  const { id: chainId } = useNetwork();

  const handleConfirmStake = async () => {
    const decimals = getDecimals(stakingToken.decimals, chainId);
    const yieldFarms = getYieldFarms(chainId);

    await onVaultStake(amountStakeNumber, decimals);
    //TODO: Need refactor
    const yieldFarmUserData = await fetchUserData(yieldFarms, account, chainId);
    const yieldPool = yieldFarmUserData.filter((yieldPool) => {
      return yieldPool.pid === +pid
    })
    await onAction();
    onStakeComplete(yieldPool[0].userData.inVaultBalance);
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