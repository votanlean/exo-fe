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

function YieldFarm(props: any) {
  const {
    pool = {},
    stakingTokenPrice,
    tEXOPrice,
    account,
  } = props || {};

  const {
    id: poolId,
    icon,
    title,
    symbol,
    totalStaked,
    allocPoint,
    userData = {},
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
    depositFee: 0,
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
          </>
        )}
				{!isTablet && (
          <>
            <TableCell style={{ padding: '24px 16px' }}>
              <Typography variant="caption">Total Deposited</Typography>
              <Typography variant="h6" className={classes.label}>
                100000000
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
              <Box
								paddingRight='10px'
							>
                <Box>
									<a
										className={classes.linkDetail}
										href={`${blockExplorerUrl}/address/${tokenAddress}`}
										target="_blank"
									>
										View Vault on {blockExplorerName} <Launch fontSize="small" />
									</a>
								</Box>
								<Box>
									<a
										className={classes.linkDetail}
										href={`${blockExplorerUrl}/address/${tokenAddress}`}
										target="_blank"
									>
										View Pool on {blockExplorerName} <Launch fontSize="small" />
									</a>
								</Box>
              </Box>
              <Box
								flexGrow={1}
                display='flex'
                justifyContent="center"
								flexDirection='column'
								marginLeft='20px'
              >
								<Box className={classes.rowDetail} flex={1}>
                  <Typography>Total unstaked</Typography>
                  <Typography
                    className={'text-right'}
                  >
                    {normalizeTokenDecimal(0).toFixed(4)}{' '}
                    {symbol}
                  </Typography>
                </Box>
								<Box className={classes.rowDetail} flex={1}>
                  <Typography>Total reward</Typography>
                  <Typography
                    className={'text-right'}
                  >
                    {normalizeTokenDecimal(0).toFixed(4)}{' tEXO'}
                  </Typography>
                </Box>
								
              </Box>
							<Box
								flexGrow={1}
                display='flex'
                justifyContent="center"
								flexDirection='column'
								marginLeft='20px'
              >
								<Box className={classes.buttonBoxItem} flex={1}>
									<StakeAction disabled data={dataButton} />
								</Box>
								<Box className={classes.buttonBoxItem} flex={1}>
									<ClaimRewardsAction
										data={dataButton}
										disabled
									/>
								</Box>
              </Box>
              <Box
                flexGrow={1}
                display='flex'
                justifyContent="center"
								flexDirection='column'
								marginLeft='20px'
              >
								{isAlreadyApproved ? (
                  <Box className={classes.buttonBoxItem} flex={1}>
                    <StakeAction disabled data={dataButton} />
                  </Box>
                ) : null}

                {!isAlreadyApproved ? (
                  <Box className={classes.buttonBoxItem} flex={1}>
                    <ApproveAction data={dataButton} disabled />
                  </Box>
                ) : null}

								<Box className={classes.buttonBoxItem} flex={1}>
									<WithdrawAction data={dataButton} disabled/>
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
