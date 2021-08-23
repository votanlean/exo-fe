import React from 'react';
import { Box, Link, Typography } from '@material-ui/core';

import { useStyles } from './styles';
import { normalizeTokenDecimal } from '../../utils/bigNumber';
import { getAddress } from '../../utils/addressHelpers';
import { useFAANGOrchestratorContract } from '../../hooks/useContract';
import BigNumber from 'bignumber.js';
import tokens from '../../config/constants/tokens';
import {
  ApproveAction,
  StakeAction,
  WithdrawAction,
  ClaimRewardsAction,
} from 'components/PoolActions';
import { useNetwork } from 'state/hooks';
import { numberWithCommas } from 'utils/numberWithComma';
import { useCallback } from 'react';

function FaangItem({ pool, account, tEXOPrice, FAANGFinish, onApprove }) {
  const {
    symbol,
    totalStaked,
    userData = {},
    depositFeeBP,
    stakingToken,
  } = pool;
  const classes = useStyles();
  const { allowance, pendingReward, stakedBalance, stakingTokenBalance } =
    userData;
  const { id: chainId, blockExplorerUrl, blockExplorerName } = useNetwork();
  const tokenAddress = getAddress(stakingToken.address, chainId);
  const FAANGAddress = getAddress(tokens.faang.address, chainId);
  const isAlreadyApproved = new BigNumber(allowance).toNumber() > 0;
  const canWithdraw = new BigNumber(stakedBalance).toNumber() > 0;
  const normalizeTexoPrice = isNaN(tEXOPrice) ? 0 : tEXOPrice;

  const orchestratorContract = useFAANGOrchestratorContract();

  const dataButton = {
    id: 0,
    stakingToken,
    requestingContract: orchestratorContract,
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
          <Box className={classes.flexRow} marginBottom={1.25}>
            <Typography
              component="p"
              className={classes.pTitle}
              style={{ color: '#6A98C9' }}
            >
              My Stake
            </Typography>
            <div className="text-right">
              <Typography
                component="p"
                className={classes.pTitle}
                style={{ color: '#6A98C9' }}
              >
                {normalizeTokenDecimal(stakedBalance).toFixed(4)} {symbol}
              </Typography>
              <Typography variant="caption">
                $
                {numberWithCommas(
                  (
                    Number(normalizeTexoPrice) *
                    Number(normalizeTokenDecimal(stakedBalance))
                  ).toFixed(2),
                )}
              </Typography>
            </div>
          </Box>
          <Box className={classes.flexRow} marginBottom={1.25}>
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
          <Box className={classes.flexRow} marginBottom={1.25}>
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
              {numberWithCommas(
                normalizeTokenDecimal(pendingReward).toFixed(4),
              )}{' '}
              FAANG
            </Typography>
          </Box>
          <Box className={classes.flexRow} marginBottom={1.25}>
            <Typography component="p" className={classes.pTitle}>
              Total Staked
            </Typography>
            <Typography component="p" className={classes.pTitle}>
              {numberWithCommas(normalizeTokenDecimal(totalStaked).toFixed(4))}{' '}
              {symbol}
            </Typography>
          </Box>
          <Box className={classes.flexRow} marginBottom={1.25}>
            <Typography component="p" className={classes.pTitle}>
              Wallet Balance
            </Typography>
            <Typography component="p" className={classes.pTitle}>
              {numberWithCommas(
                normalizeTokenDecimal(stakingTokenBalance).toFixed(4),
              )}{' '}
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
            <Box className={classes.flexRow} marginBottom={1.25}>
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
            <Box className={classes.flexRow} marginBottom={1.25}>
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
                $
                {numberWithCommas(
                  (
                    Number(normalizeTexoPrice) *
                    Number(normalizeTokenDecimal(totalStaked))
                  ).toFixed(2),
                )}
              </Typography>
            </Box>
            <Typography component="p" style={{ fontSize: '19px' }}>
              <Link
                href={`${blockExplorerUrl}/address/${FAANGAddress}`}
                target="_blank"
                style={{ color: '#007EF3' }}
              >
                View FAANG on {blockExplorerName}
              </Link>
            </Typography>
            <Typography component="p" style={{ fontSize: '19px' }}>
              <Link
                href={`${blockExplorerUrl}/address/${tokenAddress}`}
                target="_blank"
                style={{ color: '#007EF3' }}
              >
                View tEXO on {blockExplorerName}
              </Link>
            </Typography>
          </Box>
          {!isAlreadyApproved ? (
            <ApproveAction
              data={dataButton}
              disabled={FAANGFinish}
              buttonClasses={classes.approveButton}
              onApprove={onApprove}
            />
          ) : null}

          {isAlreadyApproved ? (
            <StakeAction
              disabled={FAANGFinish}
              data={dataButton}
              stakingTokenPrice={normalizeTexoPrice}
            />
          ) : null}

          <Box className={classes.doubleBtn}>
            {canWithdraw ? (
              <Box className={classes.btnItem}>
                <WithdrawAction data={dataButton} />
              </Box>
            ) : null}
            {Number(pendingReward) > 0 ? (
              <Box className={classes.btnItem}>
                <ClaimRewardsAction data={dataButton} />
              </Box>
            ) : null}
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default FaangItem;
