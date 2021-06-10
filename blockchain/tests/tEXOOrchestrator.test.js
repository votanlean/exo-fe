const { expect } = require("chai");
const { expectRevert, time, constants } = require('@openzeppelin/test-helpers');
const { BN } = require("@openzeppelin/test-helpers/src/setup");

const TEXOOrchestrator = artifacts.require('TEXOOrchestrator');
const TEXOToken = artifacts.require('TEXOToken');

// Note: a Read transaction doesn't increase block height by 1. the block.number value is equal to the current block height.
// A write transaction increases block height by 1, the block.number will be block height + 1

contract('TEXOOrchestrator', ([owner, dev, fee, staker1, referrer]) => {
  beforeEach(async () => {
    // Note: every successful operation increases the block by 1 (1 hour);
    this.tEXOInstance = await TEXOToken.new({ from: owner, });
    this.bUSDInstance = await TEXOToken.new({ from: owner, });
    this.tEXOBNBFarmInstance = await TEXOToken.new({ from: owner, });

    // mint some token to staker
    await this.bUSDInstance.mint(staker1, '1000', { from: owner });
    await this.bUSDInstance.mint(dev, '1000', { from: owner });
    await this.tEXOBNBFarmInstance.mint(staker1, '1000', { from: owner, });

    const latestBlock = await time.latestBlock();
    this.offsetBlock = 0;

    this.tEXOOrchestrator = await TEXOOrchestrator.new(
      this.tEXOInstance.address,
      dev,
      fee,
      latestBlock.toNumber() + 8, // Start calculate rewards after 8 hours,
      latestBlock.toNumber() + 24 * 5, // Start reducing emission rate after 5 days,
      latestBlock.toNumber() + 24 * 5, // Allow claiming rewards after 5 days,
      {
        from: owner,
      },
    );
    this.offsetBlock++;

    // Add BUSD seed pool.
    this.tEXOOrchestrator.add(
      '300', // Allocation point,
      this.bUSDInstance.address,
      '400', // Deposit fee
      false, // With update
      '0', // Block to receive rewards: Same as global (5 days)
      '0', // Start generate rewards block. Same as global (after 8 hours);
      latestBlock.toNumber() + 24 * 5, // Inactive block
      {
        from: owner,
      },
    );
    this.offsetBlock++;

    // Add BNB LP farm
    this.tEXOOrchestrator.add(
      '0', // Allocation point,
      this.tEXOBNBFarmInstance.address,
      '0', // Deposit fee
      false, // With update
      '0', // Can receive rewards immediately
      latestBlock.toNumber() + 24 * 5, // Start generating rewards after 5 days
      '0',
      {
        from: owner,
      },
    );
    this.offsetBlock++;

    // Transfer ownership of tEXOInstance to Orchestrator for minting permission
    await this.tEXOInstance.transferOwnership(this.tEXOOrchestrator.address, {
      from: owner,
    });
    this.offsetBlock++;
  });

  describe('Initialization phase tests', () => {
    it('Has correct pool numbers', async () => {
      const poolLength = await this.tEXOOrchestrator.poolLength();
  
      expect(poolLength.toString()).to.equal('2');
    });
  
    it('Staker1 has correct minted balance', async () => {
      const staker1BusdBalance = await this.bUSDInstance.balanceOf(staker1);
  
      expect(staker1BusdBalance.toString()).to.equal('1000');
    });

    it('Ownership of tEXO should be Orchestrator', async () => {
      const tEXOOwner = await this.tEXOInstance.owner();

      expect(tEXOOwner).to.equal(this.tEXOOrchestrator.address);
    });

    it('Pool can not exceed 4% deposit fee', async () => {
      let hasError = false;

      try {
        await this.tEXOOrchestrator.add(
          '0', // Allocation point,
          '0x37A452D99eAD1E5b7f131d5c18f50fab868aFcB2',
          '500', // Deposit fee
          false, // With update
          '0',
          latestBlock.toNumber() + 24 * 5, // Start generating rewards after 5 days
          {
            from: owner,
          },
        )
      } catch(error) {
        hasError = true;
      }

      expect(hasError).to.be.equal(true, "Deposit fee must not exceed 4%");
    });

    it('New pool deposit fee can not exceed 4%', async () => {
      let hasError = false;

      try {
        await this.tEXOOrchestrator.set(
          '0', // Pool index
          '300', // Allocation point
          '500', // Deposit fee
          false, // With update
          '0',
          {
            from: owner,
          },
        )
      } catch(error) {
        hasError = true;
      }

      expect(hasError).to.be.equal(true, "New Deposit fee must not exceed 4%");
    });
  });

  describe('Staking phase tests', () => {
    it('Cannot stake before approval', async () => {
      let hasError = false;
      try {
        await this.tEXOOrchestrator.deposit(
          '0', // pool index
          '1000', // stake amount,
          constants.ZERO_ADDRESS,
          {
            from: staker1,
          }
        );
  
        
      } catch (error) {
        hasError = true;
      }

      expect(hasError).to.be.equal(true, "Should not allow stake before approve");
    });
  
    it('Cannot stake exceed approval amount', async () => {
      let hasError = false;
      try {
        await this.bUSDInstance.approve(
          this.tEXOOrchestrator.address,
          '600',
          {
            from: staker1,
          }
        );
  
        await this.tEXOOrchestrator.deposit(
          '0', // pool index
          '700', // stake amount,
          constants.ZERO_ADDRESS, // referrer,
          {
            from: staker1,
          }
        );
      } catch (error) {
        hasError = true;
      }

      expect(hasError).to.be.equal(true, 'Should not be able to stake exceeding approval amount');
    });
  
    it('Allow stake if amount is good', async () => {
      let hasError = false;
      try {
        await this.bUSDInstance.approve(
          this.tEXOOrchestrator.address,
          '800',
          {
            from: staker1,
          }
        );
  
        await this.tEXOOrchestrator.deposit(
          '0', // pool index
          '700', // stake amount,
          constants.ZERO_ADDRESS, // referrer,
          {
            from: staker1,
          }
        );
      } catch (_) {
        hasError = true;
      }

      expect(hasError).to.be.equal(false, "Must be able to stake within allowance");
    });
  });

  describe('Claim rewards & withdraw phase', () => {
    describe('Seeding pool tests', () => {
      beforeEach('User staked 800 BUSD', async () => {
        await this.bUSDInstance.approve(
          this.tEXOOrchestrator.address,
          '800',
          {
            from: staker1,
          }
        );
        this.offsetBlock++;
    
        await this.tEXOOrchestrator.deposit(
          '0', // pool index
          '800', // stake amount,
          constants.ZERO_ADDRESS, // referrer,
          {
            from: staker1,
          }
        );
        this.offsetBlock++;
      });
  
      it('Can\'t yield tEXO before startBlock', async () => {
        const staker1PendingTEXO = await this.tEXOOrchestrator.pendingTEXO('0', staker1);
    
        expect(staker1PendingTEXO.eq(new BN(0))).to.be.equal(true, "Should not yield tEXO before startblock");
      });
  
      it('Yield tEXO after startBlock', async () => {
        const currentBlock = await time.latestBlock();

        await time.advanceBlockTo(currentBlock.toNumber() - this.offsetBlock + 9);
    
        const staker1PendingTEXO = await this.tEXOOrchestrator.pendingTEXO('0', staker1);
        
        expect(staker1PendingTEXO.gt(new BN(0))).to.be.eq(true, 'Should yield tEXO reward after start block');
      });
  
      it('Should reduce BUSD balance after staking', async () => {
        const userBUSDBalanceAfterStake = await this.bUSDInstance.balanceOf(staker1);
  
        expect(userBUSDBalanceAfterStake.toNumber()).to.be.equal(200, "User should have spent 800 BUSD");
      });

      it('Withdraw should have zero tEXO rewards when performed after startBlock but before claim rewards block', async () => {
        const latestBlock = await time.latestBlock();
  
        await time.advanceBlockTo(latestBlock.toNumber() - this.offsetBlock + 9);

        const beforeWithdrawRewards = await this.tEXOOrchestrator.pendingTEXO('0', staker1);

        await this.tEXOOrchestrator.withdraw('0', '400', { from: staker1 });

        await time.advanceBlock();

        const afterWithdrawRewards = await this.tEXOOrchestrator.pendingTEXO('0', staker1);

        expect(afterWithdrawRewards.gt(beforeWithdrawRewards)).to.be.equal(true, "rewards should continue to increase after withdraw");
  
        const userTEXORewards = await this.tEXOInstance.balanceOf(staker1);
  
        expect(userTEXORewards.eq(new BN(0))).to.be.equal(true, "User should not have tEXO rewards before withdraw time");
      });

      it('Withdraw should yield tEXO rewards after claim rewards block', async () => {
        const latestBlock = await time.latestBlock();
  
        await time.advanceBlockTo(latestBlock.toNumber() - this.offsetBlock + 5 * 24);
  
        await this.tEXOOrchestrator.withdraw('0', '400', { from: staker1 });
  
        const userTEXORewards = await this.tEXOInstance.balanceOf(staker1);
  
        expect(userTEXORewards.gt(new BN(0))).to.be.equal(true, "User should have tEXO rewards after claim rewards time");
      });

      it('Cannot stake after staking phase', async () => {
        const latestBlock = await time.latestBlock();
        await time.advanceBlockTo(latestBlock.toNumber() - this.offsetBlock + 24 * 5);

        await expectRevert(this.tEXOOrchestrator.deposit('0', '0', constants.ZERO_ADDRESS, { from: staker1 }), "deposit: staking period has ended");
      });

      it('Should preserve user\'s reward after staking phase', async () => {
        const latestBlock = await time.latestBlock();
        await time.advanceBlockTo(latestBlock.toNumber() - this.offsetBlock + 24 * 5);
  
        const userPendingRewardLastDay = await this.tEXOOrchestrator.pendingTEXO('0', staker1);
  
        expect(userPendingRewardLastDay.gt(new BN(0)), "User should have pending reward");
  
        await time.advanceBlock();
  
        const userPendingRewardExceed1Day = await this.tEXOOrchestrator.pendingTEXO('0', staker1);
  
        expect(userPendingRewardLastDay.eq(userPendingRewardExceed1Day)).to.be.equal(true, "Should not increase reward after 30 days");
  
        await this.tEXOOrchestrator.withdraw('0', '600', { from: staker1 });
  
        const userRewardBalance = await this.tEXOInstance.balanceOf(staker1);
  
        expect(userRewardBalance.eq(userPendingRewardLastDay)).to.be.equal(true, "User should have FAANG balance equal to pending reward");
      });
    });

    describe('LP farm tests', () => {
      beforeEach('User staked 800 tEXO/BNB', async () => {
        await this.tEXOBNBFarmInstance.approve(
          this.tEXOOrchestrator.address,
          '800',
          {
            from: staker1,
          }
        );
        this.offsetBlock++;

        // Set alloc point of seeding pool to 0
        await this.tEXOOrchestrator.set(
          '0',
          '0',
          '400',
          false,
          '0',
          '0',
        );
        this.offsetBlock++;

        // Set alloc point of LP farm to 50
        await this.tEXOOrchestrator.set(
          '1',
          '5000',
          '0',
          false,
          '0',
          '0',
        );
        this.offsetBlock++;
    
        await this.tEXOOrchestrator.deposit(
          '1', // pool index
          '800', // stake amount,
          constants.ZERO_ADDRESS, // referrer,
          {
            from: staker1,
          }
        );
        this.offsetBlock++;
      });
  
      it('Can\'t yield tEXO before ending staking phase', async () => {
        await time.advanceBlock();
        const staker1PendingTEXO = await this.tEXOOrchestrator.pendingTEXO('1', staker1);
    
        expect(staker1PendingTEXO.eq(new BN(0))).to.be.equal(true, "Should not yield tEXO before ending staking phase");
      });
  
      it('Yield tEXO after staking phase ended', async () => {
        const latestBlock = await time.latestBlock();
        await time.advanceBlockTo(latestBlock.toNumber() - this.offsetBlock + 24 * 5);
    
        const staker1PendingTEXORightAtStakingPhase = await this.tEXOOrchestrator.pendingTEXO('1', staker1);
        
        expect(staker1PendingTEXORightAtStakingPhase.eq(new BN(0))).to.be.eq(true);

        await time.advanceBlock();

        const staker1PendingTEXOAfterStakingPhase = await this.tEXOOrchestrator.pendingTEXO('1', staker1);

        expect(staker1PendingTEXOAfterStakingPhase.gt(new BN(0))).to.be.eq(true, 'Should yield tEXO reward after staking phase');
      });
  
      it('Should reduce tEXO/BNB balance after staking', async () => {
        const userBUSDBalanceAfterStake = await this.tEXOBNBFarmInstance.balanceOf(staker1);
  
        expect(userBUSDBalanceAfterStake.eq(new BN(200))).to.be.equal(true, "User should have spent 800 BUSD");
      });
  
      it('Withdraw should have zero tEXO rewards when performed before staking phase', async () => {
        const latestBlock = await time.latestBlock();
  
        await time.advanceBlockTo(latestBlock.toNumber() - this.offsetBlock + 24 * 5 - 1);

        await this.tEXOOrchestrator.withdraw('1', '400', { from: staker1 });
  
        const userTexoBalanceAfterWithdraw = await this.tEXOInstance.balanceOf(staker1);

        expect(userTexoBalanceAfterWithdraw.eq(new BN(0))).to.be.equal(true, "User should not have tEXO rewards before staking phase");
      });

      it('Withdraw should yield tEXO rewards after staking phase', async () => {
        const latestBlock = await time.latestBlock();
  
        await time.advanceBlockTo(latestBlock.toNumber() - this.offsetBlock + 24 * 5);
  
        await this.tEXOOrchestrator.withdraw('1', '400', { from: staker1 });
  
        const userTEXORewards = await this.tEXOInstance.balanceOf(staker1);
  
        expect(userTEXORewards.gt(new BN(0))).to.be.equal(true, "User should have tEXO rewards after staking phase");
      });
    });
  });

  describe('Referral feature', () => {
    beforeEach('User staked 800 BUSD', async () => {
      await this.bUSDInstance.approve(
        this.tEXOOrchestrator.address,
        '800',
        {
          from: staker1,
        }
      );
      this.offsetBlock++;

      await this.bUSDInstance.approve(
        this.tEXOOrchestrator.address,
        '800',
        {
          from: dev,
        }
      );
      this.offsetBlock++;
    });


    it('should record referrer correctly', async () => {
      await this.tEXOOrchestrator.deposit(
        '0', // pool index
        '800', // stake amount,
        referrer, // referrer,
        {
          from: staker1,
        }
      );

      const referrerOfStaker1 = await this.tEXOOrchestrator.referrers(staker1);
      expect(referrerOfStaker1).to.be.equal(referrer, 'Referrer of staker 1 should be Referrer account');
    });

    it('should remember previous referrer', async () => {
      await this.tEXOOrchestrator.deposit(
        '0', // pool index
        '400', // stake amount,
        referrer, // referrer,
        {
          from: staker1,
        }
      );

      await this.tEXOOrchestrator.deposit(
        '0', // pool index
        '400', // stake amount,
        dev, // referrer,
        {
          from: staker1,
        }
      );

      const referrerOfStaker1 = await this.tEXOOrchestrator.referrers(staker1);
      expect(referrerOfStaker1).to.be.equal(referrer, 'Referrer of staker 1 should be Referrer account');
    });

    it('should return referredCount correctly', async () => {
      await this.tEXOOrchestrator.deposit(
        '0', // pool index
        '400', // stake amount,
        referrer, // referrer,
        {
          from: staker1,
        }
      );

      await this.tEXOOrchestrator.deposit(
        '0', // pool index
        '400', // stake amount,
        referrer, // referrer,
        {
          from: dev,
        }
      );

      const totalReferred = await this.tEXOOrchestrator.referredCount(referrer);

      expect(totalReferred.eq(new BN(2))).to.be.equal(true, "Should have recorded both referee cases");
    });

    it('Should pay referrer correctly', async () => {
      const currentBlock = await time.latestBlock();

      await this.tEXOOrchestrator.deposit(
        '0', // pool index
        '400', // stake amount,
        referrer, // referrer,
        {
          from: staker1,
        }
      );
      this.offsetBlock++;

      await time.advanceBlockTo(currentBlock.toNumber() - this.offsetBlock + 24 * 5);

      await this.tEXOOrchestrator.withdraw('0', `${400 * 0.96}`, { from: staker1 });

      const staker1Balance = await this.tEXOInstance.balanceOf(staker1);
      const referrerBalance = await this.tEXOInstance.balanceOf(referrer);

      expect(staker1Balance.gt(new BN(0))).to.be.equal(true, "Staker1 should have received tEXO rewards");
      expect(referrerBalance.gt(new BN(0))).to.be.equal(true, "Referrer should have received tEXO rewards");
      expect(referrerBalance.eq(staker1Balance.div(new BN(50)))).to.be.equal(true, "Referrer should own 2% of what staker receives");
    });
  });

  describe('Re-configure start block feature', () => {
    it('Should throw if new start block is behind', async () => {
      await expectRevert(this.tEXOOrchestrator.updateSeedPoolsStartBlock(0, 0, { from: owner }), "update startblock: new start block must be after previous start block");
    });

    it('Reconfigure seeding pool start block correctly', async () => {
      const currentLpFarm = await this.tEXOOrchestrator.poolInfo(1);
      const oldFarmLastRewardBlock = currentLpFarm.lastRewardBlock;
      const oldFarmClaimRewardsBlock = currentLpFarm.blockToReceiveReward;
      const oldFarmInactiveBlock = currentLpFarm.inActiveBlock;

      const currentBlock = await time.latestBlock();
      const newStartBlock = currentBlock.toNumber() + 24; // Delay 24 hours;
      const newInactiveBlock = currentBlock.toNumber() + 24 * 6; // 5 days after new start block

      await this.tEXOOrchestrator.updateSeedPoolsStartBlock(newStartBlock, newInactiveBlock, { from: owner });

      const updatedSeedingPool = await this.tEXOOrchestrator.poolInfo(0);
      const updatedLastRewardBlock = updatedSeedingPool.lastRewardBlock;
      const updatedClaimRewardsBlock = updatedSeedingPool.blockToReceiveReward;
      const updatedInactiveBlock = updatedSeedingPool.inActiveBlock;

      expect(updatedLastRewardBlock.eq(new BN(newStartBlock))).to.be.equal(true, "last reward block should be updated");
      expect(updatedClaimRewardsBlock.eq(new BN(newStartBlock))).to.be.equal(true, "last reward block should be updated");
      expect(updatedInactiveBlock.eq(new BN(newInactiveBlock))).to.be.equal(true, "last reward block should be updated");

      const newLpFarm = await this.tEXOOrchestrator.poolInfo(1);
      const newFarmLastRewardBlock = newLpFarm.lastRewardBlock;
      const newFarmClaimRewardsBlock = newLpFarm.blockToReceiveReward;
      const newFarmInactiveBlock = newLpFarm.inActiveBlock;

      expect(newFarmLastRewardBlock.eq(new BN(oldFarmLastRewardBlock))).to.be.equal(true, "last reward block should be updated");
      expect(newFarmClaimRewardsBlock.eq(new BN(oldFarmClaimRewardsBlock))).to.be.equal(true, "last reward block should be updated");
      expect(newFarmInactiveBlock.eq(new BN(oldFarmInactiveBlock))).to.be.equal(true, "last reward block should be updated");
    });

    it('Should update global blocks correctly', async () => {
      const oldBlockToStartReducingEmissionRate = await this.tEXOOrchestrator.blockToStartReducingEmissionRate();
      const oldGlobalBlockToUnlockClaimingRewards = await this.tEXOOrchestrator.globalBlockToUnlockClaimingRewards();

      const currentBlock = await time.latestBlock();
      const newStartBlock = currentBlock.toNumber() + 24; // Delay 24 hours;
      const newInactiveBlock = currentBlock.toNumber() + 24 * 6; // 5 days after new start block

      await this.tEXOOrchestrator.updateSeedPoolsStartBlock(newStartBlock, newInactiveBlock, { from: owner });

      const newBlockToStartReducingEmissionRate = await this.tEXOOrchestrator.blockToStartReducingEmissionRate();
      const newGlobalBlockToUnlockClaimingRewards = await this.tEXOOrchestrator.globalBlockToUnlockClaimingRewards();

      expect(newBlockToStartReducingEmissionRate.eq(oldBlockToStartReducingEmissionRate)).to.be.equal(false, "should update block to reduce emission rate");
      expect(newBlockToStartReducingEmissionRate.eq(new BN(newInactiveBlock))).to.be.equal(true, "new reduce emission rate block should be updated");
      expect(newGlobalBlockToUnlockClaimingRewards.eq(oldGlobalBlockToUnlockClaimingRewards)).to.be.equal(false, "should update block to claim rewards");
      expect(newGlobalBlockToUnlockClaimingRewards.eq(new BN(newInactiveBlock))).to.be.equal(true, "new block to receive rewards should be updated");
    });
  });
});