import React from 'react';
import styles from './footer.module.scss';

const Footer = () => (
  <footer className={styles.footer}>
    <div className="container">
      <div className="d-flex justify-between">
        <div className={styles.info}>
          <img src="/static/images/logo-dark.svg" alt="logo" />
          <ul>
            <li>
              <a href="https://twitter.com/ExoniumDex">
                <img
                  src="/static/images/social-icon/twitter.png"
                  alt="twitter"
                />
              </a>
            </li>
            <li>
              <a href="https://t.me/exoniumofficial">
                <img
                  src="/static/images/social-icon/telegram.png"
                  alt="telegram"
                />
              </a>
            </li>
            <li>
              <a href="https://www.facebook.com/Exoniumdex">
                <img
                  src="/static/images/social-icon/facebook.png"
                  alt="facebook"
                />
              </a>
            </li>
            <li>
              <a href="https://www.linkedin.com/company/exoniumdex">
                <img
                  src="/static/images/social-icon/linkedin.png"
                  alt="linkedin"
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;