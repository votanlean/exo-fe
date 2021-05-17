import styles from './poolItem.module.scss';
import web3 from '../../../binance/web3';
import { useEffect, useState } from 'react';
import orchestratorInstance from 'binance/orchestrator';
import { useWeb3React } from '@web3-react/core';
import StakeDialog from './StakeDialog';
import { Grid } from '@material-ui/core';
import { EventEmitter } from 'events';
import WithdrawDialog from './WithdrawDialog';

function formatDepositFee(depositFee, decimals = 4) {
  if (!depositFee) {
    return '0%';
  }

  const actualDepositFee = depositFee * 100 / Math.pow(10, decimals);

  return `${actualDepositFee.toFixed(2)}%`;
}

function PoolItem({ data, selectedAccount, currentBlockHeight, onPoolStateChange }) {
  const {
    id: poolId,
    icon,
    title,
    tokenInstance,
    symbol,
  } = data || {};

	const [openStakeDialog, setOpenStakeDialog] = useState(false);
	const [openWithdrawDialog, setOpenWithdrawDialog] = useState(false);

  const [currentPool, setCurrentPool] = useState(null);
  const [totalSupply, setTotalSupply] = useState(0);
  const [myStake, setMyStake] = useState(0);
  const [timeToClaimReward, setTimeToClaimReward] = useState(0);
  const [canClaimReward, setCanClaimReward] = useState(false);
  const [currentReward, setCurrentReward] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);

  const { active } = useWeb3React();

  const orchestratorAddress = '0xdA181fE906Ee2ee23042B73fb0691086bF64e0f9';

  const handleClickApprove = async () => {
    const approvalEventEmitter = tokenInstance.methods.approve(orchestratorAddress, web3.utils.toWei('8', 'ether')).send({ from: selectedAccount });
    approvalEventEmitter.on('receipt', (data) => {
      onPoolStateChange();
      approvalEventEmitter.removeAllListeners();
    });

    approvalEventEmitter.on('error', (data) => {
      onPoolStateChange();
      approvalEventEmitter.removeAllListeners();
    });
  }

  const handleClickStake = async () => {
    setOpenStakeDialog(true);

  }

  const handleCloseStakeDialog = async () => {
    if (selectedAccount) {
      setOpenStakeDialog(false);
    }
  }

  const handleConfirmStake = async (amount) => {
    const stakeEventEmitter: EventEmitter = orchestratorInstance.methods.deposit(poolId, web3.utils.toWei(amount, 'ether')).send({ from: selectedAccount });
    stakeEventEmitter.on('receipt', (data) => {
      onPoolStateChange();
      stakeEventEmitter.removeAllListeners();
    });

    stakeEventEmitter.on('error', (data) => {
      const blockNumber = data.blockNumber;
      onPoolStateChange();
      stakeEventEmitter.removeAllListeners();
    });
  }

  const handleClickWithdraw = () => {
    setOpenWithdrawDialog(true);
  }

  const handleCloseWithdrawDialog = async () => {
    setOpenWithdrawDialog(false);
  }

  const handleConfirmWithdraw = async (amount) => {
    const withdrawEventEmitter = orchestratorInstance.methods.withdraw(poolId, web3.utils.toWei(amount, 'ether')).send({ from: selectedAccount });
    withdrawEventEmitter.on('receipt', (data) => {
      onPoolStateChange();
      withdrawEventEmitter.removeAllListeners();
    });

    withdrawEventEmitter.on('error', (data) => {
      onPoolStateChange();
      withdrawEventEmitter.removeAllListeners();
    });
  }

  const handleClickClaimRewards = async () => {
    const claimRewardsEventEmitter = orchestratorInstance.methods.deposit(poolId, 0).send({ from: selectedAccount });
    claimRewardsEventEmitter.on('receipt', (data) => {
      onPoolStateChange();
      claimRewardsEventEmitter.removeAllListeners();
    });

    claimRewardsEventEmitter.on('error', (data) => {
      onPoolStateChange();
      claimRewardsEventEmitter.removeAllListeners();
    });
  }

  const getTotalSupply = async () => {
    if (selectedAccount) {
      const totalSupply = await tokenInstance.methods.balanceOf(orchestratorAddress).call();
      setTotalSupply(totalSupply / Math.pow(10, 18));
    }
  }

  const getMyStake = async () => {
    if (selectedAccount) {
      const myStake = await orchestratorInstance.methods.userInfo(poolId, selectedAccount).call();
      setMyStake(myStake[0] / Math.pow(10, 18));
    }
  }

  const getWalletBalance = async () => {
    if (selectedAccount) {
      const walletBalance = await tokenInstance.methods.balanceOf(selectedAccount).call();
      setWalletBalance(web3.utils.fromWei(walletBalance, 'ether'));
    }
  }

  const getCurrentReward = async () => {
    if (selectedAccount) {
      const currentReward = await orchestratorInstance.methods.pendingTEXO(poolId, selectedAccount).call();
      const rewardInWei = Number(web3.utils.fromWei(currentReward, 'ether'));
      setCurrentReward(Number(rewardInWei.toFixed(5)));
    }
  }

  const getPoolInfo = async () => {
    const currentPool = await orchestratorInstance.methods.poolInfo(poolId).call();
    const blockToReceiveReward = currentPool.blockToReceiveReward;
    setCurrentPool(currentPool);

    if (selectedAccount) {
      setCanClaimReward(currentBlockHeight >= blockToReceiveReward);
    }
  }

  const listenForBlockHeightChange = () => {
    getPoolInfo();
    getTotalSupply();
    getMyStake();
    getWalletBalance();
    getCurrentReward();
  };

  useEffect(listenForBlockHeightChange, [currentBlockHeight])

  const poolAllocPointDiv = currentPool
    ? <div className={styles.poolAllocationPoint}>
        <p>{currentPool.allocPoint} X</p>
      </div>
    : null;

  return (
		<>
      <div className={styles.poolItem}>
        <div className={styles.poolItemGrid}>
          <div className={styles.item}>
            <div className={`${styles.spacing} d-flex items-center column`}>
              { poolAllocPointDiv }
              <div className={styles.poolItemGrid}>
                <img src={icon} alt={title} className={styles.icon} />
              </div>
              <div className={styles.poolItemGrid}>
                <p className={styles.title}>{title}</p>
              </div>
              <div className={`${styles.poolItemGrid} w-full`}>
                <div
                  className={`d-flex items-center justify-between font-bold ${styles.colorLight}`}
                >
                  <p className={styles.pTitle}>My Stake</p>
                  <p>{myStake} {symbol}</p>
                </div>
                <div
                  className={`d-flex items-center justify-between font-bold ${styles.colorLight}`}
                >
                  <p className={styles.pTitle}>Deposit Fee</p>
                  <p>{formatDepositFee(currentPool && currentPool.depositFeeBP)}</p>
                </div>
                <div
                  className={`d-flex items-center justify-between font-bold ${styles.colorLight}`}
                >
                  <p className={styles.pTitle}>My Rewards</p>
                  <p>{currentReward} tEXO</p>
                </div>
                <div className="d-flex items-center justify-between">
                  <p className={styles.pTitle}>Total Staked</p>
                  <p>{totalSupply} {symbol} </p>
                </div>
                <div
                  className={`d-flex items-center justify-between ${styles.wallet}`}
                >
                  <p className={styles.pTitle}>Wallet Balance</p>
                  <p>{walletBalance} {symbol} </p>
                </div>
              </div>
              <div
                className={`${styles.poolItemGrid} w-full ${styles.poolButton}`}
              >
                <>
                  <button
                    type="button"
                    className={`${styles.button} ${canClaimReward ? '' : styles.disabled}`}
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
                      className={`${styles.button} ${active ? '' : styles.disabled}`}
                      disabled={!active}
                      onClick={handleClickStake}
                    >
                      Stake
                    </button>
                  )}
                  <button
                    type="button"
                    className={`${styles.button} ${active ? '' : styles.disabled}`}
                    disabled={!active}
                    onClick={handleClickApprove}
                  >
                    Approve
                  </button>
                </>
              </div>
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
