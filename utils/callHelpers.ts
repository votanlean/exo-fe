import BigNumber from "bignumber.js";

import { BIG_TEN } from "config";
import { ethers } from "ethers";

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
  decimals
) => {
  if (ref) {
    return orchestrator.methods
      .deposit(
        poolId,
        new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString(10),
        ref
      )
      .send({ from: account, gas: 500000 })
      .on("transactionHash", (tx) => {
        return tx.transactionHash;
      });
  } else {
    return orchestrator.methods
      .deposit(
        poolId,
        new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString(10)
      )
      .send({ from: account, gas: 500000 })
      .on("transactionHash", (tx) => {
        return tx.transactionHash;
      });
  }
};

export const unstake = async (
  orchestrator,
  poolId,
  amount,
  account,
  decimals
) => {
  return orchestrator.methods
    .withdraw(
      poolId,
      new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString(10)
    )
    .send({ from: account, gas: 500000 })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const emergencyWithdraw = async (orchestrator, poolId, account) => {
  return orchestrator.methods
    .emergencyWithdraw(poolId)
    .send({ from: account, gas: 500000 })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const harvest = async (orchestrator, poolId, account) => {
  return orchestrator.methods
    .withdraw(poolId, "0")
    .send({ from: account, gas: 500000 })
    .on("transactionHash", (tx) => {
      return tx.transactionHash;
    });
};

export const vaultStake = async (vault, amount, account, decimals) => {
  try {
    return vault.methods
      .deposit(new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString(10))
      .send({ from: account, gas: 500000 })
      .on("transactionHash", (tx) => {
        return tx.transactionHash;
      });
  } catch (error) {
    console.log(error);
  }
};

export const vaultUnStake = async (vault, amount, account, decimals) => {
  try {
    return vault.methods
      .withdraw(new BigNumber(amount).times(BIG_TEN.pow(decimals)).toString(10))
      .send({ from: account, gas: 1000000 })
      .on("transactionHash", (tx) => {
        return tx.transactionHash;
      });
  } catch (error) {
    console.log(error);
  }
};
