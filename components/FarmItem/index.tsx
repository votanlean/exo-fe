import React, { useState } from 'react';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import BigNumber from 'bignumber.js';

import styles from './farmItem.module.scss';
import { getFarmApr } from '../../hookApi/apr';
import { useOrchestratorData } from 'state/orchestrator/selectors';
import { getAddress } from '../../utils/addressHelpers';
import { BIG_ZERO, normalizeTokenDecimal } from 'utils/bigNumber';
import { shouldComponentDisplay } from 'utils/componentDisplayHelper';
import { useOrchestratorContract } from '../../hooks/useContract';
import {
  ApproveAction,
  ClaimRewardsAction,
  RoiAction,
  StakeAction,
  WithdrawAction,
} from 'components/PoolActions';

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
    onPoolStateChange,
    stakingTokenPrice,
    tEXOPrice,
    canClaimReward,
    selectedAccount,
  } = props;
  const {
    icon,
    title,
    symbol,
    pid: farmId,
    address,
    decimals,
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
  const tEXOOrchestratorContract = useOrchestratorContract();

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

  const canWithdraw = new BigNumber(stakedBalance).toNumber() > 0;
  const isAlreadyApproved = new BigNumber(allowance).toNumber() > 0;

  const { tEXOPerBlock, totalAllocPoint } = useOrchestratorData();
  const farmWeight = new BigNumber(allocPoint).div(
    new BigNumber(totalAllocPoint),
  );
  const [isDisplayDetails, setIsDisplayDetails] = useState(false);

  const apr = getFarmApr(
    farmWeight,
    tEXOPrice,
    lpTotalInQuoteToken,
    normalizeTokenDecimal(tEXOPerBlock),
  );

  const toggleDisplayDetails = () => {
    setIsDisplayDetails(!isDisplayDetails);
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
                    <RoiAction apr={apr} tokenPrice={stakingTokenPrice} />
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
                {canClaimReward && Number(stakedBalance) > 0 ? (
                  <ClaimRewardsAction
                    data={dataButton}
                    disabled={!canClaimReward}
                  />
                ) : null}

                {canWithdraw ? <WithdrawAction data={dataButton} /> : null}

                {isAlreadyApproved ? <StakeAction data={dataButton} /> : null}

                {!isAlreadyApproved ? (
                  <ApproveAction data={dataButton} />
                ) : null}
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
