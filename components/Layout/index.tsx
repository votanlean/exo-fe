import { useEffect } from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

import Footer from '../Footer';
import Header from '../Header';
import { darkTheme, lightTheme } from 'components/theme/theme';
import { useAppDispatch } from 'state';
import { setDarkMode } from 'state/appTheme';
import { useAppTheme } from 'state/hooks';

const MainLayout = ({ children }) => {
  const dispatch = useAppDispatch();
  const { darkMode } = useAppTheme();

  useEffect(() => {
    const theme = window.localStorage.getItem('preferred-theme');
    if (theme) {
      if (theme === 'dark') {
        dispatch(setDarkMode(true));
      } else {
        dispatch(setDarkMode(false));
      }
    } else {
      window.localStorage.setItem('preferred-theme', 'light');
      dispatch(setDarkMode(false));
    }
  }, []);

  return (
    <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
      <Paper>
        <div className="main-container">
          <Head>
            <link rel="icon" href="/favicon.png" />
          </Head>

          <Header />

          {children}

          <Footer />
        </div>
      </Paper>
    </ThemeProvider>
  );
};

export default MainLayout;
