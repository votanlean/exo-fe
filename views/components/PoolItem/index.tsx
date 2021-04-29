import styles from './poolItem.module.scss'

function PoolItem({ data }) {
  const {
    id,
    icon,
    title,
    myStake,
    myRewards,
    totalStaked,
    apr,
    walletBalance,
  } = data || {}
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
                <p>{myStake}</p>
              </div>
              <div
                className={`d-flex items-center justify-between font-bold ${styles.colorLight}`}
              >
                <p className={styles.pTitle}>My Rewards</p>
                <p>{myRewards}</p>
              </div>
              <div className="d-flex items-center justify-between">
                <p className={styles.pTitle}>Total Staked</p>
                <p>{totalStaked}</p>
              </div>
              <div className="d-flex items-center justify-between">
                <p className={styles.pTitle}>APR</p>
                <p>{apr}</p>
              </div>
              <div
                className={`d-flex items-center justify-between ${styles.wallet}`}
              >
                <p className={styles.pTitle}>Wallet Balance</p>
                <p>{walletBalance}</p>
              </div>
            </div>
            <div
              className={`${styles.poolItemGrid} w-full ${styles.poolButton}`}
            >
              <button type="button" className={styles.button}>
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PoolItem
