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

import {
  ApproveAction,
  ClaimRewardsAction,
  RoiAction,
  StakeAction,
  WithdrawAction,
} from 'components/PoolActions';

import { useNetwork } from 'state/hooks';
import { useOrchestratorData } from 'state/orchestrator/selectors';

import { useOrchestratorContract } from 'hooks/useContract';
import { getFarmApr } from 'hookApi/apr';

import { getAddress } from 'utils/addressHelpers';
import { BIG_ZERO, normalizeTokenDecimal } from 'utils/bigNumber';
import { getDecimals } from 'utils/decimalsHelper';

import { useStyles } from './styles';

interface IYieldFarmProps {
	farm: any,
}

function YieldFarm(props: any) {
  const {
    yieldFarmData = {},
    stakingTokenPrice,
    tEXOPrice,
    account,
		onPoolStateChange,
		selectedAccount
  } = props || {};

  const {
    icon,
    title,
    symbol,
    pid: farmId,
    address,
    decimals,
    depositFeeBP,
    userData = {},
    lpTotalInQuoteToken = BIG_ZERO,
		allocPoint,
		vaultSymbol
  } = yieldFarmData;

  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 600px)');

  const { allowance, pendingReward, stakedBalance, stakingTokenBalance, tokenBalance } =
    userData;

  const canWithdraw = new BigNumber(stakedBalance).toNumber() > 0;
  const isAlreadyApproved = new BigNumber(allowance).toNumber() > 0;
  const { id: chainId, blockExplorerUrl, blockExplorerName } = useNetwork();
  const tokenAddress = getAddress(address, chainId);
  const { tEXOPerBlock, totalAllocPoint } = useOrchestratorData();
	const farmWeight = new BigNumber(allocPoint).div(
		new BigNumber(totalAllocPoint),
	);
  const decimal = getDecimals(decimals, chainId);

  const tEXOOrchestratorContract = useOrchestratorContract();

  const apr = getFarmApr(
    farmWeight,
    tEXOPrice,
    lpTotalInQuoteToken,
    normalizeTokenDecimal(tEXOPerBlock),
  );

  const dataButton = {
    id: farmId,
    stakingToken: {
      address,
      decimals,
    },
    orchestratorContract: tEXOOrchestratorContract,
    symbol,
    depositFee: depositFeeBP,
    maxAmountStake: tokenBalance,
    maxAmountWithdraw: stakedBalance,
    onPoolStateChange,
    refStake: true,
    account: selectedAccount,
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
								flex={1}
                display='flex'
                justifyContent="center"
								flexDirection='column'
								marginLeft={isTablet ? '0' : '20px'}
              >
								<Box className={classes.rowDetail} flex={1}>
                  <Typography>Total unstaked</Typography>
                  <Typography
                    className={'text-right'}
                  >
                    {normalizeTokenDecimal(0).toFixed(4)}{' '}
                    {vaultSymbol}
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
							{!!account && (
								<>
									<Box
										flex={1}
										display='flex'
										justifyContent="center"
										flexDirection='column'
										marginLeft={isTablet ? '0' : '20px'}
										marginBottom={isTablet ? '8px' : '0'}
									>
										<Box className={classes.buttonBoxItem} flex={1}>
											<StakeAction data={dataButton} disabled={!isAlreadyApproved}/>
										</Box>
										<Box className={classes.buttonBoxItem} flex={1}>
											<ClaimRewardsAction
												data={dataButton}
												disabled
											/>
										</Box>
									</Box>
									<Box
										flex={1}
										display='flex'
										justifyContent="center"
										flexDirection='column'
										marginLeft={isTablet ? '0' : '20px'}
										marginTop={isTablet ? '8px' : '0'}
									>
										<Box className={classes.buttonBoxItem} flex={1}>
											<ApproveAction data={dataButton} disabled={isAlreadyApproved} />
										</Box>

										<Box className={classes.buttonBoxItem} flex={1}>
											<WithdrawAction data={dataButton} disabled/>
										</Box>
									</Box>
								</>
							)}
							{!account && (
								<Box
									flex={2}
									display='flex'
									alignItems='center'
									marginLeft={isTablet ? '0' : '20px'}
								>
									<Box className={classes.buttonBoxItem} flex={1}>
										<ApproveAction data={dataButton} disabled={isAlreadyApproved} />
									</Box>							
								</Box>
							)}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
}

export default YieldFarm;
