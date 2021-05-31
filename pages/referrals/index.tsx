declare var window;

import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Input,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { useWeb3React } from '@web3-react/core';

import Button from 'components/Button';
import ConnectPopup from 'components/ConnectPopup';
import styles from './referrals.module.scss';
import { useEagerConnect, useInactiveListener } from 'hooks/useConnect';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      filter: 'drop-shadow(rgba(25, 19, 38, 0.15) 0px 1px 4px)',
      marginTop: '2rem',
      borderRadius: '32px',
    },
    title: {
      textAlign: 'center',
      fontWeight: 600,
    },
    rootHeader: {
      borderBottom: '1px solid rgba(0, 0, 0, 0.38)',
    },
    rootContent: {
      marginTop: '1rem',
      textAlign: 'center',
    },
    desc: {
      fontSize: '20px',
      fontWeight: 600,
      marginTop: '1rem',
    },
    rootTextfield: {
      width: '100%',
      margin: '10px 0',
    },
  };
});

function Referrals() {
  const classes: any = useStyles();
  const { account, active, connector } = useWeb3React();
  const [openPopup, setOpenPopup] = useState(false);
  const [activatingConnector, setActivatingConnector] = useState(null);
  const [referralLink, setReferralLink] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setReferralLink(
        `${window.location.protocol
          .concat('//')
          .concat(
            window.location.host,
          )}?ref=0k34On8831n7711079o1Onp2P4n4R3R7poS9435r4s`,
      );
    }
  }, []);

  // handle logic to recognize the connector currently being activated
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  const onCopyReferralLink = async (e) => {
    try {
      await navigator.clipboard.writeText(referralLink);
    } catch (err) {
      console.log(err);
    }
  };

  const handleConnectPopup = () => {
    setOpenPopup(!openPopup);
  };

  return (
    <>
      <Head>
        <title>Referrals</title>
      </Head>

      <div className={`container ${styles.referralsContainer}`}>
        <Box>
          <Typography variant="h2" className={styles.referralTitle}>
            Exonium Referral Program
          </Typography>

          <Card className={classes.root}>
            <CardHeader
              classes={{ title: classes.title, root: classes.rootHeader }}
              title="Share the referral link below to invite your friends and earn 1% of your friends earnings FOREVER!"
            />
            <CardContent className={classes.rootContent}>
              {!account ? (
                <>
                  <Button
                    className={classes.button}
                    onClick={handleConnectPopup}
                  >
                    Unlock Wallet
                  </Button>
                  <Typography component="p" className={classes.desc}>
                    Unlock wallet to get your unique referral link
                  </Typography>
                </>
              ) : (
                <>
                  <Typography component="p" className={classes.desc}>
                    Your Referral Link
                  </Typography>
                  <TextField
                    id="referral-link"
                    value={referralLink}
                    variant="outlined"
                    className={classes.rootTextfield}
                    disabled={true}
                  />
                  <Button
                    className={classes.button}
                    onClick={onCopyReferralLink}
                  >
                    Copy
                  </Button>

                  <Typography component="p" className={classes.desc}>
                    Total Referrals
                  </Typography>
                  <Typography
                    component="p"
                    className={classes.desc}
                    style={{ marginTop: 0 }}
                  >
                    0
                  </Typography>
                </>
              )}
            </CardContent>
          </Card>
        </Box>
        <ConnectPopup onOpen={openPopup} onCloseDialog={handleConnectPopup} />
      </div>
    </>
  );
}

export default Referrals;
