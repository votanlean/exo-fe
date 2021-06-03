import React, { Fragment, useState } from 'react';
import {
  Box,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Typography,
  useMediaQuery,
} from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp, Launch } from '@material-ui/icons';
import web3 from 'blockchain/web3';
import { ethers } from "ethers";
import BigNumber from 'bignumber.js';
import { EventEmitter } from 'events';

import erc20abi from 'config/abi/erc20.json';
import orchestratorInstance from 'blockchain/orchestrator';
import { ROIDialog, StakeDialog, WithdrawDialog } from 'components/Dialogs';
import { getPoolApr } from 'hookApi/apr';
import { useOrchestratorData } from 'state/orchestrator/selectors';
import { getAddress, getOrchestratorAddress } from 'utils/addressHelpers';
import { normalizeTokenDecimal } from 'utils/bigNumber';
import { shouldComponentDisplay } from 'utils/componentDisplayHelper';
import Cookies from 'universal-cookie';
import Button from '../Button';

import { useStyles } from './styles';
import {isAddress} from "../../utils/web3";
import rot13 from "../../utils/encode";


function formatDepositFee(depositFee, decimals = 4) {
  if (!depositFee) {
    return '0%'
  }

  const actualDepositFee = (depositFee * 100) / Math.pow(10, decimals)

  return `${actualDepositFee.toFixed(2)}%`
}

function PoolRow(props: any) {
  const {
    pool = {},
    account,
    onPoolStateChange,
    stakingTokenPrice,
    tEXOPrice,
    canClaimReward,
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
    stakingToken
  } = pool;

  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openStakeDialog, setOpenStakeDialog] = useState(false);
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);
  const [openRoiDialog, setOpenRoiDialog] = useState(false);

  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 600px)');

  const { allowance, pendingReward, stakedBalance, stakingTokenBalance } = userData;

  const canWithdraw = new BigNumber(stakedBalance).toNumber() > 0;
  const isAlreadyApproved = new BigNumber(allowance).toNumber() > 0;
  const tokenAddress = getAddress(stakingToken.address);
  const tokenInstance = new web3.eth.Contract(erc20abi as any, tokenAddress);

  const { tEXOPerBlock, totalAllocPoint } = useOrchestratorData();
  const poolTexoPerBlock = new BigNumber(tEXOPerBlock).times(new BigNumber(allocPoint)).div(new BigNumber(totalAllocPoint))

  const orchestratorAddress = getOrchestratorAddress();

  const apr = getPoolApr(
    stakingTokenPrice,
    tEXOPrice,
    normalizeTokenDecimal(totalStaked).toNumber(),
    normalizeTokenDecimal(poolTexoPerBlock).toNumber(),
  );

  const handleClickStake = async () => {
    setOpenStakeDialog(true)
  }

  const handleCloseStakeDialog = async () => {
    if (account) {
      setOpenStakeDialog(false)
    }
  }

  const handleClickWithdraw = () => {
    setOpenWithdrawDialog(true)
  }

  const handleCloseWithdrawDialog = async () => {
    setOpenWithdrawDialog(false)
  }

  const onToggleRoiDialog = () => {
    setOpenRoiDialog(!openRoiDialog);
  }

  const handleClickApprove = async () => {
    const approvalEventEmitter = tokenInstance.methods
      .approve(orchestratorAddress, ethers.constants.MaxUint256)
      .send({ from: account });

    approvalEventEmitter.on('receipt', data => {
      onPoolStateChange()
      approvalEventEmitter.removeAllListeners()
    })

    approvalEventEmitter.on('error', data => {
      onPoolStateChange()
      approvalEventEmitter.removeAllListeners()
    })
  }

  const handleConfirmStake = async amount => {
    const cookies = new Cookies();
    let ref;
    if (cookies.get('ref')) {
      if (isAddress(rot13(cookies.get('ref')))) {
        ref = rot13(cookies.get('ref'));
      }
    } else {
      ref = '0x0000000000000000000000000000000000000000';
    }

    const stakeEventEmitter: EventEmitter = orchestratorInstance.methods
      .deposit(poolId, web3.utils.toWei(amount, 'ether'), ref)
      .send({ from: account });

    stakeEventEmitter.on('receipt', data => {
      onPoolStateChange()
      stakeEventEmitter.removeAllListeners()
    });

    stakeEventEmitter.on('error', data => {
      onPoolStateChange()
      stakeEventEmitter.removeAllListeners()
    })
  }

  const handleConfirmWithdraw = async amount => {
    const withdrawEventEmitter = orchestratorInstance.methods
      .withdraw(poolId, web3.utils.toWei(amount, 'ether'))
      .send({ from: account });

    withdrawEventEmitter.on('receipt', data => {
      onPoolStateChange()
      withdrawEventEmitter.removeAllListeners()
    });

    withdrawEventEmitter.on('error', data => {
      onPoolStateChange()
      withdrawEventEmitter.removeAllListeners()
    });
  }

  const handleClickClaimRewards = async () => {
    const claimRewardsEventEmitter = orchestratorInstance.methods
      .withdraw(poolId, '0')
      .send({ from: account });

    claimRewardsEventEmitter.on('receipt', data => {
      onPoolStateChange()
      claimRewardsEventEmitter.removeAllListeners()
    });

    claimRewardsEventEmitter.on('error', data => {
      onPoolStateChange()
      claimRewardsEventEmitter.removeAllListeners()
    });
  }

  return (
    <Fragment>
      <TableRow className={classes.root} onClick={() => setOpen(!open)}>
        <TableCell style={{padding: "24px 16px"}} component="th" scope="row">
          <Box display="flex" alignItems="center">
            <img src={icon} alt={title} className={classes.poolImg} />
            <Typography className={classes.poolTitle}>{title}</Typography>
          </Box>
        </TableCell>
        <TableCell style={{padding: "24px 16px", paddingLeft: isTablet ? '0' : "16px"}}>
          <Typography variant="caption">
            {!isTablet ? 'My Rewards' : 'Rewards'}
          </Typography>
          <Typography variant="h6" className={classes.label}>
            {normalizeTokenDecimal(pendingReward).toNumber().toFixed(4)} tEXO
          </Typography>
        </TableCell>
        <TableCell style={{padding: "24px 16px", paddingLeft: isTablet ? '0' : "16px"}}>
          <Typography variant="caption">APR</Typography>
          <Box display="flex" alignItems="center">
            <Typography variant="h6" className={classes.label}>
              {apr ? `${apr}%` : 'N/A'}
            </Typography>
            {!isTablet ? (
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={onToggleRoiDialog}
                className={classes.aprIconButton}
              >
                <img
                  src="/static/images/calculate.svg"
                  alt={title}
                  className={classes.aprIcon}
                />
              </IconButton>
            ) : null}
          </Box>
        </TableCell>
        {!isTablet && (
          <>
            <TableCell style={{padding: "24px 16px"}}>
              <Typography variant="caption">My Stake</Typography>
              <Typography variant="h6" className={classes.label}>
                {normalizeTokenDecimal(stakedBalance).toNumber().toFixed(4)} {symbol}
              </Typography>
            </TableCell>
            <TableCell style={{padding: "24px 16px"}}>
              <Typography variant="caption">Deposit Fee</Typography>
              <Typography variant="h6" className={classes.label}>
                {formatDepositFee(depositFeeBP)}
              </Typography>
            </TableCell>
            <TableCell style={{padding: "24px 16px"}}>
              <Typography variant="caption">Multiplier</Typography>
              <Typography variant="h6" className={classes.label}>
              {displayAllocPoint / 100}x
              </Typography>
            </TableCell>
          </>
        )}
        <TableCell style={{padding: "24px 16px"}}>
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
                  href={`https://bscscan.com/address/${tokenAddress}`}
                  target="_blank"
                >
                  View on Bscan <Launch fontSize="small" />
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
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={onToggleRoiDialog}
                          className={classes.aprIconButton}
                        >
                          <img
                            src="/static/images/calculate.svg"
                            alt={title}
                            className={classes.aprIcon}
                          />
                        </IconButton>

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
                        {normalizeTokenDecimal(stakedBalance).toFixed(4)} {symbol}
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
                    {normalizeTokenDecimal(stakingTokenBalance).toNumber().toFixed(4)} {symbol}
                  </Typography>
                </Box>
                <Box className={classes.rowDetail}>
                  <Typography>Total Staked</Typography>
                  <Typography
                    className={'text-right'}
                    style={{ marginLeft: 10 }}
                  >
                    {normalizeTokenDecimal(totalStaked).toFixed(4)} {symbol}
                  </Typography>
                </Box>
                <Box className={classes.rowDetail}>
                  <Typography>Total liquidity</Typography>
                  <Typography
                    className={'text-right'}
                    style={{ marginLeft: 10 }}
                  >
                    ${Number(normalizeTokenDecimal(totalStaked).toNumber() * stakingTokenPrice).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
              <Box
                flexGrow={1}
                display={isMobile ? 'block' : 'flex'}
                justifyContent="flex-end"
                order={isTablet ? 1 : 'unset'}
              >
                {
                  shouldComponentDisplay(
                    canClaimReward && Number(stakedBalance) > 0 && Number(pendingReward) > 0,
                    <Box className={classes.boxButton} style={{width: !isTablet ? '50%' : 'auto'}}>
                      <Typography variant="caption">Claim Rewards</Typography>
                      <Button className={classes.button} onClick={handleClickClaimRewards} disabled={!canClaimReward}>Claim Rewards</Button>
                    </Box>
                  )
                }
                {
                  shouldComponentDisplay(
                    canWithdraw,
                    <>
                      <Box className={classes.boxButton} style={{width: !isTablet ? '50%' : 'auto'}}>
                        <Typography variant="caption">Withdraw</Typography>
                        <Button className={classes.button} onClick={handleClickWithdraw}>Withdraw</Button>
                      </Box>
                      {
                        shouldComponentDisplay(
                          !canClaimReward,
                          <Box className={classes.boxButton} style={{width: !isTablet ? '50%' : 'auto'}}>
                            <Typography variant="caption">Stake</Typography>
                            <Button className={classes.button} onClick={handleClickStake}>Stake</Button>
                          </Box>
                        )
                      }
                    </>,
                    shouldComponentDisplay(
                      isAlreadyApproved && !canClaimReward,
                      <Box className={classes.boxButton} style={{width: !isTablet ? '50%' : 'auto'}}>
                        <Typography variant="caption">Stake</Typography>
                        <Button className={classes.button} onClick={handleClickStake}>Stake</Button>
                      </Box>
                    )
                  )
                }
                {
                  shouldComponentDisplay(
                    !isAlreadyApproved,
                    <Box className={classes.boxButton} style={{width: !isTablet ? '50%' : 'auto'}}>
                      <Typography variant="caption">Approve</Typography>
                      <Button className={`${classes.button} ${canClaimReward ? classes.disabled : ''}`} onClick={handleClickApprove} disabled={canClaimReward}>Approve</Button>
                    </Box>
                  )
                }
              </Box>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <StakeDialog
        open={openStakeDialog}
        title="Stake"
        onClose={handleCloseStakeDialog}
        onConfirm={handleConfirmStake}
        unit={symbol}
        depositFee={depositFeeBP}
        maxAmount={stakingTokenBalance}
      />
      <WithdrawDialog
        open={openWithdrawDialog}
        title="Withdraw"
        onClose={handleCloseWithdrawDialog}
        onConfirm={handleConfirmWithdraw}
        unit={symbol}
        maxAmount={stakedBalance}
      />
      <ROIDialog
        open={openRoiDialog}
        onClose={onToggleRoiDialog}
        poolData={{ apr, tokenPrice: stakingTokenPrice }}
      />
    </Fragment>
  );
}

export default PoolRow;
