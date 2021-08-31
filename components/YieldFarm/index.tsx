import React, { Fragment, useCallback, useState } from 'react';
import {
  Box,
  Button,
  Collapse,
  Divider,
  InputAdornment,
  TableCell,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  Checkbox
} from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp, Launch, WarningRounded } from '@material-ui/icons';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import BigNumber from 'bignumber.js';

import {
  ApproveAction,
  ClaimRewardsAction,
  RoiAction,
} from 'components/PoolActions';

import { useNetwork } from 'state/hooks';

import { getAddress } from 'utils/addressHelpers';
import { normalizeTokenDecimal } from 'utils/bigNumber';
import { getDecimals } from 'utils/decimalsHelper';

import { useStyles } from './styles';
import { numberWithCommas } from 'utils/numberWithComma';
import { useVaultContract } from 'hooks/useContract';
import StakeVaultAction from 'components/VaultActions/StakeVaultAction';
import WithdrawVaultAction from 'components/VaultActions/WithdrawVaultAction';
import NumberFormatCustom from 'components/NumberFormatCustom/index';
import PopOver from 'components/PopOver';
import StakeAllAction from 'components/VaultActions/StakeAllAction';

interface IYieldFarmProps {
  farm: any;
}

function YieldFarm(props: any) {
  const {
    yieldFarmData = {},
    stakingTokenPrice,
    // tEXOPrice,
    onPoolStateChange,
    selectedAccount,
    onApprove,
    onAction
  } = props || {};

  const {
    icon,
    title,
    symbol,
    pid: vaultId,
    address,
    decimals,
    depositFeeBP,
    userData = {},
    // lpTotalInQuoteToken = BIG_ZERO,
    // allocPoint,
    vaultSymbol,
    underlying,
    underlyingVaultBalance,
    strategy = {},
  } = yieldFarmData;

  const { address: strategyAddress } = strategy;

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [amountStakeNumber, setAmountStakeNumber] = useState(null);

  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 600px)');

  const {
    allowance,
    stakedBalance,
    balance,
    inVaultBalance,
    earnings: pendingReward,
  } = userData;

  const canWithdraw = new BigNumber(inVaultBalance).toNumber() > 0;
  const isAlreadyApproved = new BigNumber(allowance).toNumber() > 0;
  const { id: chainId, blockExplorerUrl, blockExplorerName } = useNetwork();
  const underlyingAddress = underlying.address;
  const vaultAddress = getAddress(address, chainId);
  const vaultContract = useVaultContract(vaultAddress);
  // const { tEXOPerBlock, totalAllocPoint } = useOrchestratorData();
  // const farmWeight = new BigNumber(allocPoint).div(
  //   new BigNumber(totalAllocPoint),
  // );
  const decimal = getDecimals(decimals, chainId);

  // const apr = getFarmApr(
  //   farmWeight,
  //   tEXOPrice,
  //   lpTotalInQuoteToken,
  //   normalizeTokenDecimal(tEXOPerBlock),
  //   chainId,
  // );
  const apr = null;

  const onAppove = useCallback(() => {
    onPoolStateChange();
  }, [onPoolStateChange]);

  const onChangeAmountStakeNumber = (e) => {
    const val = e.target.value;
    if (val >= 0) {
      if (val > balance) {
        setAmountStakeNumber(balance);
      } else {
        setAmountStakeNumber(val);
      }
    } else {
      setAmountStakeNumber(0);
    }
  }

  const onClickMax = () => {
    setAmountStakeNumber(balance);
  }

  const onStakeComplete = () => {
    setAmountStakeNumber('');
  }

  const dataButton = {
    id: vaultId,
    stakingToken: {
      address: underlying.address,
      decimals: underlying.decimals,
    },
    requestingContract: vaultContract,
    symbol,
    depositFee: depositFeeBP,
    maxAmountStake: balance,
    maxAmountWithdraw: inVaultBalance,
    onPoolStateChange,
    refStake: true,
    account: selectedAccount,
    amountStakeNumber
  };

  return (
    <Fragment>
      <TableRow className={classes.root} onClick={() => setOpen(!open)}>
        <TableCell style={{ padding: '24px 16px' }} component="th" scope="row">
          <Box display="flex" alignItems="center">
            <img src={icon} alt={title} className={classes.poolImg} />
            <Typography className={classes.poolTitle}>{title}</Typography>
          </Box>
        </TableCell>
        <TableCell
          style={{ padding: '24px 16px', paddingLeft: isTablet ? '0' : '16px' }}
        >
          <Typography variant="caption">APY</Typography>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" className={classes.label}>
              {apr ? `${apr}%` : 'N/A'}
            </Typography>
            {!isTablet ? (
              <RoiAction apr={apr} tokenPrice={stakingTokenPrice} />
            ) : null}
          </Box>
        </TableCell>
        {!isTablet && (
          <>
            <TableCell style={{ padding: '24px 16px' }}>
              <Typography variant="caption">Compounded Balance</Typography>
              <Typography variant="h6" className={classes.label}>
                {normalizeTokenDecimal(stakedBalance, +decimal).toFixed(8)}{' '}
                {symbol}
              </Typography>
            </TableCell>
          </>
        )}
        {!isTablet && (
          <>
            <TableCell style={{ padding: '24px 16px' }}>
              <Typography variant="caption">Deposits($)</Typography>
              <Typography variant="h6" className={classes.label}>
                {numberWithCommas(
                  normalizeTokenDecimal(
                    underlyingVaultBalance,
                    +getDecimals(underlying.decimals, chainId),
                  ).toFixed(2),
                )}
              </Typography>
            </TableCell>
          </>
        )}
        <TableCell style={{ padding: '24px 16px' }}>
          <Box display="flex" alignItems="center">
            {!isTablet ? (
              <Typography variant="caption">Details</Typography>
            ) : null}
            {open ? (
              <KeyboardArrowUp fontSize="small" />
            ) : (
              <KeyboardArrowDown fontSize="small" />
            )}
          </Box>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell className={classes.collapseRow} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              margin={1}
              paddingY="16px"
            >
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
                <Divider orientation="vertical" flexItem={true} variant="middle"/>
                {isAlreadyApproved ?
                  <>
                    <Box className={classes.buttonBoxItem} marginTop="-3px" flex={1}>
                      <FormControlLabel
                        control={<Checkbox checked={true}/>}
                        label="Stake for reward"
                      />
                      <StakeVaultAction data={dataButton} onStakeComplete={onStakeComplete} onAction={onAction} />
                    </Box>
                  </>
                  : null}
                {!isAlreadyApproved ? (
                  <Box className={classes.buttonBoxItem} flex={1}>
                    <ApproveAction
                      data={dataButton}
                      disabled={isAlreadyApproved}
                      onApprove={onApprove}
                    />
                  </Box>
                ) : null}
              </Box>
              <Divider orientation="horizontal" variant="fullWidth"/>
              <Box
                flex={1}
                display="flex"
                justifyContent="center"
                flexDirection={isTablet ? "column" : "row"}
                marginLeft={isTablet ? '0' : '20px'}
                marginTop="10px"
                marginBottom="10px"
              >
                <Box className={classes.rowDetail} width="33%" flexDirection="column">
                  <Typography>Your ecAsset in vault <span style={{fontWeight:"bold"}}>tCake-LP</span></Typography>
                  <Typography className={'text-right'}>
                    {normalizeTokenDecimal(inVaultBalance).toFixed(4)}{' '}
                    ecAsset
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem={true} variant="middle"/>
                <Box className={classes.buttonBoxItem} marginTop="-3px" flex={1}>
                  <StakeAllAction data={dataButton} disabled={!(inVaultBalance > 0)}/>
                </Box>
                <Divider orientation="vertical" flexItem={true} variant="middle"/>
                <Box className={classes.rowDetail} width="33%" flexDirection="column">
                  <Typography>Initial Deposit</Typography>
                  <Typography className={'text-right'}>
                    {normalizeTokenDecimal(inVaultBalance).toFixed(4)}{' '}
                    ecAsset
                  </Typography>
                </Box>
              </Box>
              <Divider orientation="horizontal" variant="fullWidth"/>
              <Box
                flex={1}
                display="flex"
                justifyContent="center"
                flexDirection={isTablet ? "column" : "row"}
                marginTop="10px"
                marginBottom="10px"
              >
                <Box
                  className={classes.rowDetail}
                  flex={1}
                  flexDirection="column"
                  width="25%"
                >
                  <Typography align="left">Vault Details</Typography>
                  <PopOver unit={symbol}/>
                </Box>
                <Divider orientation="vertical" flexItem={true} variant="middle"/>
                <Box
                  className={classes.rowDetail}
                  flex={1}
                  flexDirection="column"
                  width="25%"
                >
                  <Typography>Total <span style={{fontWeight:"bold"}}>tEXO</span> Earned</Typography>
                  <Typography className={'text-right'}>
                    {normalizeTokenDecimal(0).toFixed(4)}
                    {' tEXO'}
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem={true} variant="middle"/>
                  <Box className={classes.buttonBoxItem} flex={1} flexDirection="column">
                    <Typography align="center">tEXO Reward</Typography>
                    <ClaimRewardsAction data={dataButton} disabled />
                  </Box>
                <Divider orientation="vertical" flexItem={true} variant="middle"/>
                  <Box className={classes.buttonBoxItem} flex={1}>
                    <Typography align="center">Withdraw</Typography>
                    <WithdrawVaultAction data={dataButton} disabled={!canWithdraw} onAction={onAction} />
                  </Box>
              </Box>
              <Box paddingRight="10px">
                <Box>
                  <a
                    className={classes.linkDetail}
                    href={`${blockExplorerUrl}/address/${vaultAddress}`}
                    target="_blank"
                  >
                    View Vault on {blockExplorerName}{' '}
                    <Launch fontSize="small" />
                  </a>
                </Box>
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

export default YieldFarm;
