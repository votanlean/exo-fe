import React, { useState } from 'react';
import { Box, CircularProgress } from '@material-ui/core';

import Button from 'components/Button';
import ConnectPopup from 'components/ConnectPopup';
import { useApprove } from 'hooks/useApprove';
import { useERC20 } from 'hooks/useContract';
import { getAddress } from 'utils/addressHelpers';

import { useStyles } from './styles';
import { useNetwork } from 'state/hooks';

function ApproveAction(props: any) {
  const classes = useStyles();
  const { disabled, data, buttonClasses, onApprove } = props || {};
  const { stakingToken, requestingContract, account } = data || {};
  const [openPopup, setOpenPopup] = useState(false);
  const { id: chainId } = useNetwork();
  const handleConnectPopup = () => {
    setOpenPopup(!openPopup);
  };

  const tokenContract = useERC20(
    stakingToken.address ? getAddress(stakingToken.address, chainId) : '',
  );

  const { approve, isLoading } = useApprove({
    tokenContract,
    requestingContract,
		onApprove
  });

  if (!account) {
    return (
      <Box>
        <Button
          className={`${classes.button} ${buttonClasses}`}
          onClick={handleConnectPopup}
        >
          Unlock Wallet
        </Button>

        <ConnectPopup onOpen={openPopup} onCloseDialog={handleConnectPopup} />
      </Box>
    );
  }

  return (
    <Box>
      <Button
        className={`${classes.button} ${buttonClasses}`}
        onClick={approve}
        disabled={isLoading || disabled}
      >
        Approve
        {isLoading ? (
          <CircularProgress
            size={15}
            classes={{ colorPrimary: classes.colorLoading }}
            style={{ marginLeft: '10px' }}
          />
        ) : null}
      </Button>
    </Box>
  );
}

export default ApproveAction;
