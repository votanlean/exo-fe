import { useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { Web3ReactProvider } from '@web3-react/core';
import { Provider } from 'react-redux';
import { QueryParamProvider } from 'use-query-params';
import { store } from '../state';
import { getLibrary } from '../utils/web3React';
import theme from '../components/theme/theme';
import MainLayout from '../components/Layout';
import '../styles/main.scss';
import { useRouter } from 'next/router';
import * as bsc from '@binance-chain/bsc-use-wallet'

function MyApp({ Component, pageProps }) {
  const router = useRouter()

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
  } as Location

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const chainId = parseInt(process.env.CHAIN_ID);
  const rpcUrl = process.env.BLOCKCHAIN_HOST;
  return (
    <ThemeProvider theme={theme}>
      <bsc.UseWalletProvider
          chainId={chainId}
          connectors={{
            walletconnect: { rpcUrl },
            bsc,
          }}
      >
        <Web3ReactProvider getLibrary={getLibrary}>
          <Provider store={store}>
            <QueryParamProvider history={history} location={location}>
              <MainLayout>
                <Component {...pageProps} />
              </MainLayout>
            </QueryParamProvider>
          </Provider>
        </Web3ReactProvider>
      </bsc.UseWalletProvider>
    </ThemeProvider>
  );
}

export default MyApp;
