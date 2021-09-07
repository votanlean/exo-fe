import { createSlice } from '@reduxjs/toolkit';
import { BIG_ZERO } from 'config';
import contracts from 'config/constants/contracts';
import orchestratorABI from 'config/abi/TEXOOrchestrator.json';
import { multicallRetry } from 'utils/multicall';
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
      farmStartBlock: BIG_ZERO.toString(10),
    },
    loading: false,
  },
  reducers: {
    setOrchestratorData: (state, action) => {
      state.data = action.payload;
      state.loading = true;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  },
});

export const fetchOrchestratorDataThunk =
  (chainId, network: Network) => async (dispatch) => {
    dispatch(setLoading(true));
    const calls = [
      {
        address: getAddress(contracts.orchestrator, chainId),
        name: 'tEXOPerBlock',
      },
      {
        address: getAddress(contracts.orchestrator, chainId),
        name: 'totalAllocPoint',
      },
      {
        address: getAddress(contracts.orchestrator, chainId),
        name: 'poolInfo',
        params: [0]
      }
    ];

    try {
      const orchestratorMultiData = await multicallRetry(
        orchestratorABI,
        calls,
        chainId,
      );
      const [tEXOPerBlock, totalAllocPoint, seedingBlock] = orchestratorMultiData;
      dispatch(
        setOrchestratorData({
          tEXOPerBlock: tEXOPerBlock[0].toString(10),
          totalAllocPoint: totalAllocPoint[0].toString(10),
          seedingStartBlock: new BN(parseInt(network.startBlock)).toString(10), // startBlock
          canClaimRewardsBlock: new BN(
            seedingBlock['blockToReceiveReward'].toNumber(),
          ).toString(), //after 5 days of startBlock - 1 hour
          seedingFinishBlock: new BN(seedingBlock['inActiveBlock'].toNumber()
          ).toString(), //after 5 days of startBlock
          farmStartBlock: seedingBlock['inActiveBlock'].toNumber(),
        }),
      );
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      throw error;
    }
  };

export const { setOrchestratorData, setLoading } = orchestratorSlice.actions;
