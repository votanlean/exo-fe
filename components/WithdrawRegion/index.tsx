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
        onAction,
        onOpenOverLay,
        onCloseOverLay
    } = props || {};
    const [amountWithdrawNumber, setAmountWithdrawNumber] = useState(null);
    const [unstakeIfNeeded, setUnstakeIfNeeded] = useState(true);

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

    const ecAssetInVaultBalance = new BigNumber(inVaultBalance);
    const ecAssetStaked = new BigNumber(ecAssetStakedBalance);

    const balanceToWithdraw = unstakeIfNeeded ? normalizeTokenDecimal(ecAssetInVaultBalance.plus(ecAssetStaked), +decimal) : normalizeTokenDecimal(ecAssetInVaultBalance, +decimal);
    const isDisabled = !((amountWithdrawNumber > 0) && (balanceToWithdraw > 0));

    const classes = useStyles();

    const isTablet = useMediaQuery('(max-width: 768px)');
    const isMobile = useMediaQuery('(max-width: 600px)');

    const {
        allowance,
        earnings: pendingReward,
    } = userData;

    const isAlreadyApproved = new BigNumber(allowance).toNumber() > 0;

    const onChangeAmountWithdrawNumber = (e) => {
        const val = e.target.value;
        if (val >= 0) {
            if (+val > balanceToWithdraw.toPrecision()) {
                setAmountWithdrawNumber(balanceToWithdraw.toString());
            } else {
                setAmountWithdrawNumber(val);
            }
        } else {
            setAmountWithdrawNumber(0);
        }
    }

    const onClickMax = () => {
        setAmountWithdrawNumber(balanceToWithdraw.toString(10));
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
                            onOpenOverLay={onOpenOverLay}
                            onCloseOverLay={onCloseOverLay}
                        />
                    </Box>
                </>
                : null}
        </Box>
    );
}

export default WithdrawRegion;
