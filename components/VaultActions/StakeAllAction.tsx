import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import Cookies from 'universal-cookie';

import Button from 'components/Button';
import { useStakeAllECAsset } from 'hooks/useStake';
import { isAddress } from 'utils/web3';
import rot13 from 'utils/encode';

import { useStyles } from './styles';
import { getDecimals } from 'utils/decimalsHelper';
import { useNetwork } from 'state/hooks';
import { useApprove } from 'hooks/useApprove';
import { useERC20 } from 'hooks/useContract';
import { normalizeTokenDecimal } from 'utils/bigNumber';

function StakeAllAction(props: any) {
    const classes = useStyles();
    const { disabled, data, onApprove, onAction } = props || {};
    const {
        id,
        requestingContract,
        amountStake,
        refStake,
        stakingToken,
        ecAssetAllowance
    } = data || {};
    const { onStake, isLoading } = useStakeAllECAsset(requestingContract, id);
    const { id: chainId } = useNetwork();

    const tokenContract = useERC20(
        stakingToken.address ? stakingToken.address : '',
    );

    const { approve } = useApprove({
        tokenContract,
        requestingContract,
        onApprove
    });

    const handleConfirmStake = async () => {
        if (+ecAssetAllowance === 0) { //parse to Number
            approve();
        } else {
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
            const amount = normalizeTokenDecimal(amountStake, +decimals);
            await onStake(amount, ref, decimals);
            onAction();
        }
    };

    return (
        <Box>
            <Button
                className={classes.button}
                onClick={handleConfirmStake}
                disabled={disabled || isLoading}
            >
                Stake All
            </Button>
        </Box>
    );
}

export default StakeAllAction;
