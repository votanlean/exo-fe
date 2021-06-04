import { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import {injected, bscConnector, connectorLocalStorageKey, connectorsByName, ConnectorNames} from "../utils/web3React";
import useAuth from "./useAuth";

const _binanceChainListener = async () =>
    new Promise<void>((resolve) =>
        Object.defineProperty(window, 'BinanceChain', {
            get() {
                return this.bsc
            },
            set(bsc) {
                this.bsc = bsc

                resolve()
            },
        }),
    )

export function useEagerConnect() {
    const { activate, active } = useWeb3React()
    const [tried, setTried] = useState(false)
    const {login} = useAuth();
//TODO move activate to login
    useEffect(() => {
        const connectorId = window.localStorage.getItem(connectorLocalStorageKey) as ConnectorNames
        console.log('connectorId', connectorId);
        if (connectorId) {
            const isConnectorBinanceChain = connectorId === ConnectorNames.BSC
            const isBinanceChainDefined = Reflect.has(window, 'BinanceChain')

            // Currently BSC extension doesn't always inject in time.
            // We must check to see if it exists, and if not, wait for it before proceeding.
            if (isConnectorBinanceChain && !isBinanceChainDefined) {
                _binanceChainListener().then(() => login(connectorId))

                return
            }

            const isConnectorWalletConnect = connectorId === ConnectorNames.WalletConnect
            if (isConnectorWalletConnect) {
                login(connectorId);
                return;
            }

            injected.isAuthorized().then((isAuthorized: boolean) => {
                if (isAuthorized) {
                    activate(injected, undefined, true).catch(() => {
                        setTried(true)
                    })
                } else {
                    setTried(true)
                }
            })
        }

    }, []) // intentionally only running on mount (make sure it's only mounted once :))

    // if the connection worked, wait until we get confirmation of that to flip the flag
    useEffect(() => {
        if (!tried && active) {
            setTried(true)
        }
    }, [tried, active])

    return tried
}

export function useInactiveListener(suppress: boolean = false) {
    const { active, error, activate } = useWeb3React()

    useEffect((): any => {
        const { ethereum } = window as any
        if (ethereum && ethereum.on && !active && !error && !suppress) {
            const handleConnect = () => {
                console.log("Handling 'connect' event")
                activate(injected)
            }
            const handleChainChanged = (chainId: string | number) => {
                console.log("Handling 'chainChanged' event with payload", chainId)
                activate(injected)
            }
            const handleAccountsChanged = (accounts: string[]) => {
                console.log("Handling 'accountsChanged' event with payload", accounts)
                if (accounts.length > 0) {
                    activate(injected)
                }
            }
            const handleNetworkChanged = (networkId: string | number) => {
                console.log("Handling 'networkChanged' event with payload", networkId)
                activate(injected)
            }

            ethereum.on('connect', handleConnect)
            ethereum.on('chainChanged', handleChainChanged)
            ethereum.on('accountsChanged', handleAccountsChanged)
            ethereum.on('networkChanged', handleNetworkChanged)

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener('connect', handleConnect)
                    ethereum.removeListener('chainChanged', handleChainChanged)
                    ethereum.removeListener('accountsChanged', handleAccountsChanged)
                    ethereum.removeListener('networkChanged', handleNetworkChanged)
                }
            }
        }
    }, [active, error, suppress, activate])
}
