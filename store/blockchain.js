import { createContext, useEffect, useState } from 'react'
import Web3 from 'web3';
import web3 from '../binance/web3'
import { BscConnector } from '@binance-chain/bsc-connector'
import { getWeb3ReactContext, useWeb3React } from '@web3-react/core'
import {bsc, metamask} from '~lib/connector'
import { getErrorMessage } from '~lib/error'

const BlockchainContext = createContext({
  accounts: [],
  connectWallet: (walletType) => {}
})

export const BlockchainContextProvider = (props) => {
  const [accounts, setAccounts] = useState(['xxx']);


  const [errorMessage, setErrorMessage] = useState();

  const { active, account, error, activate, deactivate } = useWeb3React();

  const web3Ctx = getWeb3ReactContext();
  const connectWalletHandler = async (walletType) => {
    switch (walletType) {
      case 'metamask':
        console.log('connectMetamask');

        const foo = await activate(metamask);
        console.log('foo', foo);
        if (!active) {
          break;
        }
        console.log('wallet', metamask);
        const acc = await metamask.getAccount();
        console.log('metamask acc', acc);
        break;
      case 'binanceChainWallet':
        console.log('connectBinanceChainWallet');

        await bsc.activate();
        const accounts = await bsc.getAccount();
        const bscProvider = await bsc.getProvider();
        console.log('accounts', accounts);

        const provider = new Web3.providers.HttpProvider(
          'https://data-seed-prebsc-1-s1.binance.org:8545'
        );
        const web3 = new Web3(bscProvider);
        console.log('web3', await web3.eth.getAccounts());

        console.log('account', web3Ctx.displayName);
        break;
    }
  }

  const context = {
    accounts: accounts,
    connectWallet: connectWalletHandler,
  }

  return (
    <BlockchainContext.Provider value={context}>
      {props.children}
    </BlockchainContext.Provider>
  )
}

export default BlockchainContext;
