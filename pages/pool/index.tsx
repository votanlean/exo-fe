import Head from 'next/head'
import { useEffect, useState } from 'react';
import PoolItem from '~views/components/PoolItem'
import {poolToken} from '../../binance/tokenFactory';
import web3 from '../../binance/web3';

function Pool() {
  const [accounts, setAccounts] = useState([]);

  const initAccounts = async () => {
    const userAccounts = await web3.eth.getAccounts();
    setAccounts(userAccounts);
  }

  useEffect(() => {
    initAccounts();
  }, []);

  return (
    <>
      <Head>
        <title>Pool</title>
      </Head>

      <div className="container pool-container">
        <div className="pool-grid">
          {
            poolToken.map(pool => <PoolItem
              selectedAccount={accounts[0]}
              data={pool}
              key={pool.id}
            />)
          }
        </div>
      </div>
    </>
  )
}

export default Pool
