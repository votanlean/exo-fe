import styles from './poolItem.module.scss'
import web3 from '../../../binance/web3'
import { useEffect, useState } from 'react'
import tEXOTokenInstance from 'binance/tEXOToken'
import orchestratorInstance from 'binance/orchestrator'

function PoolItem({ data }) {
  const {
    id: poolId,
    icon,
    title,
    tokenInstance,
    symbol,
  } = data || {}

  const [totalSupply, setTotalSupply] = useState(0)
  const [myStake, setMyStake] = useState(0)
  const [currentReward, setCurrentReward] = useState(0)
  const [walletBalance, setWalletBalance] = useState(0)

  const orchestratorAddress = '0x7c3203Bc44e6b49c3cbfBc0F472Ae35E3aa23012';
  const handleClickApprove = async () => {
    const accounts = await web3.eth.getAccounts();
    tokenInstance.methods.approve(orchestratorAddress, web3.utils.toWei('8', 'ether')).send({ from: accounts[0] });
  }

  const handleClickStake = async () => {
    const accounts = await web3.eth.getAccounts();
    orchestratorInstance.methods.deposit(poolId, web3.utils.toWei('1', 'ether')).send({ from: accounts[0] });
  }

  const handleClickClaimRewards = async () => {
    const accounts = await web3.eth.getAccounts();
    orchestratorInstance.methods.deposit(poolId, 0).send({ from: accounts[0] });
  }


  // const account = useContext(AccountContext);

  useEffect(() => {
    const getAllowance = async () => {
      const accounts = await web3.eth.getAccounts();
      if (accounts[0]) {
        const allowance = await tEXOTokenInstance.methods.allowance(accounts[0], orchestratorAddress).call();
      }

    }
    getAllowance();

    const getTotalSupply = async () => {
      const accounts = await web3.eth.getAccounts();
      if (accounts[0]) {
        const totalSupply = await tokenInstance.methods.balanceOf(orchestratorAddress).call();
        setTotalSupply(totalSupply / Math.pow(10, 18));
      }
    }
    getTotalSupply();

    const getMyStake = async () => {
      const accounts = await web3.eth.getAccounts();
      if (accounts[0]) {
        const myStake = await orchestratorInstance.methods.userInfo(poolId, accounts[0]).call();
        setMyStake(myStake[0] / Math.pow(10, 18));
      }
    }
    getMyStake();

    const getWalletBalance = async () => {
      const accounts = await web3.eth.getAccounts();
      if (accounts[0]) {
        const walletBalance = await tokenInstance.methods.balanceOf(accounts[0]).call();
        setWalletBalance(web3.utils.fromWei(walletBalance, 'ether'));
      }
    }
    getWalletBalance();

    const getCurrentReward = async () => {
      const accounts = await web3.eth.getAccounts();
      if (accounts[0]) {
        const currentReward = await orchestratorInstance.methods.pendingTEXO(poolId, accounts[0]).call();
        setCurrentReward(web3.utils.fromWei(currentReward, 'ether'));
      }
    }
    getCurrentReward();

  })



  return (
      <div className={styles.poolItem}>
        <div className={styles.poolItemGrid}>
          <div className={styles.item}>
            <div className={`${styles.spacing} d-flex items-center column`}>
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
                    className={styles.button}
                    onClick={handleClickClaimRewards}
                  >
                    Claim Rewards
                  </button>
                  <button
                    type="button"
                    className={styles.button}
                    onClick={handleClickStake}
                  >
                    Stake
                  </button>
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
  )
}

export default PoolItem
