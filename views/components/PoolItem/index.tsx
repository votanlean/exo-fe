import styles from './poolItem.module.scss'
import web3 from '../../../binance/web3'
import { useEffect, useState } from 'react'
import orchestratorInstance from 'binance/orchestrator'
import StakeDialog from './StakeDialog'
import { Grid } from '@material-ui/core';

function PoolItem({ data, selectedAccount }) {
  const {
    id: poolId,
    icon,
    title,
    tokenInstance,
    symbol,
  } = data || {};

	const [openStakeDialog, setOpenStakeDialog] = useState(false);
	const [openUnstakeDialog, setOpenUnstakeDialog] = useState(false);

  const [currentPool, setCurrentPool] = useState(null);
  const [totalSupply, setTotalSupply] = useState(0);
  const [myStake, setMyStake] = useState(0);
  const [canClaimReward, setCanClaimReward] = useState(false);
  const [currentBlockHeight, setCurrentBlockHeight] = useState(0);
  const [currentReward, setCurrentReward] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);

  const orchestratorAddress = '0x7c3203Bc44e6b49c3cbfBc0F472Ae35E3aa23012';

  const handleClickApprove = async () => {
    const approvalEventEmitter = tokenInstance.methods.approve(orchestratorAddress, web3.utils.toWei('8', 'ether')).send({ from: selectedAccount });
    approvalEventEmitter.on('receipt', (data) => {
      const blockNumber = data.blockNumber;
      setCurrentBlockHeight(blockNumber);
    });

    approvalEventEmitter.on('error', (data) => {
      const blockNumber = data.blockNumber;
      setCurrentBlockHeight(blockNumber);
    });
  }

  const handleClickStake = async () => {
		if (selectedAccount) {
			setOpenStakeDialog(true);
		}
  }

	const handleCloseStakeDialog = async () => {
		if (selectedAccount) {
			setOpenStakeDialog(false);
		}
  }

	const handleConfirmStake = async (amount) => {
		const stakeEventEmitter = orchestratorInstance.methods.deposit(poolId, amount).send({ from: selectedAccount });
    stakeEventEmitter.on('receipt', (data) => {
      const blockNumber = data.blockNumber;
      setCurrentBlockHeight(blockNumber);
    });

    stakeEventEmitter.on('error', (data) => {
      const blockNumber = data.blockNumber;
      setCurrentBlockHeight(blockNumber);
    });
	}

	const handleClickUnstake = () => {
		setOpenUnstakeDialog(true);
	}

	const handleCloseUnstakeDialog = async () => {
		setOpenUnstakeDialog(false);
  }

	const handleConfirmUnstake = async (amount) => {
		const unstakeEventEmitter = orchestratorInstance.methods.withdraw(poolId, amount).send({ from: selectedAccount });
    unstakeEventEmitter.on('receipt', (data) => {
      const blockNumber = data.blockNumber;
      setCurrentBlockHeight(blockNumber);
    });

    unstakeEventEmitter.on('error', (data) => {
      const blockNumber = data.blockNumber;
      setCurrentBlockHeight(blockNumber);
    });
	}

  const handleClickClaimRewards = async () => {
    const claimRewardsEventEmitter = orchestratorInstance.methods.deposit(poolId, 0).send({ from: selectedAccount });
    claimRewardsEventEmitter.on('receipt', (data) => {
      const blockNumber = data.blockNumber;
      setCurrentBlockHeight(blockNumber);
    });

    claimRewardsEventEmitter.on('error', (data) => {
      const blockNumber = data.blockNumber;
      setCurrentBlockHeight(blockNumber);
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
    const poolStartClaimRewardBlock = currentPool.startBlock;
    setCurrentPool(currentPool);
    setCanClaimReward(currentBlockHeight >= poolStartClaimRewardBlock);
  }

  const getCurrentBlockHeight = async () => {
    const currentBlockHeight = await web3.eth.getBlockNumber();
    setCurrentBlockHeight(currentBlockHeight);
  }

  const listenForBlockHeightChange = () => {
    getPoolInfo();
    getTotalSupply();
    getMyStake();
    getWalletBalance();
    getCurrentReward();
  };

  useEffect(() => {
    const interval = setInterval(getCurrentBlockHeight, 500);

    return () => clearInterval(interval);
  }, []);

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
                    onClick={canClaimReward ? handleClickClaimRewards : null}
                  >
                    Claim Rewards
                  </button>
                  {selectedAccount && myStake > 0 ? (
										<Grid container>
											<Grid item xs={6}>
													<button
														type="button"
														className={`${styles.button} ${styles.unstakeButton}`}
														onClick={handleClickUnstake}
													>
														Unstake
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
											className={styles.button}
											onClick={handleClickStake}
										>
											Stake
										</button>
									)}
                  <button
                    type="button"
                    className={styles.button}
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
				maxAmount={walletBalance}
			/>
			<StakeDialog
				open={openUnstakeDialog}
				title="Unstake"
				onClose={handleCloseUnstakeDialog}
				onConfirm={handleConfirmUnstake}
				unit={symbol}
				maxAmount={myStake}
			/>
		</>
  )
}

export default PoolItem
