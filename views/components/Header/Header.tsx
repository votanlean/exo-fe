import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { useWeb3React } from '@web3-react/core'
import web3  from 'binance/web3';
import { getErrorMessage } from '~lib/error'
import Nav from '../Nav/Nav'
import styles from './header.module.scss'
import { AccountContext } from '../../../Context/context'

const Header = () => {

  // const { account: accountData, updateAccount } = useContext(AccountContext);
  // console.log('testAccountContext', accountData)


  const [active, setActive] = useState(false)
  const [account, setAccount] = useState('')
	const [errorMesage, setErrorMessage] = useState<string | undefined | null>();
	const { error, activate, deactivate } = useWeb3React();


	const onClickConnect = async () => {
	  const accounts = await web3.eth.getAccounts()
    setAccount(accounts[0])
    // updateAccount(accounts[0]);
	}

	const onDeactivate = async () => {
		setAccount(null);
    // updateAccount(null);
	}

	useEffect(() => {
		if (error) {
			setErrorMessage(getErrorMessage(error));
		}
	}, [error])

	useEffect(() => {
		if (errorMesage) {
			alert(errorMesage)
			setErrorMessage(null)
		}
	}, [errorMesage])

  const onScroll = (e) => {
    if (e.target.documentElement.scrollTop > 400) {
      setActive(true)
    } else {
      setActive(false)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
        <header className={`${styles.header} ${active ? styles.smallHeader : ''}`}>
          <div className="container" >
            <div className="d-flex items-center justify-between">
              <Link href="/">
                <a className={styles.logo}>
                  <img src="/static/images/logo.svg" alt="logo" />
                </a>
              </Link>
              <Nav />
              <button className={styles.connectButton} onClick={!account ? onClickConnect : onDeactivate}>
                {account === null
                  ? 'Connect'
                  : account
                    ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}`
                    : 'Connect'}
              </button>
            </div>
          </div>
        </header>

  )
}

export default Header
