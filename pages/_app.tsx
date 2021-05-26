import { useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { Web3ReactProvider } from '@web3-react/core';
import { Provider } from 'react-redux';

import { store } from '../state';
import { getLibrary } from '../utils/web3React';
import theme from '../components/theme/theme';
import MainLayout from '../components/Layout';
import '../styles/main.scss';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Provider store={store}>
            <MainLayout>
              <Component {...pageProps} />
            </MainLayout>
        </Provider>
      </Web3ReactProvider>
    </ThemeProvider>
  );
}

export default MyApp;
