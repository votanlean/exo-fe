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
      tEXOPerBlock: BIG_ZERO.toString(10),
      totalAllocationPoint: BIG_ZERO.toString(10),
      seedingStartBlock: BIG_ZERO.toString(10),
      canClaimRewardsBlock: BIG_ZERO.toString(10),
      seedingFinishBlock: BIG_ZERO.toString(10),
    },
  },
  reducers: {
    setOrchestratorData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const fetchOrchestratorDataThunk =
  (chainId, network: Network) => async (dispatch) => {
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
        tEXOPerBlock: tEXOPerBlock[0].toString(10),
        totalAllocPoint: totalAllocPoint[0].toString(10),
        seedingStartBlock: new BN(parseInt(network.startBlock)).toString(10), // startBlock
        canClaimRewardsBlock: new BN(
          parseInt(network.startBlock) 
          + ((3600 * parseInt(process.env.HOURS_TO_INACTIVE_BLOCK)) / network.secondsPerBlock) + (3600 / network.secondsPerBlock),
        ).toString(), //after 5 days of startBlock - 1 hour
        seedingFinishBlock: new BN(
          parseInt(network.startBlock) 
          + ((3600 * parseInt(process.env.HOURS_TO_INACTIVE_BLOCK)) / network.secondsPerBlock),
        ).toString(), //after 5 days of startBlock
      }),
    );
  };

export const { setOrchestratorData } = orchestratorSlice.actions;
