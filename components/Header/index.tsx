import React, {useEffect, useState} from 'react';
import {useWeb3React} from '@web3-react/core';
import Link from 'next/link';

import ConnectPopup from '../ConnectPopup';
import LogoutPopup from '../LogoutPopup';
import Nav from '../Nav';

import styles from './header.module.scss';
import {useEagerConnect, useInactiveListener} from "../../hooks/useConnect";

const Header = () => {
    const [openPopup, setOpenPopup] = useState(false);
    const [openLogoutPopup, setOpenLogoutPopup] = useState(false);
    const {account, active, connector} = useWeb3React();

    // handle logic to recognize the connector currently being activated
    const [activatingConnector, setActivatingConnector] = React.useState<any>()
    React.useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined)
        }
    }, [activatingConnector, connector])

    // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
    const triedEager = useEagerConnect();
    // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
    useInactiveListener(!triedEager || !!activatingConnector)

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
                        <div className={styles.item1}>
                            <Link href="/" >
                                <a className={styles.logo}>
                                    <img src="/static/images/logo.svg" alt="logo"/>
                                </a>
                            </Link>
                        </div>

                        <div className={styles.item2}>
                            <Nav/>
                        </div>

                        <div className={styles.item3}>
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
