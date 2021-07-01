import { createSlice } from '@reduxjs/toolkit';
import { BIG_ZERO } from 'config';
import contracts from 'config/constants/contracts';
import tokens from 'config/constants/tokens';
import erc20ABI from 'config/abi/erc20.json';
import multicall from 'utils/multicall';
import { getAddress } from 'utils/addressHelpers';

export const texoTokenSlice = createSlice({
  name: 'texoToken',
  initialState: {
    data: {
      totalSupply: BIG_ZERO.toString(10),
      tEXOBurned: BIG_ZERO.toString(10),
    },
  },
  reducers: {
    setTexoTokenData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const fetchTexoTokenDataThunk = (chainId) => async (dispatch) => {
  const calls = [
    {
      address: getAddress(tokens.texo.address, chainId),
      name: 'totalSupply',
    },
    {
      address: getAddress(tokens.texo.address, chainId),
      name: 'balanceOf',
      params: [getAddress(contracts.burn, chainId)],
    },
  ];

  const texoTokenMultiData = await multicall(erc20ABI, calls, chainId);
  const [totalSupply, tEXOBurned] = texoTokenMultiData;

  dispatch(
    setTexoTokenData({
      totalSupply: totalSupply[0].toString(10),
      tEXOBurned: tEXOBurned[0].toString(10),
    }),
  );
};

export const { setTexoTokenData } = texoTokenSlice.actions;
