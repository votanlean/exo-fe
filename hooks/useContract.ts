import { useMemo } from 'react';
import useWeb3 from './useWeb3';
import {
  getBep20Contract,
  getFAANGOrchestratorContract,
  getFactoryContract,
  getOrchestratorContract,
  getPairContract,
  getRouterContract,
  getTEXOContract,
  getVaultContract
} from 'utils/contractHelpers';
import { useNetwork } from 'state/hooks';

/**
 * Helper hooks to get specific contracts (by ABI)
 */

export const useOrchestratorContract = () => {
  const { id: chainId } = useNetwork()
  const web3 = useWeb3();

  return useMemo(() => getOrchestratorContract(web3, chainId), [web3, chainId]);
};

export const useFAANGOrchestratorContract = () => {
  const { id: chainId } = useNetwork()
  const web3 = useWeb3();

  return useMemo(() => getFAANGOrchestratorContract(web3, chainId), [web3, chainId]);
};

export const useTEXOContract = () => {
  const { id: chainId } = useNetwork()
  const web3 = useWeb3();

  return useMemo(() => getTEXOContract(web3, chainId), [web3, chainId]);
};

export const useERC20 = (address: string) => {
  const { id: chainId } = useNetwork()
  const web3 = useWeb3();

  return useMemo(() => getBep20Contract(address, web3, chainId), [address, web3, chainId]);
};

export const useVaultContract = (address: string) => {
    const {id: chainId} = useNetwork()
    const web3 = useWeb3()
    return useMemo(() => getVaultContract(address, web3,chainId), [address, web3,chainId])
}

export const useRouterContract = (address: string) => {
  const {id: chainId} = useNetwork()
  const web3 = useWeb3()
  return useMemo(() => getRouterContract(address, web3,chainId), [address, web3,chainId])
}

export const useFactoryContract = (address: string) => {
  const {id: chainId} = useNetwork()
  const web3 = useWeb3()
  return useMemo(() => getFactoryContract(address, web3,chainId), [address, web3,chainId])
}

export const usePairContract = (address: string) => {
  const {id: chainId} = useNetwork()
  const web3 = useWeb3()
  const pairContract = useMemo(() => getPairContract(address, web3,chainId), [address, web3,chainId])
  
  return pairContract;
}




//
// /**
//  * @see https://docs.openzeppelin.com/contracts/3.x/api/token/erc721
//  */
// export const useERC721 = (address: string) => {
//     const web3 = useWeb3()
//     return useMemo(() => getErc721Contract(address, web3), [address, web3])
// }
//
// export const useCake = () => {
//     const web3 = useWeb3()
//     return useMemo(() => getCakeContract(web3), [web3])
// }
//
// export const useBunnyFactory = () => {
//     const web3 = useWeb3()
//     return useMemo(() => getBunnyFactoryContract(web3), [web3])
// }
//
// export const usePancakeRabbits = () => {
//     const web3 = useWeb3()
//     return useMemo(() => getPancakeRabbitContract(web3), [web3])
// }
//
// export const useProfile = () => {
//     const web3 = useWeb3()
//     return useMemo(() => getProfileContract(web3), [web3])
// }
//
// export const useLottery = () => {
//     const web3 = useWeb3()
//     return useMemo(() => getLotteryContract(web3), [web3])
// }
//
// export const useLotteryTicket = () => {
//     const web3 = useWeb3()
//     return useMemo(() => getLotteryTicketContract(web3), [web3])
// }
//
// export const useMasterchef = () => {
//     const web3 = useWeb3()
//     return useMemo(() => getMasterchefContract(web3), [web3])
// }
//
// export const useSousChef = (id) => {
//     const web3 = useWeb3()
//     return useMemo(() => getSouschefContract(id, web3), [id, web3])
// }
//
// export const useSousChefV2 = (id) => {
//     const web3 = useWeb3()
//     return useMemo(() => getSouschefV2Contract(id, web3), [id, web3])
// }
//
// export const usePointCenterIfoContract = () => {
//     const web3 = useWeb3()
//     return useMemo(() => getPointCenterIfoContract(web3), [web3])
// }
//
// export const useBunnySpecialContract = () => {
//     const web3 = useWeb3()
//     return useMemo(() => getBunnySpecialContract(web3), [web3])
// }
//
// export const useClaimRefundContract = () => {
//     const web3 = useWeb3()
//     return useMemo(() => getClaimRefundContract(web3), [web3])
// }
//
// export const useTradingCompetitionContract = () => {
//     const web3 = useWeb3()
//     return useMemo(() => getTradingCompetitionContract(web3), [web3])
// }
//
// export const useEasterNftContract = () => {
//     const web3 = useWeb3()
//     return useMemo(() => getEasterNftContract(web3), [web3])
// }
//
// export const useCakeVaultContract = () => {
//     const web3 = useWeb3()
//     return useMemo(() => getCakeVaultContract(web3), [web3])
// }
//
// export const usePredictionsContract = () => {
//     const web3 = useWeb3()
//     return useMemo(() => getPredictionsContract(web3), [web3])
// }
//
// export const useChainlinkOracleContract = () => {
//     const web3 = useWeb3()
//     return useMemo(() => getChainlinkOracleContract(web3), [web3])
// }
