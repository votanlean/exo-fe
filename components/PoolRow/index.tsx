import React, { Fragment, useState } from 'react';
import {
  Box,
  Collapse,
  TableCell,
  TableRow,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp, Launch } from '@material-ui/icons';
import BigNumber from 'bignumber.js';

import { getPoolApr } from 'hookApi/apr';
import { useOrchestratorData } from 'state/orchestrator/selectors';
import { getAddress } from 'utils/addressHelpers';
import { normalizeTokenDecimal } from 'utils/bigNumber';

import { useStyles } from './styles';
import { useOrchestratorContract } from '../../hooks/useContract';
import {
  ApproveAction,
  ClaimRewardsAction,
  RoiAction,
  StakeAction,
  WithdrawAction,
} from 'components/PoolActions';
import { useNetwork } from 'state/hooks';
import { getDecimals } from 'utils/decimalsHelper';

function formatDepositFee(depositFee, decimals = 4) {
  if (!depositFee) {
    return '0%';
  }

  const actualDepositFee = (depositFee * 100) / Math.pow(10, decimals);

  return `${actualDepositFee.toFixed(2)}%`;
}

function PoolRow(props: any) {
  const {
    pool = {},
    stakingTokenPrice,
    tEXOPrice,
    canClaimReward,
    account,
  } = props || {};

  const {
    id: poolId,
    icon,
    title,
    symbol,
    totalStaked,
    allocPoint,
    displayAllocPoint,
    userData = {},
    depositFeeBP,
    stakingToken,
  } = pool;

  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 600px)');

  const { allowance, pendingReward, stakedBalance, stakingTokenBalance } =
    userData;

  const canWithdraw = new BigNumber(stakedBalance).toNumber() > 0;
  const isAlreadyApproved = new BigNumber(allowance).toNumber() > 0;
  const { id: chainId, blockExplorerUrl, blockExplorerName } = useNetwork();
  const tokenAddress = getAddress(stakingToken.address, chainId);
  const { tEXOPerBlock, totalAllocPoint } = useOrchestratorData();
  const poolTexoPerBlock = new BigNumber(tEXOPerBlock)
    .times(new BigNumber(allocPoint))
    .div(new BigNumber(totalAllocPoint));
  const decimal = getDecimals(stakingToken.decimals, chainId);

  const tEXOOrchestratorContract = useOrchestratorContract();

  const apr = getPoolApr(
    stakingTokenPrice,
    tEXOPrice,
    normalizeTokenDecimal(totalStaked, +decimal).toNumber(),
    normalizeTokenDecimal(poolTexoPerBlock, +decimal).toNumber(),
  );

  const dataButton = {
    id: poolId,
    stakingToken,
    orchestratorContract: tEXOOrchestratorContract,
    symbol,
    depositFee: depositFeeBP,
    maxAmountStake: stakingTokenBalance,
    maxAmountWithdraw: stakedBalance,
    refStake: true,
    account,
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
          <Typography variant="caption">
            {!isTablet ? 'My Rewards' : 'Rewards'}
          </Typography>
          <Typography variant="h6" className={classes.label}>
            {normalizeTokenDecimal(pendingReward, +decimal).toFixed(4)} tEXO
          </Typography>
        </TableCell>
        <TableCell
          style={{ padding: '24px 16px', paddingLeft: isTablet ? '0' : '16px' }}
        >
          <Typography variant="caption">APR</Typography>
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
              <Typography variant="caption">My Stake</Typography>
              <Typography variant="h6" className={classes.label}>
                {normalizeTokenDecimal(stakedBalance, +decimal).toFixed(4)}{' '}
                {symbol}
              </Typography>
            </TableCell>
            <TableCell style={{ padding: '24px 16px' }}>
              <Typography variant="caption">Deposit Fee</Typography>
              <Typography variant="h6" className={classes.label}>
                {formatDepositFee(depositFeeBP)}
              </Typography>
            </TableCell>
            <TableCell style={{ padding: '24px 16px' }}>
              <Typography variant="caption">Multiplier</Typography>
              <Typography variant="h6" className={classes.label}>
                {displayAllocPoint / 100}x
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
              display="flex"
              flexDirection={isTablet ? 'column' : 'row'}
              paddingY="16px"
            >
              <Box order={isTablet ? 3 : 'unset'}>
                <a
                  className={classes.linkDetail}
                  href={`${blockExplorerUrl}/address/${tokenAddress}`}
                  target="_blank"
                >
                  View on {blockExplorerName} <Launch fontSize="small" />
                </a>
              </Box>
              <Box
                marginY="-4px"
                marginLeft={isTablet ? '0' : '20px'}
                order={isTablet ? 2 : 'unset'}
                marginBottom={isTablet ? '20px' : '0'}
              >
                {isTablet ? (
                  <>
                    <Box className={classes.rowDetail}>
                      <Typography>APR</Typography>
                      <Box display="flex" alignItems="center">
                        <RoiAction apr={apr} tokenPrice={stakingTokenPrice} />

                        <Typography
                          className={'text-right'}
                          style={{ marginLeft: 10 }}
                        >
                          {apr ? `${apr}%` : 'N/A'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box className={classes.rowDetail}>
                      <Typography>My Stake</Typography>
                      <Typography
                        className={'text-right'}
                        style={{ marginLeft: 10 }}
                      >
                        {normalizeTokenDecimal(stakedBalance, +decimal).toFixed(4)}{' '}
                        {symbol}
                      </Typography>
                    </Box>
                    <Box className={classes.rowDetail}>
                      <Typography>Deposit Fee</Typography>
                      <Typography
                        className={'text-right'}
                        style={{ marginLeft: 10 }}
                      >
                        {formatDepositFee(depositFeeBP)}
                      </Typography>
                    </Box>
                    <Box className={classes.rowDetail}>
                      <Typography>Multiplier</Typography>
                      <Typography
                        className={'text-right'}
                        style={{ marginLeft: 10 }}
                      >
                        {displayAllocPoint / 100}x
                      </Typography>
                    </Box>
                  </>
                ) : null}
                <Box className={classes.rowDetail}>
                  <Typography>Wallet Balance</Typography>
                  <Typography
                    className={'text-right'}
                    style={{ marginLeft: 10 }}
                  >
                    {normalizeTokenDecimal(stakingTokenBalance, +decimal)
                      .toFixed(4)}{' '}
                    {symbol}
                  </Typography>
                </Box>
                <Box className={classes.rowDetail}>
                  <Typography>Total Staked</Typography>
                  <Typography
                    className={'text-right'}
                    style={{ marginLeft: 10 }}
                  >
                    {normalizeTokenDecimal(totalStaked, +decimal).toFixed(4)} {symbol}
                  </Typography>
                </Box>
                <Box className={classes.rowDetail}>
                  <Typography>Total liquidity</Typography>
                  <Typography
                    className={'text-right'}
                    style={{ marginLeft: 10 }}
                  >
                    $
                    {Number(
                      normalizeTokenDecimal(totalStaked, +decimal).toNumber() *
                        stakingTokenPrice,
                    ).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
              <Box
                flexGrow={1}
                display={isMobile ? 'block' : 'flex'}
                justifyContent="flex-end"
                order={isTablet ? 1 : 'unset'}
              >
                {canClaimReward &&
                Number(pendingReward) > 0 ? (
                  <Box className={classes.buttonBoxItem}>
                    <ClaimRewardsAction
                      data={dataButton}
                      disabled={!canClaimReward}
                    />
                  </Box>
                ) : null}

                {canWithdraw ? (
                  <>
                    <Box className={classes.buttonBoxItem}>
                      <WithdrawAction data={dataButton} />
                    </Box>
                    {!canClaimReward ? (
                      <Box className={classes.buttonBoxItem}>
                        <StakeAction data={dataButton} />
                      </Box>
                    ) : null}
                  </>
                ) : isAlreadyApproved && !canClaimReward ? (
                  <Box className={classes.buttonBoxItem}>
                    <StakeAction data={dataButton} />
                  </Box>
                ) : null}

                {!isAlreadyApproved ? (
                  <Box className={classes.buttonBoxItem}>
                    <ApproveAction
                      data={dataButton}
                      disabled={canClaimReward}
                    />
                  </Box>
                ) : null}
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

export default PoolRow;
