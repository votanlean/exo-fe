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

import { useNetwork } from 'state/hooks';

import { normalizeTokenDecimal } from 'utils/bigNumber';
import { getDecimals } from 'utils/decimalsHelper';

import { useStyles } from './styles';
import NumberFormatCustom from 'components/NumberFormatCustom/index';
import WithdrawVaultAction from 'components/VaultActions/WithdrawVaultAction';

function WithdrawRegion(props: any) {
    const {
        yieldFarmData = {},
        data,
        onAction
    } = props || {};
    const [amountWithdrawNumber, setAmountWithdrawNumber] = useState(null);
    const [unstakeIfNeeded, setUnstakeIfNeeded] = useState(false);

    const {
        symbol,
        pid: vaultId,
        decimals,
        userData = {},
    } = yieldFarmData;

    const {
        inVaultBalance,
        ecAssetStakedBalance
    } = data;

    const { id: chainId } = useNetwork();
    const decimal = getDecimals(decimals, chainId);

    const ecAssetInVaultBalance = normalizeTokenDecimal(inVaultBalance, +decimal);
    const ecAssetStaked = normalizeTokenDecimal(ecAssetStakedBalance, +decimal);

    const balanceToWithdraw = unstakeIfNeeded ? (ecAssetInVaultBalance.plus(ecAssetStaked)) : (ecAssetInVaultBalance);
    const isDisabled = !((amountWithdrawNumber > 0) && (balanceToWithdraw > 0));

    const classes = useStyles();

    const isTablet = useMediaQuery('(max-width: 768px)');

    const {
        allowance,
        earnings: pendingReward,
    } = userData;

    const isAlreadyApproved = new BigNumber(allowance).toNumber() > 0;

    const onChangeAmountWithdrawNumber = (e) => {
        const val = e.target.value;
        if (val >= 0) {
            if (+val > balanceToWithdraw.toPrecision()) {
                setAmountWithdrawNumber(balanceToWithdraw.toPrecision(7));
            } else {
                setAmountWithdrawNumber(val);
            }
        } else {
            setAmountWithdrawNumber(0);
        }
    }

    const onClickMax = () => {
        setAmountWithdrawNumber(balanceToWithdraw.toPrecision(7));
    }

    const onWithdrawComplete = () => {
        setAmountWithdrawNumber('');
    }

    const onCheckUnstakeIfNeeded = (e) => {
        setUnstakeIfNeeded(e.target.checked);
    }

    return (
        <Box
            display="flex"
            flexDirection={isTablet ? "column" : "row"}
            marginBottom="10px"
            alignItems="center"
        >
            <Box
                width="47%"
            >
                <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                >
                    <Typography>Balance</Typography>
                    <Typography>
                        {balanceToWithdraw.toPrecision(7)}
                    </Typography>
                </Box>
                <TextField
                    value={amountWithdrawNumber || ''}
                    variant="outlined"
                    placeholder="0"
                    fullWidth
                    InputProps={{
                        inputComponent: NumberFormatCustom,
                        startAdornment: <InputAdornment position="start">{symbol}</InputAdornment>,
                        endAdornment: <Button color="primary" onClick={onClickMax}>Max</Button>
                    }}
                    onChange={onChangeAmountWithdrawNumber}
                />
            </Box>
            <Divider orientation="vertical" flexItem={true} variant="middle" />
            {isAlreadyApproved ?
                <>
                    <Box className={classes.buttonBoxItem} marginTop="-3px" flex={1}>
                        <FormControlLabel
                            control={<Checkbox checked={unstakeIfNeeded} onChange={onCheckUnstakeIfNeeded} />}
                            label="Unstake if needed"
                        />
                        <WithdrawVaultAction
                            unstakeIfNeeded={unstakeIfNeeded}
                            amountWithdrawNumber={amountWithdrawNumber}
                            data={data}
                            disabled={isDisabled}
                            onAction={onAction}
                            onWithdrawComplete={onWithdrawComplete}
                        />
                    </Box>
                </>
                : null}
        </Box>
    );
}

export default WithdrawRegion;
