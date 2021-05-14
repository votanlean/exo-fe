import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useWeb3React } from '@web3-react/core'
import { getErrorMessage } from '~lib/error'
import Nav from '../Nav/Nav'
import styles from './header.module.scss'
import { metamask, bsc } from '~lib/connector'

const Header = () => {
  const [openPopup, setOpenPopup] = useState(false)
  const [openLogoutPopup, setOpenLogoutPopup] = useState(false)
  const { error } = useWeb3React()

  const { chainId, account, activate, deactivate, active } = useWeb3React()

  //Handle Connect
  const onClickConnect = () => {
    setOpenPopup(true)
  }

  const handleClosePopup = () => {
    setOpenPopup(false)
  }

  const handleConnectMetamask = async () => {
    await activate(metamask)
    setOpenPopup(false)
  }

  const handleConnectBinanceChainWallet = async () => {
    await activate(bsc)
    setOpenPopup(false)
  }

  //Handle Logout
  const onDeactivate = () => {
    setOpenLogoutPopup(true)
  }

  const handleCloseLogoutPopup = () => {
    setOpenLogoutPopup(false)
  }

  const onClickLogout = () => {
    deactivate()
    setOpenLogoutPopup(false)
  }

  //If have error
  useEffect(() => {
    if (error) {
      alert(getErrorMessage(error))
    }
  }, [error])

  //Handle click outside when have popup
  const useOutside = ref => {
    useEffect(() => {
      const handleClickOutside = () => {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpenPopup(false)
          setOpenLogoutPopup(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [ref])
  }

  const wrapperRef = useRef(null)
  useOutside(wrapperRef)

  return (
    <>
      <header
        className={`${styles.header} ${active ? styles.smallHeader : ''}`}
      >
        <div className="container">
          <div className="d-flex items-center justify-between">
            <Link href="/">
              <a className={styles.logo}>
                <img src="/static/images/logo.svg" alt="logo" />
              </a>
            </Link>
            <Nav />
            <button
              className={styles.connectButton}
              onClick={!account ? onClickConnect : onDeactivate}
            >
              {account === null
                ? 'Connect'
                : account
                ? `${account.substring(0, 6)}...${account.substring(
                    account.length - 4,
                  )}`
                : 'Connect'}
            </button>
          </div>
        </div>
      </header>

      {/* Connect Popup */}
      {openPopup && (
        <div className={styles.connectPopup} ref={wrapperRef}>
          <div className={styles.popupHeader}>
            <h2>Connect to wallet</h2>
            <button onClick={handleClosePopup}>
              <span>&times;</span>
            </button>
          </div>
          <div className={styles.popupMain}>
            <button onClick={handleConnectMetamask}>
              <h3>Metamask</h3>
              <img
                src="/static/images/metamask-logo.jpeg"
                alt="metamask-logo"
              />
            </button>
            <button onClick={handleConnectBinanceChainWallet}>
              <h3>Binance Chain Wallet</h3>
              <img
                src="/static/images/binance-chain-wallet-logo.jpeg"
                alt="binance-chain-wallet-logo"
              />
            </button>
          </div>
        </div>
      )}

      {/* Logout Popup */}
      {openLogoutPopup && (
        <div className={styles.connectPopup} ref={wrapperRef}>
          <div className={styles.popupMain}>
            <button className={styles.logoutButton} onClick={onClickLogout}>
              <h3>Log out</h3>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
