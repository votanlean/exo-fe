import { createSlice } from '@reduxjs/toolkit';
import { BIG_ZERO } from 'config';
import contracts from 'config/constants/contracts';
import orchestratorABI from 'config/abi/TEXOOrchestrator.json';
import multicall from 'utils/multicall';
import { getAddress } from 'utils/addressHelpers';
import BN from 'bn.js';
import { Network } from 'state/types';

export const orchestratorSlice = createSlice({
  name: 'orchestrator',
  initialState: {
    data: {
      tEXOPerBlock: BIG_ZERO.toString(),
      totalAllocationPoint: BIG_ZERO.toString(),
      seedingStartBlock: BIG_ZERO.toString(),
      canClaimRewardsBlock: BIG_ZERO.toString(),
      seedingFinishBlock: BIG_ZERO.toString(),
    },
  },
  reducers: {
    setOrchestratorData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const fetchOrchestratorDataThunk = (chainId, network: Network) => async (dispatch) => {
  const calls = [
    {
      address: getAddress(contracts.orchestrator, chainId),
      name: 'tEXOPerBlock',
    },
    {
      address: getAddress(contracts.orchestrator, chainId),
      name: 'totalAllocPoint',
    },
  ];

  const orchestratorMultiData = await multicall(
    orchestratorABI,
    calls,
    chainId,
  );
  const [tEXOPerBlock, totalAllocPoint] = orchestratorMultiData;

  dispatch(
    setOrchestratorData({
      tEXOPerBlock: tEXOPerBlock[0].toString(),
      totalAllocPoint: totalAllocPoint[0].toString(),
      seedingStartBlock: new BN(parseInt(network.startBlock)).toString(), // startBlock
      canClaimRewardsBlock: new BN(
        parseInt(network.startBlock) + (86400/network.secondsPerBlock) * 5 - (3600/network.secondsPerBlock),
      ).toString(), //after 5 days of startBlock - 1 hour
      seedingFinishBlock: new BN(
        parseInt(network.startBlock) + (86400/network.secondsPerBlock) * 5,
      ).toString(), //after 5 days of startBlock
    }),
  );
};

export const { setOrchestratorData } = orchestratorSlice.actions;
