import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import Link from 'next/link';

import ConnectPopup from '../ConnectPopup';
import LogoutPopup from '../LogoutPopup';
import Nav from '../Nav';

import styles from './header.module.scss';

const Header = () => {
  const [openPopup, setOpenPopup] = useState(false);
  const [openLogoutPopup, setOpenLogoutPopup] = useState(false);
  const { account, active } = useWeb3React();

  //Handle Connect
  const handleConnectPopup = () => {
    setOpenPopup(!openPopup);
  };

  //Handle Logout
  const handleLogoutPopup = () => {
    setOpenLogoutPopup(!openLogoutPopup);
  };

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
      <ConnectPopup
        onOpen={openPopup}
        onCloseDialog={handleConnectPopup}
      />

      {/* Logout Popup */}
      <LogoutPopup
        onOpen={openLogoutPopup}
        onCloseDialog={handleLogoutPopup}
      />
    </>
  );
};

export default Header;
