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
    liquidityPool,
  } = poolData
  const { id: poolId, icon, title, tokenInstance, symbol, bsScanLink } =
    data || {}

  const [openStakeDialog, setOpenStakeDialog] = useState(false)
  const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false)

  const [currentPool, setCurrentPool] = useState(null)
  const [totalSupply, setTotalSupply] = useState(0)
  const [myStake, setMyStake] = useState(0)
  const [isDisplayDetails, setIsDisplayDetails] = useState(false)
  const [canClaimReward, setCanClaimReward] = useState(false)
  const [currentReward, setCurrentReward] = useState(0)
  const [walletBalance, setWalletBalance] = useState(0)

  const { active } = useWeb3React()

  const orchestratorAddress = '0xdA181fE906Ee2ee23042B73fb0691086bF64e0f9'

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
      const blockNumber = data.blockNumber
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

  useEffect(listenForBlockHeightChange, [currentBlockHeight])

  const poolAllocPointDiv = currentPool ? (
    <div className={styles.poolAllocationPoint}>
      <p>{currentPool.allocPoint} X</p>
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
              <svg
                viewBox="0 0 24 24"
                color="text"
                width="20px"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.verifiedIcon}
              >
                <path d="M23 12L20.56 9.21L20.9 5.52L17.29 4.7L15.4 1.5L12 2.96L8.6 1.5L6.71 4.69L3.1 5.5L3.44 9.2L1 12L3.44 14.79L3.1 18.49L6.71 19.31L8.6 22.5L12 21.03L15.4 22.49L17.29 19.3L20.9 18.48L20.56 14.79L23 12ZM9.38 16.01L7 13.61C6.61 13.22 6.61 12.59 7 12.2L7.07 12.13C7.46 11.74 8.1 11.74 8.49 12.13L10.1 13.75L15.25 8.59C15.64 8.2 16.28 8.2 16.67 8.59L16.74 8.66C17.13 9.05 17.13 9.68 16.74 10.07L10.82 16.01C10.41 16.4 9.78 16.4 9.38 16.01Z"></path>
              </svg>
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
                <div
                  className={`d-flex items-center justify-between font-bold ${styles.colorLight}`}
                >
                  <p className={styles.pTitle}>My Stake</p>
                  <p>
                    {myStake} {symbol}
                  </p>
                </div>
                <div
                  className={`d-flex items-center justify-between font-bold ${styles.colorLight}`}
                >
                  <p className={styles.pTitle}>Deposit Fee</p>
                  <p>
                    {formatDepositFee(currentPool && currentPool.depositFeeBP)}
                  </p>
                </div>
                <div
                  className={`d-flex items-center justify-between font-bold ${styles.colorLight}`}
                >
                  <p className={styles.pTitle}>My Rewards</p>
                  <p>{currentReward} tEXO</p>
                </div>
                <div className="d-flex items-center justify-between">
                  <p className={styles.pTitle}>Total Staked</p>
                  <p>
                    {totalSupply} {symbol}{' '}
                  </p>
                </div>
                <div
                  className={`d-flex items-center justify-between ${styles.wallet}`}
                >
                  <p className={styles.pTitle}>Wallet Balance</p>
                  <p>
                    {walletBalance} {symbol}{' '}
                  </p>
                </div>
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
    </>
  )
}

export default PoolItem
