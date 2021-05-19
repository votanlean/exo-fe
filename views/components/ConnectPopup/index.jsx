import { useWeb3React } from '@web3-react/core'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import { bsc, metamask } from '~lib/connector'
import { getErrorMessage } from '~lib/error'
import styles from './connectPopup.module.scss'

ConnectPopup.propTypes = {
  connectPopup: PropTypes.func,
}

function ConnectPopup(props) {
  const [closePopup, setClosePopup] = useState(false)
  const { error } = useWeb3React()
  const { chainId, account, activate, deactivate, active } = useWeb3React()

  //Handle Connect
  const handleConnectPopup = () => {
    const { connectPopup } = props
    connectPopup(closePopup)
  }

  //Connect Wallet
  const handleConnectMetamask = async () => {
    await activate(metamask)
    handleConnectPopup()
  }

  const handleConnectBinanceChainWallet = async () => {
    await activate(bsc)
    handleConnectPopup()
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
          handleConnectPopup()
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
    <div className={styles.connectPopup} ref={wrapperRef}>
      <div className={styles.popupHeader}>
        <h2>Connect to wallet</h2>
        <button onClick={handleConnectPopup}>
          <span>&times;</span>
        </button>
      </div>
      <div className={styles.popupMain}>
        <button onClick={handleConnectMetamask}>
          <h3>Metamask</h3>
          <img src="/static/images/metamask-logo.jpeg" alt="metamask-logo" />
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
  )
}

export default ConnectPopup
