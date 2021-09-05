import React, { Fragment, useCallback, useState } from 'react';
import {
  Box,
  Collapse,
  Divider,
  TableCell,
  TableRow,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp, Launch } from '@material-ui/icons';

import {
  ClaimRewardsAction,
  RoiAction,
} from 'components/PoolActions';

import { useNetwork } from 'state/hooks';

import { getAddress } from 'utils/addressHelpers';
import { normalizeTokenDecimal } from 'utils/bigNumber';
import { getDecimals } from 'utils/decimalsHelper';

import { useStyles } from './styles';
import { numberWithCommas } from 'utils/numberWithComma';
import { useERC20, useOrchestratorContract, useVaultContract } from 'hooks/useContract';
import PopOver from 'components/PopOver';
import { getYieldFarmAprHelper } from 'hookApi/apr';
import StakeAllAction from 'components/VaultActions/StakeAllAction';
import DepositRegion from 'components/DepositRegion';
import WithdrawRegion from 'components/WithdrawRegion';
import Button from 'components/Button';
import { useStakeAllECAsset } from 'hooks/useStake';
import { useApprove } from 'hooks/useApprove';
import { isAddress } from 'utils/web3';
import rot13 from 'utils/encode';
import Cookies from 'universal-cookie';
import BigNumber from 'bignumber.js';

interface IYieldFarmProps {
  farm: any;
}

function YieldFarm(props: any) {
  const {
    yieldFarmData = {},
    stakingTokenPrice,
    tEXOPrice,
    onPoolStateChange,
    selectedAccount,
    onApprove,
    onAction,
    tEXOPerBlock,
    allTokenPrices,
    totalAllocPoint,
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
    vaultSymbol,
    underlying,
    underlyingVaultBalance,
    ecAssetPool,
  } = yieldFarmData;

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [isToggleView, setIsToggleView] = useState(false);

  const isTablet = useMediaQuery('(max-width: 768px)');

  const {
    allowance,
    stakedBalance,
    balance,
    inVaultBalance,
    earnings: pendingReward,
    ecAssetStakedBalance,
    ecAssetAllowance,
  } = userData;

  const { id: chainId, blockExplorerUrl, blockExplorerName } = useNetwork();
  const vaultAddress = getAddress(address, chainId);
  const vaultContract = useVaultContract(vaultAddress);
  const tEXOOrchestratorContract = useOrchestratorContract();

  const decimal = getDecimals(decimals, chainId);

  const { apr } = getYieldFarmAprHelper(
    {
      yieldFarm: yieldFarmData,
      allTokenPrices,
      tEXOPrice,
      tEXOPerBlock,
      totalAllocPoint,
    },
    chainId
  );

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
    inVaultBalance,
    ecAssetStakedBalance,
    onPoolStateChange,
    refStake: true,
    account: selectedAccount,
    texoOrchestrator: tEXOOrchestratorContract,
    ecAssetPoolId: ecAssetPool.pid
  };

  const dataStakeAllButton = {
    id: ecAssetPool.pid,
    stakingToken: {
      address: vaultAddress,
      decimals: decimals,
    },
    requestingContract: tEXOOrchestratorContract,
    symbol,
    depositFee: depositFeeBP,
    amountStake: inVaultBalance,
    maxAmountWithdraw: inVaultBalance,
    onPoolStateChange,
    refStake: true,
    ecAssetAllowance
  };

  const onToggleView = () => {
    setIsToggleView(!isToggleView);
  }

  //TODO: Need refactor
  const { onStake } = useStakeAllECAsset(tEXOOrchestratorContract, ecAssetPool.pid);

  const tokenContract = useERC20(
    vaultAddress ? vaultAddress : '',
  );

  const { approve } = useApprove({
    tokenContract,
    requestingContract: tEXOOrchestratorContract,
    onApprove
  });

  const onHandleAutoStake = async (isAutoStake: boolean, amountStakeNumber: BigNumber) => {
    if (isAutoStake) {
      const { stakingToken, ecAssetAllowance, refStake } = dataStakeAllButton;

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
        await onStake(amountStakeNumber.toString(), ref, decimals);
        onAction();
      }
    }
  }

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
              {isToggleView ?
                <WithdrawRegion
                  yieldFarmData={yieldFarmData}
                  data={dataButton}
                  onAction={onAction}
                />
                :
                <DepositRegion
                  yieldFarmData={yieldFarmData}
                  data={dataButton}
                  onAction={onAction}
                  onApprove={onApprove}
                  onHandleAutoStake={onHandleAutoStake}
                />
              }
              <Divider orientation="horizontal" variant="fullWidth" />
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
                  <Typography>Your ecAsset in vault <span style={{ fontWeight: "bold" }}>tCake-LP</span></Typography>
                  <Typography className={'text-right'}>
                    {normalizeTokenDecimal(inVaultBalance).toFixed(4)}{' '}
                    ecAsset
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem={true} variant="middle" />
                <Box className={classes.buttonBoxItem} marginTop="-3px" flex={1}>
                  <StakeAllAction
                    onAction={onAction}
                    onApprove={onApprove}
                    data={dataStakeAllButton}
                    disabled={!(inVaultBalance > 0)}
                  />
                </Box>
                <Divider orientation="vertical" flexItem={true} variant="middle" />
                <Box className={classes.rowDetail} width="33%" flexDirection="column">
                  <Typography>Initial Deposit</Typography>
                  <Typography className={'text-right'}>
                    {normalizeTokenDecimal(ecAssetStakedBalance).toFixed(4)}{' '}
                    ecAsset
                  </Typography>
                </Box>
              </Box>
              <Divider orientation="horizontal" variant="fullWidth" />
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
                  <PopOver unit={symbol} />
                </Box>
                <Divider orientation="vertical" flexItem={true} variant="middle" />
                <Box
                  className={classes.rowDetail}
                  flex={1}
                  flexDirection="column"
                  width="25%"
                >
                  <Typography>Total <span style={{ fontWeight: "bold" }}>tEXO</span> Earned</Typography>
                  <Typography className={'text-right'}>
                    {normalizeTokenDecimal(0).toFixed(4)}
                    {' tEXO'}
                  </Typography>
                </Box>
                <Divider orientation="vertical" flexItem={true} variant="middle" />
                <Box className={classes.buttonBoxItem} flex={1} flexDirection="column">
                  <Typography align="center">tEXO Reward</Typography>
                  <ClaimRewardsAction data={dataButton} disabled />
                </Box>
                <Divider orientation="vertical" flexItem={true} variant="middle" />
                <Box className={classes.buttonBoxItem} flex={1}>
                  <Button className={classes.buttonToggle} onClick={onToggleView}>
                    {isToggleView ? 'Deposit' : 'Withdraw'}
                  </Button>
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
