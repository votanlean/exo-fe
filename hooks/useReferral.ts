import { useEffect, useState } from 'react';
import { useOrchestratorContract } from './useContract';
import { useWeb3React } from '@web3-react/core';

const useReferrals = () => {
  const { account } = useWeb3React();
  const orchestratorContract = useOrchestratorContract();
  const [referralsCount, setReferralsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (account) {
      orchestratorContract.methods
        .referredCount(account)
        .call()
        .then(setReferralsCount)
        .finally(() => setLoading(false));
    }
  }, [account, orchestratorContract]);
  return {
    referralsCount,
    loading,
  };
};

export default useReferrals;
