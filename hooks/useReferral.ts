import { useEffect, useState } from 'react';
import { useOrchestratorContract } from './useContract';
import { useWallet } from '@binance-chain/bsc-use-wallet';

const useReferrals = () => {
  const { account } = useWallet();
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
