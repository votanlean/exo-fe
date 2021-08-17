import React, { useState } from 'react';
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
} from '@material-ui/core';
import { Brightness2, Menu, MenuOpen, WbSunny } from '@material-ui/icons';
import { useRouter } from 'next/router';

import ActiveLink from '../ActiveLink';
import { useAppDispatch } from 'state';
import { setDarkMode } from 'state/appTheme';
import { useAppTheme } from 'state/hooks';

import { useStyles } from './styles';
import styles from './nav.module.scss';

const data = [
  { title: 'Home', path: '/' },
  { title: 'Pool', path: '/pool' },
  { title: 'Exchange', path: '/exchange' },
  { title: 'tASSET', path: '/tASSET' },
  { title: 'GOV', path: '/governance' },
  {
    title: 'Docs',
    path: 'https://texo.gitbook.io/exoniumdex',
    target: '_blank',
  },
  {
    title: 'Blog',
    path: 'https://medium.com/exonium-exchange',
    target: '_blank',
  },
  { title: 'Referrals', path: '/referrals' },
];

const Nav = () => {
  const classes = useStyles();
  const [isExpandedMenu, setIsExpandedMenu] = useState(false);
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const router = useRouter();
  const { darkMode } = useAppTheme();
  const dispatch = useAppDispatch();

  const toggleMenuMobile = () => {
    setIsExpandedMenu(!isExpandedMenu);
  };

  const onToggleThemePreferred = () => {
    const preferred = window.localStorage.getItem('preferred-theme');
    if (preferred === 'dark') {
      window.localStorage.setItem('preferred-theme', 'light');
      dispatch(setDarkMode(false));
    } else {
      window.localStorage.setItem('preferred-theme', 'dark');
      dispatch(setDarkMode(true));
    }
  };

  return (
    <nav>
      {isTablet ? (
        <div className={classes.drawer}>
          <IconButton
            onClick={toggleMenuMobile}
            style={{ padding: 7, color: '#ffffff' }}
          >
            {isExpandedMenu ? <MenuOpen /> : <Menu />}
          </IconButton>

          <Drawer
            anchor="left"
            open={isExpandedMenu}
            onClose={toggleMenuMobile}
            disableScrollLock
            classes={{
              paper: classes.drawerPaper,
            }}
          >
            <div className={classes.toolbar} />
            <Divider />
            <List>
              {data.map((menu) => (
                <ListItem button key={menu.title} className={classes.listItem}>
                  <div
                    className={
                      router.pathname === menu.path ? classes.activeMenu : ''
                    }
                  />
                  <a
                    href={menu.path}
                    className={`${styles.menuLink} menu-link`}
                    onClick={toggleMenuMobile}
                  >
                    <ListItemText primary={menu.title} />
                  </a>
                </ListItem>
              ))}
            </List>
            <div className={classes.toolbarFooter}>
              <Divider />
              <IconButton
                className={classes.toggleDarkModeBtn}
                onClick={onToggleThemePreferred}
              >
                <WbSunny style={{ opacity: darkMode ? 0.4 : 1 }} /> /{' '}
                <Brightness2 style={{ opacity: darkMode ? 1 : 0.4 }} />
              </IconButton>
            </div>
          </Drawer>
        </div>
      ) : (
        <ul className={styles.menu}>
          {data.map((menu, index) => (
            <li key={index}>
              <ActiveLink href={menu.path} target={menu?.target}>
                <a className={`${styles.menuLink} menu-link`}>{menu.title}</a>
              </ActiveLink>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
};

export default Nav;
