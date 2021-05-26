import React, { useEffect, useState } from 'react';
import { Grid } from '@material-ui/core';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { EventEmitter } from 'events';
import BigNumber from 'bignumber.js';

import styles from './poolItem.module.scss';
import orchestratorInstance from '../../blockchain/orchestrator';
import web3 from '../../blockchain/web3';
import StakeDialog from './StakeDialog';
import WithdrawDialog from './WithdrawDialog';
import ROIDialog from './ROIDialog';
import { getPoolApr } from '../../hookApi/apr';
import { useOrchestratorData } from 'state/orchestrator/selectors';
import { getAddress, getOrchestratorAddress } from '../../utils/addressHelpers';
import { useERC20 } from '../../hooks/useContract';
import {BIG_TEN} from "../../config";
import { usePoolFromPid } from 'state/texo/selectors';

function formatDepositFee(depositFee, decimals = 4) {
  if (!depositFee) {
    return '0%'
  }

  const actualDepositFee = (depositFee * 100) / Math.pow(10, decimals)

  return `${actualDepositFee.toFixed(2)}%`
}

function normalizeTokenDecimal(tokenInWei, decimals = 18) {
  if (!tokenInWei) {
    return new BigNumber(0);
  }

  const bigNumber = ['string', 'number'].includes(typeof tokenInWei) ? new BigNumber(tokenInWei) : tokenInWei;

  return bigNumber.div(BIG_TEN.pow(decimals));
}

function PoolItem(props: any) {
  const {
    poolData = {},
    selectedAccount,
    onPoolStateChange,
    stakingTokenPrice,
    tEXOPrice,
    canClaimReward,
    isLiquidityPool,
  } = props;
  const { id: poolId, icon, title, symbol, bsScanLink, totalStaked, userData = {} } = poolData;
  const { allowance, pendingReward, stakedBalance, stakingTokenBalance } = userData;

  const canWithdraw = new BigNumber(pendingReward).toNumber() > 0;
  const isAlreadyApproved = new BigNumber(allowance).toNumber() > 0;
  const tokenInstance = useERC20(getAddress(poolData.address));

  const currentPool = usePoolFromPid(poolId);
  const { tEXOPerBlock } = useOrchestratorData();

  const [openStakeDialog, setOpenStakeDialog] = useState(false);
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);
  const [openRoiDialog, setOpenRoiDialog] = useState(false);
  const [apr, setAPR] = useState(0);
  const [isDisplayDetails, setIsDisplayDetails] = useState(false);

  const orchestratorAddress = getOrchestratorAddress();

  const handleClickApprove = async () => {
    const approvalEventEmitter = tokenInstance.methods
      .approve(orchestratorAddress, web3.utils.toWei('8', 'ether'))
      .send({ from: selectedAccount })
    approvalEventEmitter.on('receipt', data => {
      onPoolStateChange()
      approvalEventEmitter.removeAllListeners()
    })

    approvalEventEmitter.on('error', data => {
      onPoolStateChange()
      approvalEventEmitter.removeAllListeners()
    })
  }

  const handleClickStake = async () => {
    setOpenStakeDialog(true)
  }

  const handleCloseStakeDialog = async () => {
    if (selectedAccount) {
      setOpenStakeDialog(false)
    }
  }

  const handleConfirmStake = async amount => {
    const stakeEventEmitter: EventEmitter = orchestratorInstance.methods
      .deposit(poolId, web3.utils.toWei(amount, 'ether'))
      .send({ from: selectedAccount })
    stakeEventEmitter.on('receipt', data => {
      onPoolStateChange()
      stakeEventEmitter.removeAllListeners()
    })

    stakeEventEmitter.on('error', data => {
      onPoolStateChange()
      stakeEventEmitter.removeAllListeners()
    })
  }

  const handleClickWithdraw = () => {
    setOpenWithdrawDialog(true)
  }

  const handleCloseWithdrawDialog = async () => {
    setOpenWithdrawDialog(false)
  }

  const handleConfirmWithdraw = async amount => {
    const withdrawEventEmitter = orchestratorInstance.methods
      .withdraw(poolId, web3.utils.toWei(amount, 'ether'))
      .send({ from: selectedAccount })
    withdrawEventEmitter.on('receipt', data => {
      onPoolStateChange()
      withdrawEventEmitter.removeAllListeners()
    })

    withdrawEventEmitter.on('error', data => {
      onPoolStateChange()
      withdrawEventEmitter.removeAllListeners()
    })
  }

  const calculateAPR = () => {
    const apr = getPoolApr(
      stakingTokenPrice,
      tEXOPrice,
      normalizeTokenDecimal(totalStaked).toNumber(),
      normalizeTokenDecimal(tEXOPerBlock).toNumber(),
    );
    setAPR(apr);
  }

  const handleClickClaimRewards = async () => {
    const claimRewardsEventEmitter = orchestratorInstance.methods
      .deposit(poolId, 0)
      .send({ from: selectedAccount })
    claimRewardsEventEmitter.on('receipt', data => {
      onPoolStateChange()
      claimRewardsEventEmitter.removeAllListeners()
    })

    claimRewardsEventEmitter.on('error', data => {
      onPoolStateChange()
      claimRewardsEventEmitter.removeAllListeners()
    })
  }

  const toggleDisplayDetails = () => {
    setIsDisplayDetails(!isDisplayDetails)
  }

  const onToggleRoiDialog = () => {
    setOpenRoiDialog(!openRoiDialog)
  }

  useEffect(() => {
    calculateAPR();
  }, [tEXOPrice, stakingTokenPrice]);

  const poolAllocPointDiv = currentPool ? (
    <div className={styles.poolAllocationPoint}>
       <p>{currentPool.allocPoint / 100} X</p>
    </div>
  ) : null;

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
        <h3>1,482,192$</h3>
      </div>
      <a
        style={{ fontSize: '19px', color: '#007EF3' }}
        href={bsScanLink}
        target="_blank"
      >
        View on Bscan
      </a>
    </div>
  ) : null

  const liquidityPoolDiv = () => (
    <div className={`d-flex justify-between w-full items-center`}>
      <div>
        <img src={icon} alt={title} className={styles.icon} />
      </div>
      <div>
        <p className={`${styles.title} text-right mb-1`}>{title}</p>
        {currentPool && currentPool.depositFeeBP > 0 ? (
          <div className={`d-flex items-center justify-end`}>
            <div className={`${styles.poolAllocationPoint} ${styles.noFeeBag}`}>
              <img src="/static/images/verified.svg" />
              <p>No Fees</p>
            </div>
            {poolAllocPointDiv}
          </div>
        ) : null}
      </div>
    </div>
  )

  return (
    <>
      <div className={styles.poolItem}>
        <div className={styles.poolItemGrid}>
          <div className={styles.item}>
            {isLiquidityPool && <div className={styles.liquidityPoolEffect} />}
            <div className={`${styles.spacing} d-flex items-center column`}>
              {isLiquidityPool ? (
                liquidityPoolDiv()
              ) : (
                <>
                  {poolAllocPointDiv}
                  <div className={styles.poolItemGrid}>
                    <img src={icon} alt={title} className={styles.icon} />
                  </div>

                  <div className={styles.poolItemGrid}>
                    <p className={styles.title}>{title}</p>
                  </div>
                </>
              )}

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
                    {normalizeTokenDecimal(stakedBalance).toNumber().toFixed(4)} {symbol}
                  </p>
                </RowPoolItem>
                <RowPoolItem
                  title="Deposit Fee"
                  containerStyle={`${styles.colorLight}`}
                >
                  <p>
                    {formatDepositFee(currentPool && currentPool.depositFeeBP)}
                  </p>
                </RowPoolItem>
                <RowPoolItem
                  title="My Rewards"
                  containerStyle={`${styles.colorLight}`}
                >
                  <p>
                    {normalizeTokenDecimal(pendingReward).toNumber().toFixed(4)} tEXO
                  </p>
                </RowPoolItem>
                <RowPoolItem title="Total Staked">
                  <p>
                    {normalizeTokenDecimal(totalStaked).toNumber().toFixed(4)} {symbol}
                  </p>
                </RowPoolItem>
                <RowPoolItem
                  title="Wallet Balance"
                  containerStyle={`${styles.wallet}`}
                >
                  <p>
                    {normalizeTokenDecimal(stakingTokenBalance).toNumber().toFixed(4)} {symbol}
                  </p>
                </RowPoolItem>
              </div>

              <div
                className={`${styles.poolItemGrid} w-full ${styles.poolButton}`}
              >
                <>
                  <button
                    type="button"
                    className={`${styles.button} ${
                      canClaimReward ? '' : styles.disabled
                    }`}
                    disabled={!canClaimReward}
                    onClick={handleClickClaimRewards}
                  >
                    Claim Rewards
                  </button>
                  {
                    canWithdraw
                      ? (
                          <Grid container>
                            <Grid item xs={6}>
                              <button
                                type="button"
                                className={`${styles.button} ${styles.withdrawButton}`}
                                onClick={handleClickWithdraw}
                              >
                                Withdraw
                              </button>
                            </Grid>
                            <Grid item xs={6}>
                              <button
                                type="button"
                                className={`${styles.button} ${styles.stakeButton}`}
                                onClick={handleClickStake}
                              >
                                Stake
                              </button>
                            </Grid>
                          </Grid>
                        )
                      : (
                          <button
                            type="button"
                            className={`${styles.button} ${isAlreadyApproved ? '' : styles.disabled}`}
                            disabled={!isAlreadyApproved}
                            onClick={handleClickStake}
                          >
                            Stake
                          </button>
                        )
                    }
                  <button
                    type="button"
                    className={`${styles.button} ${!isAlreadyApproved ? '' : styles.disabled}`}
                    disabled={isAlreadyApproved}
                    onClick={handleClickApprove}
                  >
                    Approve
                  </button>
                </>
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
        depositFee={currentPool && currentPool.depositFeeBP}
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
    </>
  )
}

const RowPoolItem = React.memo(function RowPoolItem(props: any) {
  const { containerStyle, title, children } = props || {}
  return (
    <div
      className={`d-flex items-center justify-between font-bold ${containerStyle}`}
    >
      <p className={styles.pTitle}>{title}</p>
      {children}
    </div>
  )
})

export default PoolItem
