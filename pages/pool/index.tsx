import Head from 'next/head'
import PoolItem from '~views/components/PoolItem'
import { poolData } from '../../constant/PoolData'
import tUSDTInstance from 'binance/tUSDT'
import {poolToken} from '../../binance/tokenFactory';
function Pool() {

  return (
    <>
      <Head>
        <title>Pool</title>
      </Head>

      <div className="container pool-container">
        <div className="pool-grid">
          {poolToken.map(pool => {
              return <PoolItem data={pool} key={pool.id}/>
          }

          )}
        </div>
      </div>
    </>
  )
}

export default Pool
