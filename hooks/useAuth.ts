import { useCallback } from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { NoBscProviderError } from '@binance-chain/bsc-connector'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import {
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
  WalletConnectConnector,
} from '@web3-react/walletconnect-connector'
import {connectorLocalStorageKey, ConnectorNames, connectorsByName} from 'utils/web3React'
import { setupNetwork } from 'utils/wallet'
import { useAppDispatch } from 'state'
import { useNetwork } from 'state/hooks'


const useAuth = () => {
  const dispatch = useAppDispatch()
  const { activate, deactivate } = useWeb3React()
  const appNetwork = useNetwork();

  const login = useCallback((connectorID: ConnectorNames) => {
    const connector = connectorsByName[connectorID]
    if (connector) {
      activate(connector, async (error: Error) => {
        if (error instanceof UnsupportedChainIdError) {
          const hasSetup = await setupNetwork(appNetwork)
          console.log('hasSetup: ', hasSetup);
          if (hasSetup) {
            activate(connector)
          }
        } else {
          window.localStorage.removeItem(connectorLocalStorageKey)
          if (error instanceof NoEthereumProviderError || error instanceof NoBscProviderError) {
            alert('No provider was found')
          } else if (
            error instanceof UserRejectedRequestErrorInjected ||
            error instanceof UserRejectedRequestErrorWalletConnect
          ) {
            if (connector instanceof WalletConnectConnector) {
              const walletConnector = connector as WalletConnectConnector
              walletConnector.walletConnectProvider = null
            }
            alert('Please authorize to access your account')
          } else {
            alert(error.message)
          }
        }
      })
    } else {
      alert('The connector config is wrong')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appNetwork])

  const logout = useCallback(() => {
    deactivate()
    window.localStorage.removeItem(connectorLocalStorageKey)
  }, [deactivate, dispatch])

  return { login, logout }
}

export default useAuth
