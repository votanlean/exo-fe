import React, { Fragment, useState } from 'react';
import { Box, IconButton, Link, Typography } from '@material-ui/core';

import Button from '../Button';

import { useStyles } from './styles';
import { StakeDialog, WithdrawDialog } from 'components/Dialogs';
import { normalizeTokenDecimal } from '../../utils/bigNumber';
import { getAddress } from '../../utils/addressHelpers';
import { useApprove } from '../../hooks/useApprove';
import { useStake } from '../../hooks/useStake';
import { useUnstake } from '../../hooks/useUnstake';
import { useHarvest } from '../../hooks/useHarvest';
import {
  useERC20,
  useFAANGOrchestratorContract,
} from '../../hooks/useContract';
import { shouldComponentDisplay } from '../../utils/componentDisplayHelper';
import BigNumber from 'bignumber.js';

function FaangItem({ pool, account }) {
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
    canClaimReward,
  } = pool;
  const classes = useStyles();
  const { allowance, pendingReward, stakedBalance, stakingTokenBalance } =
    userData;
  const [openStakeDialog, setOpenStakeDialog] = useState(false);
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);
  const tokenAddress = getAddress(stakingToken.address);
  const isAlreadyApproved = new BigNumber(allowance).toNumber() > 0;
  const canWithdraw = new BigNumber(stakedBalance).toNumber() > 0;

  const tokenContract = useERC20(getAddress(stakingToken.address));
  const orchestratorContract = useFAANGOrchestratorContract();
  const { onApprove } = useApprove(tokenContract, orchestratorContract, 0);
  const { onStake } = useStake(orchestratorContract, 0);
  const { onUnstake } = useUnstake(orchestratorContract, 0);
  const { onReward } = useHarvest(orchestratorContract, 0);

  const handleClickStake = async () => {
    setOpenStakeDialog(true);
  };

  const handleCloseStakeDialog = async () => {
    if (account) {
      setOpenStakeDialog(false);
    }
  };

  const handleClickWithdraw = () => {
    setOpenWithdrawDialog(true);
  };

  const handleCloseWithdrawDialog = async () => {
    setOpenWithdrawDialog(false);
  };

  const handleConfirmStake = async (amount) => {
    await onStake(amount);
  };

  const handleConfirmWithdraw = async (amount) => {
    await onUnstake(amount);
  };

  return (
    <>
      <Box className={classes.root}>
        <Box className={classes.header}>
          <img src="/static/images/equities/tFB.png" className={classes.img} />
          <img
            src="/static/images/equities/tAAPL.svg"
            className={classes.img}
          />
          <img
            src="/static/images/equities/tAMZN.png"
            className={classes.img}
          />
          <img
            src="/static/images/equities/tNFLX.png"
            className={classes.img}
          />
          <img
            src="/static/images/equities/tGOOGL.png"
            className={classes.img}
          />
        </Box>
        <Box className={classes.rowItem}>
          <Box className={classes.flexRow}>
            <Typography
              component="p"
              className={classes.pTitle}
              style={{ color: '#6A98C9' }}
            >
              My Stake
            </Typography>
            <Typography
              component="p"
              className={classes.pTitle}
              style={{ color: '#6A98C9' }}
            >
              {normalizeTokenDecimal(stakedBalance).toNumber().toFixed(4)}{' '}
              {symbol}
            </Typography>
          </Box>
          <Box className={classes.flexRow}>
            <Typography
              component="p"
              className={classes.pTitle}
              style={{ color: '#6A98C9' }}
            >
              Deposit Fee
            </Typography>
            <Typography
              component="p"
              className={classes.pTitle}
              style={{ color: '#6A98C9' }}
            >
              0%
            </Typography>
          </Box>
          <Box className={classes.flexRow}>
            <Typography
              component="p"
              className={classes.pTitle}
              style={{ color: '#6A98C9' }}
            >
              My Rewards
            </Typography>
            <Typography
              component="p"
              className={classes.pTitle}
              style={{ color: '#6A98C9' }}
            >
              {normalizeTokenDecimal(pendingReward).toNumber().toFixed(4)} FAANG
            </Typography>
          </Box>
          <Box className={classes.flexRow}>
            <Typography component="p" className={classes.pTitle}>
              Total Staked
            </Typography>
            <Typography component="p" className={classes.pTitle}>
              {normalizeTokenDecimal(totalStaked).toFixed(4)} {symbol}
            </Typography>
          </Box>
          <Box className={classes.flexRow}>
            <Typography component="p" className={classes.pTitle}>
              Wallet Balance
            </Typography>
            <Typography component="p" className={classes.pTitle}>
              {normalizeTokenDecimal(stakingTokenBalance).toNumber().toFixed(4)}{' '}
              {symbol}
            </Typography>
          </Box>
        </Box>
        <Box
          className={classes.rowItem}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
        >
          <Box>
            <Box className={classes.flexRow}>
              <Typography
                component="p"
                className={classes.pTitle}
                style={{ color: '#6A98C9' }}
              >
                Deposit:
              </Typography>
              <Typography
                component="p"
                className={classes.pTitle}
                style={{ color: '#6A98C9' }}
              >
                tEXO
              </Typography>
            </Box>
            <Box className={classes.flexRow}>
              <Typography
                component="p"
                className={classes.pTitle}
                style={{ color: '#6A98C9' }}
              >
                Total liquidity:
              </Typography>
              <Typography
                component="p"
                className={classes.pTitle}
                style={{ color: '#6A98C9' }}
              >
                $0.00
              </Typography>
            </Box>
            <Link
              href={`https://bscscan.com/address/${tokenAddress}`}
              target="_blank"
            >
              <Typography
                component="p"
                style={{ fontSize: '19px', color: '#007EF3' }}
              >
                View on Bscan
              </Typography>
            </Link>
          </Box>

          {shouldComponentDisplay(
            !isAlreadyApproved,
            <Box>
              <Button
                // isLoading={requestedApproval} //TODO support loading
                className={`${classes.button} ${
                  canClaimReward ? classes.disabled : ''
                }`}
                onClick={onApprove}
                disabled={canClaimReward}
              >
                Approve
              </Button>
            </Box>,
          )}

          {shouldComponentDisplay(
            !canClaimReward,
            <Box>
              <Button
                // isLoading={requestedApproval} //TODO support loading
                className={`${classes.button} ${
                  canClaimReward ? classes.disabled : ''
                }`}
                onClick={handleClickStake}
                disabled={canClaimReward}
              >
                Stake
              </Button>
            </Box>,
          )}

          {shouldComponentDisplay(
            canWithdraw,
            <Box>
              <Button
                // isLoading={requestedApproval} //TODO support loading
                className={`${classes.button} ${
                  canClaimReward ? classes.disabled : ''
                }`}
                onClick={handleClickWithdraw}
              >
                Withdraw
              </Button>
            </Box>,
          )}
          {shouldComponentDisplay(
            canClaimReward &&
              Number(stakedBalance) > 0 &&
              Number(pendingReward) > 0,
            <Box>
              <Button
                // isLoading={requestedApproval} //TODO support loading
                className={`${classes.button} ${
                  canClaimReward ? classes.disabled : ''
                }`}
                onClick={onReward}
              >
                Claim Rewards
              </Button>
            </Box>,
          )}
        </Box>
      </Box>
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
    </>
  );
}

export default FaangItem;
