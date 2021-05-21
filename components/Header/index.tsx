import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import Link from 'next/link';
import Router from 'next/router';

import { getErrorMessage } from '../../lib/error';
import { bsc, metamask } from '../../lib/connector';
import HeaderPopup from '../HeaderPopup';
import Nav from '../Nav';

import styles from './header.module.scss';

const Header = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openLogoutPopup, setOpenLogoutPopup] = useState(false);
  const { account, active, error, activate, deactivate } = useWeb3React();

  //Handle Connect
  const handleConnectPopup = () => {
    setOpenPopup(!openPopup);
  };

  //Handle Logout
  const handleLogoutPopup = () => {
    setOpenLogoutPopup(!openLogoutPopup);
  };

  const onClickLogout = () => {
    deactivate();
    // @ts-ignore
    Router.reload(window.location.pathname);
    setOpenLogoutPopup(false);
  };

  const handleConnectMetamask = async () => {
    await activate(metamask);
    handleConnectPopup();
  };

  const handleConnectBinanceChainWallet = async () => {
    await activate(bsc);
    handleConnectPopup();
  };

  //If have error
  useEffect(() => {
    if (error) {
      alert(getErrorMessage(error));
    }
  }, [error]);

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
              onClick={!account ? handleConnectPopup : handleLogoutPopup}
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
      <HeaderPopup
        dialogTitle="Connect to wallet"
        onOpen={openPopup}
        onCloseDialog={handleConnectPopup}
        handleConnectMetamask={handleConnectMetamask}
        handleConnectBinanceChainWallet={handleConnectBinanceChainWallet}
      />

      {/* Logout Popup */}
      <HeaderPopup
        isLogout
        onOpen={openLogoutPopup}
        onCloseDialog={handleLogoutPopup}
        handleLogout={onClickLogout}
      />
    </>
  );
};

export default Header;
