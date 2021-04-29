import App from 'next/app'
import { ApolloProvider } from '@apollo/react-hooks'
import apollo from '~lib/apolloClient'

import MainLayout from './layout'
import '~styles/main.scss'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <ApolloProvider client={apollo}>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
      </ApolloProvider>
    )
  }
}

export default MyApp
