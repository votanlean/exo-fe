import { ApolloProvider } from '@apollo/react-hooks'
import { ThemeProvider } from '@material-ui/core/styles'
import { Web3ReactProvider } from '@web3-react/core'
import React, { useEffect } from 'react'
import apollo from '~lib/apolloClient'
import { getLibrary } from '~lib/web3'
import '~styles/main.scss'
import MainLayout from './layout'
import theme from '../lib/theme/theme'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ApolloProvider client={apollo}>
          <MainLayout>
            <Component {...pageProps} />
          </MainLayout>
        </ApolloProvider>
      </Web3ReactProvider>
    </ThemeProvider>
  )
}

export default MyApp
