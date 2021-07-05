import rot13 from '../../utils/encode';

declare var window;

import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  makeStyles,
  TextField,
  Typography,
} from '@material-ui/core';
import { useWeb3React } from '@web3-react/core';

import Button from 'components/Button';
import ConnectPopup from 'components/ConnectPopup';
import styles from './referrals.module.scss';
import useReferrals from '../../hooks/useReferral';

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
  const [totalReferrals, setTotalReferrals] = useState(0);
  const { referralsCount } = useReferrals();
  useEffect(() => {
    if (typeof window !== 'undefined' && account) {
      setReferralLink(
        `${window.location.protocol
          .concat('//')
          .concat(window.location.host)}?ref=${rot13(account)}`,
      );
    }
    setTotalReferrals(referralsCount);
  }, [account, referralsCount]);

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
              title="Share the referral link below to invite your friends and earn 2% of your friends earnings FOREVER!"
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
                    {totalReferrals}
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
