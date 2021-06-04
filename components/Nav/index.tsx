import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ActiveLink from '../ActiveLink';

import styles from './nav.module.scss';

const data = [
  { title: 'Home', path: '/' },
  { title: 'Pool', path: '/pool' },
  { title: 'Exchange', path: '/exchange' },
  { title: 'tASSET', path: '/tASSET' },
  { title: 'Bridge', path: '/bridge' },
  { title: 'GOV', path: '/governance' },
];

const Nav = (props) => {
  const { asPath } = useRouter();
  const [isExpandedMenu, setIsExpandedMenu] = useState(false);

  const handleOpenBurger = () => {
    setIsExpandedMenu(true);
  };

  const handleCloseBurger = () => {
    setIsExpandedMenu(false);
  };
  return (
    <nav>
      <i
        className={styles.faBars}
        onClick={!isExpandedMenu ? handleOpenBurger : handleCloseBurger}
      >
        <div className={styles.hamburger}></div>
        <div className={styles.hamburger}></div>
        <div className={styles.hamburger}></div>
      </i>

      <ul className={`${styles.menu} ${isExpandedMenu ? styles.active : ''}`}>
        {data.map((menu, index) =>
          menu.title === 'Bridge' ? (
            <li key={index}>
              <a
                href="https://www.binance.org/en/bridge"
                target="_blank"
                className={`${styles.menuLink} menu-link`}
                onClick={handleCloseBurger}
              >
                Bridge
              </a>
            </li>
          ) : (
            <li key={index}>
              <ActiveLink href={menu.path}>
                <a
                  className={`${styles.menuLink} menu-link `}
                  onClick={handleCloseBurger}
                >
                  {menu.title}
                </a>
              </ActiveLink>
            </li>
          ),
        )}
        <li>
          <a
            href="https://texo.gitbook.io/exoniumdex"
            target="_blank"
            className={`${styles.menuLink} menu-link`}
            onClick={handleCloseBurger}
          >
            Docs
          </a>
        </li>
        <li>
          <a
            href="https://medium.com/exonium-exchange"
            target="_blank"
            className={`${styles.menuLink} menu-link`}
            onClick={handleCloseBurger}
          >
            Blog
          </a>
        </li>
        <li>
          <ActiveLink href="/referrals">
            <a
              className={`${styles.menuLink} menu-link `}
              onClick={handleCloseBurger}
            >
              Referrals
            </a>
          </ActiveLink>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
