import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Countdown from 'countdown'
import { Typography } from '@material-ui/core';
import { useWeb3React } from '@web3-react/core'
import dayjs from 'dayjs'
import BigNumber from 'bignumber.js';

// import web3 from '../../blockchain/web3'
import { poolToken } from '../../blockchain/tokenFactory'
import { lpPoolToken } from '../../blockchain/tokenFactoryLP'
import tEXOInstance from '../../blockchain/tEXOToken';
import PoolItem from '../../components/PoolItem'
import Statistic from '../../components/Statistic'
import { fetchPrices } from '../../hookApi/prices'

import styles from './pool.module.scss'
import {useWeb3} from "../../hooks/useWeb3";
import {getOrchestratorContract} from "../../utils/contractHelpers";
import {useOrchestratorContract} from "../../hooks/useContract";
import {usePools} from "../../state/hooks";

function getClaimRewardsDate(
  currentBlockHeight,
  canClaimRewardBlockHeight,
  startDate,
) {
  if (!currentBlockHeight || !canClaimRewardBlockHeight) {
    return dayjs()
  }

  const blockDiff = canClaimRewardBlockHeight - currentBlockHeight
  if (blockDiff <= 0) {
    return dayjs()
  }

  const secondsDiff = Math.ceil(blockDiff * 3)
  const claimRewardDate = startDate.add(secondsDiff, 'seconds')

  return claimRewardDate
}

function Pool() {
  const { account, library } = useWeb3React()
  const [currentBlockHeight, setCurrentBlockHeight] = useState(0)
  const [countDownString, setCountDownString] = useState('')
  const [burnAmount, setBurnAmount] = useState(new BigNumber(0));
  const [allTokenPrices, setAllTokenPrices] = useState({})
  const [currentTEXOPerBlock, setCurrentTEXOPerBlock] = useState(new BigNumber(0));
  const [tEXOTotalSupply, setTEXOTotalSupply] = useState(new BigNumber(0))
  const [countDownInterval, setCountDownInterval] = useState(null)
  const [canClaimRewardBlockHeight, setCanClaimRewardBlockHeight] = useState(0)

  const pools = usePools(account)
  console.log('pools from usePools', pools);
  const web3 = useWeb3();
  const orchestratorContract = useOrchestratorContract();

  const tEXOAddress = process.env.TEXO_ADDRESS;
  const burnAddress = '0x000000000000000000000000000000000000dEaD';

  const getCurrentBlockHeight = async () => {
    const currentBlockHeight = await web3.eth.getBlockNumber()
    setCurrentBlockHeight(currentBlockHeight)
  }

  const getGlobalCanClaimRewardsBlockHeight = async () => {
    const globalCanClaimRewardsBlockHeight = await orchestratorContract.methods
      .globalBlockToUnlockClaimingRewards()
      .call()

    setCanClaimRewardBlockHeight(globalCanClaimRewardsBlockHeight)
  }

  const initTokenInfo = async () => {
    const tEXOTotalSupply = await tEXOInstance.methods.totalSupply().call();
    const tExoPerBlock = await orchestratorContract.methods.tEXOPerBlock().call();
    const tEXOBurned = await tEXOInstance.methods.balanceOf(burnAddress).call();

    setTEXOTotalSupply(new BigNumber(tEXOTotalSupply));
    setCurrentTEXOPerBlock(new BigNumber(tExoPerBlock));
    setBurnAmount(new BigNumber(tEXOBurned));
  }

  const getTokenPrices = async () => {
    const prices = await fetchPrices();

    setAllTokenPrices(prices);
  }

  useEffect(() => {
    // getGlobalCanClaimRewardsBlockHeight()
    // getTokenPrices();
    // initTokenInfo();
    // const interval = setInterval(getCurrentBlockHeight, 500)
    //
    // return () => {
    //   clearInterval(interval)
    //   clearInterval(countDownInterval)
    // }
  }, [])

  useEffect(() => {
    // if (
    //   !canClaimRewardBlockHeight ||
    //   !currentBlockHeight ||
    //   countDownInterval
    // ) { return }
    //
    // const claimRewardDate = getClaimRewardsDate(
    //   currentBlockHeight,
    //   canClaimRewardBlockHeight,
    //   dayjs(),
    // ).toDate()
    //
    // const interval = setInterval(() => {
    //   const countDownString = Countdown(new Date(), claimRewardDate).toString()
    //
    //   setCountDownString(countDownString)
    // }, 1000)
    //
    // setCountDownInterval(interval)
  }, [canClaimRewardBlockHeight, currentBlockHeight])

  return (
    <>
      <Head>
        <title>Pool</title>
      </Head>

      <div className="container pool-container">
        <Statistic
          tEXOPrice={allTokenPrices[tEXOAddress]}
          totalSupply={tEXOTotalSupply}
          currentTEXOPerBlock={currentTEXOPerBlock}
          burnAmount={burnAmount}
        />

        {/*<div className="pool-grid">*/}
        {/*  {lpPoolToken.map(pool => (*/}
        {/*    <PoolItem*/}
        {/*      selectedAccount={account}*/}
        {/*      currentBlockHeight={currentBlockHeight}*/}
        {/*      onPoolStateChange={getCurrentBlockHeight}*/}
        {/*      stakingTokenPrice={allTokenPrices[pool.address] || 0}*/}
        {/*      tEXOPrice={allTokenPrices[tEXOAddress] || 0}*/}
        {/*      data={pool}*/}
        {/*      key={pool.id}*/}
        {/*      isLiquidityPool={true}*/}
        {/*    />*/}
        {/*  ))}*/}
        {/*</div>*/}

        {/*<div className={styles.countdownContainer}>*/}
        {/*  <Typography variant="h4" style={{ marginBottom: '10px' }}>*/}
        {/*    Count Down To Claim Rewards and Farming*/}
        {/*  </Typography>*/}
        {/*  <Typography variant="h3" color="primary">*/}
        {/*    {countDownString}*/}
        {/*  </Typography>*/}
        {/*</div>*/}

        <div className="pool-grid">
          {pools.map(pool => (
            <PoolItem
              selectedAccount={account}
              currentBlockHeight={currentBlockHeight}
              onPoolStateChange={getCurrentBlockHeight}
              stakingTokenPrice={allTokenPrices[pool.address] || 0}
              tEXOPrice={allTokenPrices[tEXOAddress] || 0}
              data={pool}
              key={pool.id}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default Pool
