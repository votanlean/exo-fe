import React from 'react';
import styles from './footer.module.scss';

const Footer = () => (
  <footer className={styles.footer}>
    <div className="container">
      <div className="d-flex justify-between">
        <div className={styles.info}>
          <img src="/static/images/logo-dark.svg" alt="logo" />
          <p>Lorem, ipsum dolor.</p>
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
        <div className={styles.newsletter}>
          <p>Find out about all our news in our newsletter:</p>
          <div className="d-flex">
            <input
              type="text"
              placeholder="Your email"
              className={styles.input}
            />
            <button className={styles.btnSubmit}>Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
