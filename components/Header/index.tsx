import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import Link from 'next/link';
import { Button, Avatar, Typography } from '@material-ui/core';
import { AccountBalanceWalletOutlined } from '@material-ui/icons';
import { getNetworks } from 'utils/networkHelpers';

import ConnectPopup from '../ConnectPopup';
import LogoutPopup from '../LogoutPopup';
import Nav from '../Nav';
import { useNetwork } from 'state/hooks';

import styles from './header.module.scss';
import { useEagerConnect, useInactiveListener } from "../../hooks/useConnect";
import { useStyles } from './styles';
import SwitchNetworkPopup from 'components/SwitchNetworkPopup';
import NetworkNotify from 'components/NetworkNotify';
import { changeNetwork } from 'state/network';
import { useAppDispatch } from 'state';

const Header = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const networks = getNetworks();
  const [openPopup, setOpenPopup] = useState(false);
  const [openSwitchNetworkPopup, setOpenSwitchNetworkPopup] = useState(false);
  const [openLogoutPopup, setOpenLogoutPopup] = useState(false);
  const { account, active, connector } = useWeb3React();
  const { library } = useWeb3React();
  useEffect(()=>{
    networks.forEach((item)=>{
      if(item.id == parseInt(library?.networkVersion))
      {
        dispatch(changeNetwork(item));
      }
    });
  }, [library?.networkVersion]);
  const network = useNetwork();
  const { icon: networkIcon, name: networkName } = network || {};

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

  const handleSwitchNetworkPopupPopup = () => {
    setOpenSwitchNetworkPopup(!openSwitchNetworkPopup);
  };

  
  const handleNetWorkChange = (item) => {
    dispatch(changeNetwork(item));
  }

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
                  <img src="/static/images/logo.svg" alt="logo" />
                </a>
              </Link>
            </div>

            <div className={styles.item2}>
              <Nav />
            </div>

            <div className={styles.item3}>
              {networks.map((item, index) => (
                <Button
                key={index}
                variant="contained"
                color="primary"
                size="small"
                classes={{ root: classes.networkBtn }}
                onClick={() => handleNetWorkChange(item)}
                className={(network.id === item.id ? '' : classes.active)}
                >
                <Avatar src={item.icon} className={classes.networkIcon} />
                <Typography className={classes.networkName}>{item.name}</Typography>
              </Button>
              ))}
              <Button
                variant="contained"
                color="primary"
                size="small"
                classes={{ root: classes.connectBtn }}
                onClick={!account ? handleConnectPopup : handleLogoutPopup}
                startIcon={<AccountBalanceWalletOutlined />}
              >
                <p className={classes.accAddress}>{account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Connect'}</p>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <NetworkNotify clickHandle={handleSwitchNetworkPopupPopup}/>

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

      <SwitchNetworkPopup onOpen={openSwitchNetworkPopup} onCloseDialog={handleSwitchNetworkPopupPopup} />
    </>
  );
};

export default Header;
