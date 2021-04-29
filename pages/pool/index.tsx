import Head from 'next/head'
import PoolItem from '~views/components/PoolItem'
import { poolData } from '../../constant/PoolData'

function Pool() {
  return (
    <>
      <Head>
        <title>Pool</title>
      </Head>

      <div className="container pool-container">
        <div className="pool-grid">
          {poolData.map(pool => (
            <PoolItem data={pool} key={pool.id} />
          ))}
        </div>
      </div>
    </>
  )
}

export default Pool
