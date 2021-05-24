import { useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { Web3ReactProvider } from '@web3-react/core';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

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

  let persistor = persistStore(store);

  return (
    <ThemeProvider theme={theme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Provider store={store}>
          {/*<PersistGate loading={null} persistor={persistor}>*/}
            <MainLayout>
              <Component {...pageProps} />
            </MainLayout>
          {/*</PersistGate>*/}
        </Provider>
      </Web3ReactProvider>
    </ThemeProvider>
  );
}

export default MyApp;
