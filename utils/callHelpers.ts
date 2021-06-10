import BigNumber from 'bignumber.js';
import { DEFAULT_TOKEN_DECIMAL } from 'config';
import { ethers } from 'ethers';

export const approve = async (stakingTokenContract, orchestrator, account) => {
  return stakingTokenContract.methods
    .approve(orchestrator.options.address, ethers.constants.MaxUint256)
    .send({ from: account });
};

export const stake = async (
  orchestrator,
  poolId,
  amount,
  account,
  ref: string | undefined | null = null,
) => {
  if (ref) {
    return orchestrator.methods
      .deposit(
        poolId,
        new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString(),
        ref,
      )
      .send({ from: account, gas: 200000 })
      .on('transactionHash', (tx) => {
        return tx.transactionHash;
      });
  } else {
    return orchestrator.methods
      .deposit(
        poolId,
        new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString(),
      )
      .send({ from: account, gas: 200000 })
      .on('transactionHash', (tx) => {
        return tx.transactionHash;
      });
  }
};

export const unstake = async (orchestrator, poolId, amount, account) => {
  return orchestrator.methods
    .withdraw(
      poolId,
      new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString(),
    )
    .send({ from: account, gas: 200000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash;
    });
};

export const harvest = async (orchestrator, poolId, account) => {
  return orchestrator.methods
    .deposit(poolId, '0')
    .send({ from: account, gas: 200000 })
    .on('transactionHash', (tx) => {
      return tx.transactionHash;
    });
};
