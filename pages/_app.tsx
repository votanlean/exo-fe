import App from 'next/app'
import { Web3ReactProvider } from '@web3-react/core';
import { ApolloProvider } from '@apollo/react-hooks'
import apollo from '~lib/apolloClient'
import { getLibrary } from '~lib/web3';
import MainLayout from './layout'
import '~styles/main.scss'

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props
		return (
				<Web3ReactProvider getLibrary={getLibrary}>
					<ApolloProvider client={apollo}>
							<MainLayout>
								<Component {...pageProps} />
							</MainLayout>
					</ApolloProvider>
				</Web3ReactProvider>
    )
  }
}

export default MyApp
