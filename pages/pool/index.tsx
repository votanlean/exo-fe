import Head from 'next/head'
import PoolItem from '~views/components/PoolItem'
import {poolToken} from '../../binance/tokenFactory';
import { useWeb3React } from '@web3-react/core'
import Statistic from '../../views/components/Statistic';
function Pool() {
  const {account} = useWeb3React();
  return (
    <>
      <Head>
        <title>Pool</title>
      </Head>

      <div className="container pool-container">
        <div className="pool-grid">
          {
            poolToken.map(pool => <PoolItem
              selectedAccount={account}
              data={pool}
              key={pool.id}
            />)
          }
        </div>
        <Statistic/>
      </div>

    </>
  )
}

export default Pool
