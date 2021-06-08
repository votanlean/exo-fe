import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import BigNumber from 'bignumber.js';

import styles from './farmItem.module.scss';
import { getFarmApr } from '../../hookApi/apr';
import { useOrchestratorData } from 'state/orchestrator/selectors';
import { getAddress } from '../../utils/addressHelpers';
import { BIG_ZERO, normalizeTokenDecimal } from 'utils/bigNumber';
import { ROIDialog, StakeDialog, WithdrawDialog } from 'components/Dialogs';
import { shouldComponentDisplay } from 'utils/componentDisplayHelper';
import { isAddress } from '../../utils/web3';
import rot13 from '../../utils/encode';
import Cookies from 'universal-cookie';
import { useApprove } from '../../hooks/useApprove';
import { useStake } from '../../hooks/useStake';
import { useUnstake } from '../../hooks/useUnstake';
import { useHarvest } from '../../hooks/useHarvest';
import { useERC20, useOrchestratorContract } from '../../hooks/useContract';

function formatDepositFee(depositFee, decimals = 4) {
  if (!depositFee) {
    return '0%';
  }

  const actualDepositFee = (depositFee * 100) / Math.pow(10, decimals);

  return `${actualDepositFee.toFixed(2)}%`;
}

function FarmItem(props: any) {
  const {
    farmData = {},
    selectedAccount,
    onPoolStateChange,
    stakingTokenPrice,
    tEXOPrice,
    canClaimReward,
  } = props;
  const {
    icon,
    title,
    symbol,
    pid: farmId,
    address,
    depositFeeBP,
    allocPoint,
    totalStaked,
    displayAllocPoint,
    userData = {},
    lpTotalInQuoteToken = BIG_ZERO,
  } = farmData;

  const {
    allowance,
    earnings: pendingReward,
    stakedBalance,
    tokenBalance,
  } = userData;

  const tokenAddress = getAddress(address);
  const tokenContract = useERC20(tokenAddress);
  const tEXOOrchestratorContract = useOrchestratorContract();
  const { onApprove } = useApprove(
    tokenContract,
    tEXOOrchestratorContract,
    farmId,
  );
  const { onStake } = useStake(tEXOOrchestratorContract, farmId);
  const { onUnstake } = useUnstake(tEXOOrchestratorContract, farmId);
  const { onReward } = useHarvest(tEXOOrchestratorContract, farmId);

  const canWithdraw = new BigNumber(stakedBalance).toNumber() > 0;
  const isAlreadyApproved = new BigNumber(allowance).toNumber() > 0;

  const { tEXOPerBlock, totalAllocPoint } = useOrchestratorData();
  const farmWeight = new BigNumber(allocPoint).div(
    new BigNumber(totalAllocPoint),
  );

  const [openStakeDialog, setOpenStakeDialog] = useState(false);
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);
  const [openRoiDialog, setOpenRoiDialog] = useState(false);
  const [isDisplayDetails, setIsDisplayDetails] = useState(false);

  const apr = getFarmApr(
    farmWeight,
    tEXOPrice,
    lpTotalInQuoteToken,
    normalizeTokenDecimal(tEXOPerBlock),
  );

  const handleClickApprove = async () => {
    await onApprove();
  };

  const handleClickStake = async () => {
    setOpenStakeDialog(true);
  };

  const handleCloseStakeDialog = async () => {
    if (selectedAccount) {
      setOpenStakeDialog(false);
    }
  };

  const handleConfirmStake = async (amount) => {
    const cookies = new Cookies();
    let ref;
    if (cookies.get('ref')) {
      if (isAddress(rot13(cookies.get('ref')))) {
        ref = rot13(cookies.get('ref'));
      }
    } else {
      ref = '0x0000000000000000000000000000000000000000';
    }
    await onStake(amount, ref);
    // onPoolStateChange();
  };

  const handleClickWithdraw = () => {
    setOpenWithdrawDialog(true);
  };

  const handleCloseWithdrawDialog = async () => {
    setOpenWithdrawDialog(false);
  };

  const handleConfirmWithdraw = async (amount) => {
    await onUnstake(amount);
    onPoolStateChange();
  };

  const handleClickClaimRewards = async () => {
    await onReward();
    // onPoolStateChange();
  };

  const toggleDisplayDetails = () => {
    setIsDisplayDetails(!isDisplayDetails);
  };

  const onToggleRoiDialog = () => {
    setOpenRoiDialog(!openRoiDialog);
  };

  const poolDetailsDiv = isDisplayDetails ? (
    <div className={styles.detailsContainer}>
      <div
        style={{ marginBottom: '10px' }}
        className={styles.detailsContainer__row}
      >
        <h3>Deposit:</h3>
        <h3>{symbol}</h3>
      </div>
      <div
        style={{ marginBottom: '10px' }}
        className={styles.detailsContainer__row}
      >
        <h3>Total liquidity:</h3>
        <h3>${Number(lpTotalInQuoteToken).toFixed(2)}</h3>
      </div>
      <a
        style={{ fontSize: '19px', color: '#007EF3' }}
        href={`https://bscscan.com/address/${tokenAddress}`}
        target="_blank"
      >
        View on Bscan
      </a>
    </div>
  ) : null;

  return (
    <>
      <div className={styles.poolItem}>
        <div className={styles.poolItemGrid}>
          <div className={styles.item}>
            <div className={styles.liquidityPoolEffect} />

            <div className={`${styles.spacing} d-flex items-center column`}>
              <div className={`d-flex justify-between w-full items-center`}>
                <div>
                  <img src={icon} alt={title} className={styles.icon} />
                </div>
                <div>
                  <p className={`${styles.title} text-right mb-1`}>{title}</p>
                  <div className={`d-flex items-center justify-end`}>
                    {shouldComponentDisplay(
                      depositFeeBP <= 0,
                      <div
                        className={`${styles.poolAllocationPoint} ${styles.noFeeBag}`}
                      >
                        <img src="/static/images/verified.svg" />
                        <p>No Fees</p>
                      </div>,
                    )}
                    <div className={`${styles.poolAllocationPoint}`}>
                      <p>{displayAllocPoint / 100} X</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`${styles.poolItemGrid} w-full`}>
                <RowPoolItem
                  title="APR"
                  containerStyle={`${styles.colorLight}`}
                >
                  <div className={`d-flex items-center`}>
                    <div
                      className={styles.calAPRButton}
                      onClick={onToggleRoiDialog}
                    >
                      <img src="/static/images/calculate.svg" />
                    </div>
                    <p>{apr ? `${apr}%` : 'N/A'}</p>
                  </div>
                </RowPoolItem>
                <RowPoolItem
                  title="My Stake"
                  containerStyle={`${styles.colorLight}`}
                >
                  <p>
                    {normalizeTokenDecimal(stakedBalance).toNumber().toFixed(4)}{' '}
                    {symbol}
                  </p>
                </RowPoolItem>
                <RowPoolItem
                  title="Deposit Fee"
                  containerStyle={`${styles.colorLight}`}
                >
                  <p>{formatDepositFee(depositFeeBP)}</p>
                </RowPoolItem>
                <RowPoolItem
                  title="My Rewards"
                  containerStyle={`${styles.colorLight}`}
                >
                  <p>
                    {normalizeTokenDecimal(pendingReward).toNumber().toFixed(4)}{' '}
                    tEXO
                  </p>
                </RowPoolItem>
                <RowPoolItem title="Total Staked">
                  <p>
                    {normalizeTokenDecimal(totalStaked).toNumber().toFixed(4)}{' '}
                    {symbol}
                  </p>
                </RowPoolItem>
                <RowPoolItem
                  title="Wallet Balance"
                  containerStyle={`${styles.wallet}`}
                >
                  <p>
                    {normalizeTokenDecimal(tokenBalance).toNumber().toFixed(4)}{' '}
                    {symbol}
                  </p>
                </RowPoolItem>
              </div>

              <div
                className={`${styles.poolItemGrid} w-full ${styles.poolButton}`}
              >
                {shouldComponentDisplay(
                  canClaimReward && Number(stakedBalance) > 0,
                  <button
                    type="button"
                    className={`${styles.button}`}
                    disabled={!canClaimReward}
                    onClick={handleClickClaimRewards}
                  >
                    Claim Rewards
                  </button>,
                )}
                {shouldComponentDisplay(
                  canWithdraw,
                  <Grid container>
                    <Grid item xs={12}>
                      <button
                        type="button"
                        className={`${styles.button}`}
                        onClick={handleClickWithdraw}
                      >
                        Withdraw
                      </button>
                    </Grid>
                  </Grid>,
                )}
                {shouldComponentDisplay(
                  isAlreadyApproved,
                  <button
                    type="button"
                    className={`${styles.button}`}
                    onClick={handleClickStake}
                  >
                    Stake
                  </button>,
                )}
                {shouldComponentDisplay(
                  !isAlreadyApproved,
                  <button
                    type="button"
                    className={`${styles.button}`}
                    onClick={handleClickApprove}
                  >
                    Approve
                  </button>,
                )}
              </div>

              <div
                className={styles.detailsButtonContainer}
                onClick={toggleDisplayDetails}
              >
                <h3>Details</h3>
                {isDisplayDetails ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
              </div>
              {poolDetailsDiv}
            </div>
          </div>
        </div>
      </div>
      <StakeDialog
        open={openStakeDialog}
        title="Stake"
        onClose={handleCloseStakeDialog}
        onConfirm={handleConfirmStake}
        unit={symbol}
        depositFee={depositFeeBP}
        maxAmount={tokenBalance}
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
    </>
  );
}

const RowPoolItem = React.memo(function RowPoolItem(props: any) {
  const { containerStyle, title, children } = props || {};
  return (
    <div
      className={`d-flex items-center justify-between font-bold ${containerStyle}`}
    >
      <p className={styles.pTitle}>{title}</p>
      {children}
    </div>
  );
});

export default FarmItem;
