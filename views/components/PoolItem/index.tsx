import React from 'react'
import styles from './poolItem.module.scss'
import web3 from '../../../binance/web3'
import { useEffect, useState } from 'react'
import orchestratorInstance from 'binance/orchestrator'
import { useWeb3React } from '@web3-react/core'
import StakeDialog from './StakeDialog'
import { Grid } from '@material-ui/core'
import { EventEmitter } from 'events'
import WithdrawDialog from './WithdrawDialog'
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ROIDialog from './ROIDialog'
import { getPoolApr } from '~server/shared/apr';

function formatDepositFee(depositFee, decimals = 4) {
  if (!depositFee) {
    return '0%'
  }

  const actualDepositFee = (depositFee * 100) / Math.pow(10, decimals)

  return `${actualDepositFee.toFixed(2)}%`
}

function PoolItem(poolData: any) {
  const {
    data,
    selectedAccount,
    currentBlockHeight,
    onPoolStateChange,
    stakingTokenPrice,
    tEXOPrice,
    liquidityPool,
  } = poolData
  const { id: poolId, icon, title, tokenInstance, symbol, bsScanLink } =
    data || {}

  const [openStakeDialog, setOpenStakeDialog] = useState(false)
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false)
  const [openRoiDialog, setOpenRoiDialog] = useState(false)

  const [currentPool, setCurrentPool] = useState(null)
  const [totalSupply, setTotalSupply] = useState(0)
  const [apr, setAPR] = useState(0);
  const [myStake, setMyStake] = useState(0)
  const [isDisplayDetails, setIsDisplayDetails] = useState(false)
  const [canClaimReward, setCanClaimReward] = useState(false)
  const [currentReward, setCurrentReward] = useState(0)
  const [walletBalance, setWalletBalance] = useState(0)

  const { active } = useWeb3React()

  const orchestratorAddress = process.env.ORCHESTRATOR_ADDRESS;

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
    const apr = getPoolApr(stakingTokenPrice, tEXOPrice, totalSupply, 0.5);
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

  const getTotalSupply = async () => {
    if (selectedAccount) {
      const totalSupply = await tokenInstance.methods
        .balanceOf(orchestratorAddress)
        .call()
      setTotalSupply(totalSupply / Math.pow(10, 18))
    }
  }

  const getMyStake = async () => {
    if (selectedAccount) {
      const myStake = await orchestratorInstance.methods
        .userInfo(poolId, selectedAccount)
        .call()
      setMyStake(myStake[0] / Math.pow(10, 18))
    }
  }

  const getWalletBalance = async () => {
    if (selectedAccount) {
      const walletBalance = await tokenInstance.methods
        .balanceOf(selectedAccount)
        .call()
      setWalletBalance(web3.utils.fromWei(walletBalance, 'ether'))
    }
  }

  const getCurrentReward = async () => {
    if (selectedAccount) {
      const currentReward = await orchestratorInstance.methods
        .pendingTEXO(poolId, selectedAccount)
        .call()
      const rewardInWei = Number(web3.utils.fromWei(currentReward, 'ether'))
      setCurrentReward(Number(rewardInWei.toFixed(5)))
    }
  }

  const getPoolInfo = async () => {
    const currentPool = await orchestratorInstance.methods
      .poolInfo(poolId)
      .call()
    const blockToReceiveReward = currentPool.blockToReceiveReward
    setCurrentPool(currentPool)

    if (selectedAccount) {
      setCanClaimReward(currentBlockHeight >= blockToReceiveReward)
    }
  }

  const toggleDisplayDetails = () => {
    setIsDisplayDetails(!isDisplayDetails)
  }

  const listenForBlockHeightChange = () => {
    getPoolInfo()
    getTotalSupply()
    getMyStake()
    getWalletBalance()
    getCurrentReward()
  }

  const onToggleRoiDialog = () => {
    setOpenRoiDialog(!openRoiDialog)
  }

  useEffect(() => {
    calculateAPR();
  }, [tEXOPrice, stakingTokenPrice]);

  useEffect(listenForBlockHeightChange, [currentBlockHeight])

  const poolAllocPointDiv = currentPool ? (
    <div className={styles.poolAllocationPoint}>
       <p>{currentPool.allocPoint / 100} X</p>
      {/* Temporary */}
      {/*<p>50 X</p>*/}
    </div>
  ) : null

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
            {liquidityPool && <div className={styles.liquidityPoolEffect} />}
            <div className={`${styles.spacing} d-flex items-center column`}>
              {liquidityPool ? (
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
                    {myStake} {symbol}
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
                  <p>{currentReward} tEXO</p>
                </RowPoolItem>
                <RowPoolItem title="Total Staked">
                  <p>
                    {totalSupply} {symbol}
                  </p>
                </RowPoolItem>
                <RowPoolItem
                  title="Wallet Balance"
                  containerStyle={`${styles.wallet}`}
                >
                  <p>
                    {walletBalance} {symbol}
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
                  {active && myStake > 0 ? (
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
                  ) : (
                    <button
                      type="button"
                      className={`${styles.button} ${
                        active ? '' : styles.disabled
                      }`}
                      disabled={!active}
                      onClick={handleClickStake}
                    >
                      Stake
                    </button>
                  )}
                  <button
                    type="button"
                    className={`${styles.button} ${
                      active ? '' : styles.disabled
                    }`}
                    disabled={!active}
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
        maxAmount={walletBalance}
      />
      <WithdrawDialog
        open={openWithdrawDialog}
        title="Withdraw"
        onClose={handleCloseWithdrawDialog}
        onConfirm={handleConfirmWithdraw}
        unit={symbol}
        maxAmount={myStake}
      />
      <ROIDialog open={openRoiDialog} onClose={onToggleRoiDialog} />
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
