import React from 'react';
import { useRouter } from 'next/router';
import ActiveLink from '../ActiveLink';

import styles from './nav.module.scss';

const data = [
  { title: 'Home', path: '/' },
  { title: 'Pool', path: '/pool' },
  { title: 'Exchange', path: '/exchange' },
  { title: 'Mint', path: '/mint' },
  { title: 'Bridge', path: '/bridge' },
  { title: 'Governance', path: '/governance' },
];

const Nav = () => {
  const { asPath } = useRouter();

  return (
    <nav>
      <ul className={styles.menu}>
        {data.map((menu, index) =>
          menu.title === 'Bridge' ? (
            <li key={index}>
              <a
                href="https://www.binance.org/en/bridge"
                target="_blank"
                className={`${styles.menuLink} menu-link`}
              >
                Bridge
              </a>
            </li>
          ) : (
            <li key={index}>
              <ActiveLink href={menu.path}>
                <a className={`${styles.menuLink} menu-link`}>{menu.title}</a>
              </ActiveLink>
            </li>
          ),
        )}
        <li>
          <a
            href="https://texo.gitbook.io/exoniumdex"
            target="_blank"
            className={`${styles.menuLink} menu-link`}
          >
            Docs
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
