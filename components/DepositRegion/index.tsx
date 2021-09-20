import React, { useState } from 'react';
import {
    Box,
    Button,
    Divider,
    InputAdornment,
    TextField,
    Typography,
    useMediaQuery,
    Checkbox
} from '@material-ui/core';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import BigNumber from 'bignumber.js';

import {
    ApproveAction,
} from 'components/PoolActions';

import { useNetwork } from 'state/hooks';

import { normalizeTokenDecimal } from 'utils/bigNumber';
import { getDecimals } from 'utils/decimalsHelper';

import { useStyles } from './styles';
import StakeVaultAction from 'components/VaultActions/StakeVaultAction';
import NumberFormatCustom from 'components/NumberFormatCustom/index';

function DepositRegion(props: any) {
    const {
        yieldFarmData = {},
        data,
        onApprove,
        onAction,
        onHandleAutoStake,
        onOpenOverLay,
        onCloseOverLay
    } = props || {};

    const {
        symbol,
        pid: vaultId,
        decimals,
        userData = {},
    } = yieldFarmData;

    const classes = useStyles();
    const [amountStakeNumber, setAmountStakeNumber] = useState(null);
    const [isAutoStake, setIsAutoStake] = useState(true);

    const isTablet = useMediaQuery('(max-width: 768px)');
    const isMobile = useMediaQuery('(max-width: 600px)');

    const {
        allowance,
        balance,
        earnings: pendingReward,
    } = userData;

    const isAlreadyApproved = new BigNumber(allowance).toNumber() > 0;
    const { id: chainId } = useNetwork();
    const decimal = getDecimals(decimals, chainId);

    const onChangeAmountStakeNumber = (e) => {
        const val = e.target.value;
        if (val >= 0) {
            if (+val > +balance) {
                setAmountStakeNumber(balance);
            } else {
                setAmountStakeNumber(val);
            }
        } else {
            setAmountStakeNumber(0);
        }
    }

    const onClickMax = () => {
        const amount = normalizeTokenDecimal(new BigNumber(balance), +decimal);
        setAmountStakeNumber(amount.toString(10));
    }

    const onStakeComplete = (newBalance) => {
        setAmountStakeNumber('');
        if (isAutoStake) {
            onHandleAutoStake(isAutoStake, newBalance);
        } else {
            onCloseOverLay();
        }
    }

    const onClickAutoStake = () => {
        setIsAutoStake(!isAutoStake);
    }

    return (
        <Box
            display="flex"
            flexDirection={isTablet ? "column" : "row"}
            marginBottom="10px"
            alignItems={(isTablet || isMobile) ? "" : "center"}
        >
            <Box
                width={(isTablet || isMobile) ? "100%" : "47%"}
            >
                <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                >
                    <Typography>Wallet Balance</Typography>
                    <Typography>
                        {normalizeTokenDecimal(balance, +decimal).toFixed(4)}
                    </Typography>
                </Box>
                <TextField
                    value={amountStakeNumber || ''}
                    variant="outlined"
                    placeholder="0"
                    fullWidth
                    InputProps={{
                        inputComponent: NumberFormatCustom,
                        startAdornment: <InputAdornment position="start">{symbol}</InputAdornment>,
                        endAdornment: <Button color="primary" onClick={onClickMax}>Max</Button>
                    }}
                    onChange={onChangeAmountStakeNumber}
                />
            </Box>
            <Divider orientation="vertical" flexItem={true} variant="middle" />
            {isAlreadyApproved ?
                <>
                    <Box className={classes.buttonBoxItem} marginTop="-3px" flex={1}>
                        <FormControlLabel
                            control={<Checkbox checked={isAutoStake} onChange={onClickAutoStake} />}
                            label="Stake For tEXO Reward"
                        />
                        <StakeVaultAction
                            amountStakeNumber={amountStakeNumber}
                            data={data}
                            pid={vaultId}
                            onStakeComplete={onStakeComplete}
                            onAction={onAction}
                            isAutoStake={isAutoStake}
                            onOpenOverLay={onOpenOverLay}
                            onCloseOverLay={onCloseOverLay}
                        />
                    </Box>
                </>
                : null}
            {!isAlreadyApproved ? (
                <Box className={classes.buttonBoxItem} flex={1}>
                    <ApproveAction
                        data={data}
                        disabled={isAlreadyApproved}
                        onApprove={onApprove}
                    />
                </Box>
            ) : null}
        </Box>
    );
}

export default DepositRegion;
