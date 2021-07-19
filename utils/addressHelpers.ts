import contracts from 'config/constants/contracts';
import tokens from 'config/constants/tokens';
import { Address } from 'config/constants/types';

export const getAddress = (address: Address, chainId: number): string => {
  const mainNetChainId = 56;

  return address[chainId] ? address[chainId] : address[mainNetChainId];
};

export const getOrchestratorAddress = (chainId?: number) => {
  return getAddress(contracts.orchestrator, chainId);
};

export const getFAANGOrchestratorAddress = (chainId?: number) => {
  return getAddress(contracts.fAANGOrchestrator, chainId);
};

export const getTEXOAddress = (chainId?: number) => {
  return getAddress(tokens.texo.address, chainId);
};

export const getMulticallAddress = (chainId?: number) => {
  return getAddress(contracts.multiCall, chainId);
};
