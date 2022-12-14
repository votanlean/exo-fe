import { useEffect } from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import { Provider } from 'react-redux';
import { QueryParamProvider } from 'use-query-params';

import { store } from '../state';
import { getLibrary } from '../utils/web3React';
import MainLayout from '../components/Layout';
import '../styles/main.scss';
import { useRouter } from 'next/router';
import { RefreshContextProvider } from 'contexts/RefreshContext'

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  // eslint-disable-next-line no-shadow
  const history = {
    push: ({ search }: Location) =>
      router.push({ search, pathname: router.pathname }),

    replace: ({ search }: Location) =>
      router.replace({ search, pathname: router.pathname }),
  }

  // eslint-disable-next-line no-shadow
  const location = {
    search: router.asPath.replace(/[^?]+/u, ''),
  } as Location;

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <Provider store={store}>
        <QueryParamProvider history={history} location={location}>
          <RefreshContextProvider>
            <MainLayout>
              <Component {...pageProps} />
            </MainLayout>
          </RefreshContextProvider>
        </QueryParamProvider>
      </Provider>
    </Web3ReactProvider>
  );
}

export default MyApp;
