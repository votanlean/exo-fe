import { useCallback, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Contract } from 'web3-eth-contract';
import { approve } from 'utils/callHelpers';

export interface IUseAprrove {
	tokenContract: Contract;
	requestingContract: Contract;
	onApprove?: (transaction: any) => void;
}

// Approve a Pool
export const useApprove = ({
  tokenContract,
  requestingContract,
	onApprove
}: IUseAprrove) => {
  const { account } = useWeb3React();
  const [isLoading, setLoading] = useState(false);

  const handleApprove = useCallback(async () => {
    try {
      setLoading(true);
      const tx = await approve(
        tokenContract,
        requestingContract,
        account,
      );
      setLoading(false);
			if (onApprove) {
				onApprove(tx);
			}
      return tx;
    } catch (e) {
      setLoading(false);
      return false;
    }
  }, [account, tokenContract, requestingContract]);

  return { approve: handleApprove, isLoading };
};
