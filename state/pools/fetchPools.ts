import BigNumber from 'bignumber.js'
import seedingPools from 'config/constants/seedingPools'
import tEXOABI from 'config/abi/TEXOToken.json'
import multicall from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import contracts from 'config/constants/contracts'

export const fetchPoolsTotalStaking = async () => {
  const seedingPoolCalls = seedingPools.map((seedingPool) => {
    return {
      address: getAddress(seedingPool.stakingToken.address),
      name: 'balanceOf',
      params: [getAddress(contracts.orchestrator)],
    }
  });

  const seedingPoolsTotalStaked = await multicall(tEXOABI, seedingPoolCalls);

  return seedingPools.map((p, index) => ({
    ...p,
    totalStaked: new BigNumber(seedingPoolsTotalStaked[index]).toJSON(),
  }));
}
