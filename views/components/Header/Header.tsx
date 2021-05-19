import { useWeb3React } from '@web3-react/core'
import Link from 'next/link'
import Router from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { getErrorMessage } from '~lib/error'
import ConnectPopup from '../ConnectPopup'
import Nav from '../Nav/Nav'
import styles from './header.module.scss'

const Header = () => {
  const [openPopup, setOpenPopup] = useState(false)
  const [openLogoutPopup, setOpenLogoutPopup] = useState(false)
  const { error } = useWeb3React()

  const { chainId, account, activate, deactivate, active } = useWeb3React()

  //Handle Connect
  const handleConnectPopup = popupState => {
    setOpenPopup(popupState)
  }

  //Handle Logout
  const onDeactivate = () => {
    setOpenLogoutPopup(true)
  }

  const handleCloseLogoutPopup = () => {
    setOpenLogoutPopup(false)
  }

  const onClickLogout = () => {
    console.log('not yet')
    deactivate()
    // @ts-ignore
    Router.reload(window.location.pathname)
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
              onClick={!account ? handleConnectPopup : onDeactivate}
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
      {openPopup && <ConnectPopup connectPopup={handleConnectPopup} />}

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
