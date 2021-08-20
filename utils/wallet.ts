// Set of helper functions to facilitate wallet setup

interface WindowChain {
  ethereum?: {
    isMetaMask?: true
    request?: (...args: any[]) => Promise<void>
  }
}
/**
 * Prompt the user to add BSC as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async (appNetwork) => {
  const provider = (window as WindowChain).ethereum
  if (provider) {
    let isSuccessful = true;
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{
        chainId: `0x${appNetwork.id.toString(16)}`
      }]
    }).catch(async (switchError) => {
      if (switchError.code === 4902) {
        // wallet dont have the network id, try adding it
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: `0x${appNetwork.id.toString(16)}`,
            chainName: appNetwork.name,
            nativeCurrency: {
              name: appNetwork.symbol,
              symbol: appNetwork.symbol,
              decimals: 18,
              },
            rpcUrls: [appNetwork.rpcUrl],
            blockExplorerUrls: [appNetwork.blockExplorerUrl],
          }]
        }).then(async() => {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{
              chainId: `0x${appNetwork.id.toString(16)}`
            }]
          })
        })
      } 
      throw switchError
    }).catch((error) => {
      console.log('RPC Error: ', error)
      if (error.code !== 4902) {
        isSuccessful = false
      }
    })
    return isSuccessful;
  } else {
    console.error("Can't setup the BSC network on metamask because window.ethereum is undefined")
    return false
  }
}

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @param tokenImage
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (
  tokenAddress: string,
  tokenSymbol: string,
  tokenDecimals: number,
  tokenImage: string,
) => {
  const tokenAdded = await (window as WindowChain).ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: tokenImage,
      },
    },
  })

  return tokenAdded
}
