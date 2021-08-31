import React from 'react';
import { useWeb3React } from '@web3-react/core';
function index(props) {
    const {router, inputFrom, inputTo, token1, token2} = props;
    const { account } = useWeb3React();
    const deadlineFromNow = Math.ceil(Date.now() / 1000) + 60*20;
    let response;
    const onSupply = async() => {
        response = router.methods.addLiquidity(
            token1,
            token2,
          (parseFloat(inputFrom)*10**18).toString(),
          (parseFloat(inputTo)*10**18).toString(),
          (parseFloat(inputFrom)*10**18-1000).toString(),
          (parseFloat(inputTo)*10**18-1000).toString(),
          account,
          deadlineFromNow
        ).send({ from: account, gas: 3000000 })
        .on('transactionHash', (tx) => {
          return tx.transactionHash;
        });
      }
    return (
        <div>
            <button className="button btn-secondary"
                    onClick={onSupply}
                  >
                    <span>Supply</span>
            </button>
        </div>
    );
}

export default index;