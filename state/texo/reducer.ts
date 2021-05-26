import { createSlice } from "@reduxjs/toolkit";
import BigNumber from "bignumber.js";
import { BIG_ZERO } from "config";
import contracts from "config/constants/contracts";
import tokens from "config/constants/tokens";
import erc20ABI from 'config/abi/erc20.json';
import multicall from 'utils/multicall';
import { getAddress } from "utils/addressHelpers";

export const texoTokenSlice = createSlice({
  name: 'texoToken',
  initialState: {
    data: {
      totalSupply: BIG_ZERO.toString(),
      tEXOBurned: BIG_ZERO.toString(),
    },
  },
  reducers: {
    setTexoTokenData: (state, action) => {
      state.data = action.payload;
    },
  }
});

export const fetchTexoTokenDataThunk = async (dispatch) => {
  const calls = [
    {
      address: getAddress(tokens.texo.address),
      name: 'totalSupply',
    },
    {
      address: getAddress(tokens.texo.address),
      name: 'balanceOf',
      params: [getAddress(contracts.burn)],
    },
  ];

  const texoTokenMultiData = await multicall(erc20ABI, calls);
  const [ totalSupply, tEXOBurned ] = texoTokenMultiData;

  dispatch(setTexoTokenData({
    totalSupply: totalSupply[0].toString(),
    tEXOBurned: tEXOBurned[0].toString(),
  }));
}

export const { setTexoTokenData } = texoTokenSlice.actions;