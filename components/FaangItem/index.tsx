import React from 'react';
import { Box, Link, Typography } from '@material-ui/core';

import { useStyles } from './styles';
import { normalizeTokenDecimal } from '../../utils/bigNumber';
import { getAddress } from '../../utils/addressHelpers';
import { useFAANGOrchestratorContract } from '../../hooks/useContract';
import BigNumber from 'bignumber.js';
import {
  ApproveAction,
  StakeAction,
  WithdrawAction,
  ClaimRewardsAction,
} from 'components/PoolActions';
import { useNetwork } from 'state/hooks';
import { getDecimals } from 'utils/decimalsHelper';

function FaangItem({ pool, account }) {
  const {
    symbol,
    totalStaked,
    userData = {},
    depositFeeBP,
    stakingToken,
    canClaimReward,
  } = pool;
  const classes = useStyles();
  const { allowance, pendingReward, stakedBalance, stakingTokenBalance } =
    userData;
  const { id: chainId } = useNetwork();
  const tokenAddress = getAddress(stakingToken.address, chainId);
  const isAlreadyApproved = new BigNumber(allowance).toNumber() > 0;
  const canWithdraw = new BigNumber(stakedBalance).toNumber() > 0;
  const decimal = getDecimals(stakingToken.decimals, chainId);

  const orchestratorContract = useFAANGOrchestratorContract();

  const dataButton = {
    id: 0,
    stakingToken,
    orchestratorContract,
    symbol,
    depositFee: depositFeeBP,
    maxAmountStake: stakingTokenBalance,
    maxAmountWithdraw: stakedBalance,
    account,
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
              {normalizeTokenDecimal(stakedBalance, +decimal).toNumber().toFixed(4)}{' '}
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
              {normalizeTokenDecimal(pendingReward, +decimal).toNumber().toFixed(4)} FAANG
            </Typography>
          </Box>
          <Box className={classes.flexRow}>
            <Typography component="p" className={classes.pTitle}>
              Total Staked
            </Typography>
            <Typography component="p" className={classes.pTitle}>
              {normalizeTokenDecimal(totalStaked, +decimal).toFixed(4)} {symbol}
            </Typography>
          </Box>
          <Box className={classes.flexRow}>
            <Typography component="p" className={classes.pTitle}>
              Wallet Balance
            </Typography>
            <Typography component="p" className={classes.pTitle}>
              {normalizeTokenDecimal(stakingTokenBalance, +decimal).toNumber().toFixed(4)}{' '}
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
          {!isAlreadyApproved ? (
            <ApproveAction
              data={dataButton}
              disabled={canClaimReward}
              buttonClasses={classes.approveButton}
            />
          ) : null}

          {!canClaimReward && isAlreadyApproved ? (
            <StakeAction data={dataButton} disabled={canClaimReward} />
          ) : null}

          {canWithdraw && isAlreadyApproved ? (
            <WithdrawAction data={dataButton} />
          ) : null}

          {canClaimReward &&
          Number(stakedBalance) > 0 &&
          Number(pendingReward) > 0 ? (
            <ClaimRewardsAction data={dataButton} />
          ) : null}
        </Box>
      </Box>
    </>
  );
}

export default FaangItem;
