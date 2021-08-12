import { InjectedConnector } from '@web3-react/injected-connector';
import { BscConnector } from '@binance-chain/bsc-connector';
import { Web3Provider } from '@ethersproject/providers';
import { UnsupportedChainIdError } from '@web3-react/core';
import {
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import {WalletConnectConnector} from "@web3-react/walletconnect-connector";
import Web3 from "web3";
import { supportedChains } from 'constant/supportedChain';

export function getErrorMessage(error) {
    if (error instanceof NoEthereumProviderError) {
        return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.';
    } else if (error instanceof UnsupportedChainIdError) {
        return "You're connected to an unsupported network.";
    } else if (error instanceof UserRejectedRequestErrorInjected) {
        return 'Please authorize this website to access your Ethereum account.';
    } else {
        console.error(error);
        return 'An unknown error occurred. Check the console for more details.';
    }
}

const chainId = process.env.CHAIN_ID;
const rpcUrl = process.env.BLOCKCHAIN_HOST;
const POLLING_INTERVAL = 12000

// export function getLibrary(provider: any) {
//     const library = new Web3Provider(provider);
//     library.pollingInterval = POLLING_INTERVAL;
//     return library;
// }

export const getLibrary = (provider): Web3 => {
    return provider
}


export const injected = new InjectedConnector({
    supportedChainIds: supportedChains.map(({ chainId }) => chainId),
});

export const bscConnector = new BscConnector({
    supportedChainIds: [56, 5600, 97], // later on 1 ethereum mainnet and 3 ethereum ropsten will be supported
});

const walletconnect = new WalletConnectConnector({
    rpc: supportedChains.reduce((rpcs, { chainId, rpc }) => ({
			...rpcs,
			[chainId]: rpc
		}), {}),
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
})

export enum ConnectorNames {
    Injected = "injected",
    WalletConnect = "walletconnect",
    BSC = "bsc",
}

export const connectorsByName: { [connectorName in ConnectorNames]: any } = {
    [ConnectorNames.Injected]: injected,
    [ConnectorNames.WalletConnect]: walletconnect,
    [ConnectorNames.BSC]: bscConnector,
}

export const connectorLocalStorageKey = "connectorId";
