import React from 'react';
import { Box, makeStyles } from '@material-ui/core';
import { Twitter, Telegram, Facebook, LinkedIn } from '@material-ui/icons';

import { useAppTheme } from 'state/hooks';
import styles from './footer.module.scss';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      background: theme.palette.themeBg.default,
    },
  };
});

const Footer = () => {
  const { darkMode } = useAppTheme();
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <footer className={styles.footer}>
        <div className="container">
          <div className="d-flex justify-between">
            <div className={styles.info}>
              {darkMode ? (
                <img src="/static/images/logo-white.svg" alt="logo" />
              ) : (
                <img src="/static/images/logo-dark.svg" alt="logo" />
              )}

              <ul>
                <li>
                  <a href="https://twitter.com/ExoniumDex">
                    <Twitter style={{ color: darkMode ? 'white' : 'black' }} />
                  </a>
                </li>
                <li>
                  <a href="https://t.me/exoniumofficial">
                    <Telegram style={{ color: darkMode ? 'white' : 'black' }} />
                  </a>
                </li>
                <li>
                  <a href="https://www.facebook.com/Exoniumdex">
                    <Facebook style={{ color: darkMode ? 'white' : 'black' }} />
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/company/exoniumdex">
                    <LinkedIn style={{ color: darkMode ? 'white' : 'black' }} />
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </Box>
  );
};

export default Footer;
