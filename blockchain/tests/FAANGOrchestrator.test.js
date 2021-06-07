const { expect } = require('chai');
const { expectRevert, time, constants } = require('@openzeppelin/test-helpers');
const { BN } = require('@openzeppelin/test-helpers/src/setup');

const FAANGOrchestrator = artifacts.require('FAANGOrchestrator');
const FAANGToken = artifacts.require('FAANGToken');
const TEXOToken = artifacts.require('TEXOToken');

// Note: a Read transaction doesn't increase block height by 1. the block.number value is equal to the current block height.
// A write transaction increases block height by 1, the block.number will be block height + 1

contract('FAANGOrchestrator', ([owner, dev, fee, staker1, referrer]) => {
  beforeEach(async () => {
    // Note: every successful operation increases the block by 1 (1 hour);
    this.FAANGInstance = await FAANGToken.new({ from: owner });
    this.tEXOInstance = await TEXOToken.new({ from: owner });

    // mint some token to staker
    await this.tEXOInstance.mint(staker1, '1000', { from: owner });
    await this.tEXOInstance.mint(dev, '1000', { from: owner });

    const latestBlock = await time.latestBlock();
    this.offsetBlock = 0;

    this.FAANGOrchestrator = await FAANGOrchestrator.new(
      this.FAANGInstance.address,
      dev,
      fee,
      latestBlock.toNumber(), // Start calculate rewards immediately,
      {
        from: owner,
      },
    );

    this.offsetBlock++;

    // Add tEXO seed pool.
    this.FAANGOrchestrator.add(
      '10000', // Allocation point,
      this.tEXOInstance.address,
      '0', // Deposit fee
      false, // With update
      {
        from: owner,
      },
    );
    this.offsetBlock++;

    // Transfer ownership of FAANGInstance to Orchestrator for minting permission
    await this.FAANGInstance.transferOwnership(this.FAANGOrchestrator.address, {
      from: owner,
    });
    this.offsetBlock++;
  });

  describe('Initialization phase tests', () => {
    it('Has correct pool numbers', async () => {
      const poolLength = await this.FAANGOrchestrator.poolLength();

      expect(poolLength.toString()).to.equal('1');
    });

    it('Staker1 has correct minted balance', async () => {
      const stakerTEXOBalance = await this.tEXOInstance.balanceOf(staker1);

      expect(stakerTEXOBalance.toString()).to.equal('1000');
    });

    it('Ownership of FAANG should be FAANGOrchestrator', async () => {
      const FAANGOwner = await this.FAANGInstance.owner();

      expect(FAANGOwner).to.equal(this.FAANGOrchestrator.address);
    });
  });

  describe('Staking phase tests', () => {
    it('Cannot stake before approval', async () => {
      let hasError = false;
      try {
        await this.FAANGOrchestrator.deposit(
          '0', // pool index
          '1000', // stake amount,
          constants.ZERO_ADDRESS,
          {
            from: staker1,
          },
        );
      } catch (error) {
        hasError = true;
      }

      expect(hasError).to.be.equal(
        true,
        'Should not allow stake before approve',
      );
    });

    it('Cannot stake exceed approval amount', async () => {
      let hasError = false;
      try {
        await this.tEXOInstance.approve(this.FAANGOrchestrator.address, '600', {
          from: staker1,
        });

        await this.FAANGOrchestrator.deposit(
          '0', // pool index
          '700', // stake amount,
          constants.ZERO_ADDRESS, // referrer,
          {
            from: staker1,
          },
        );
      } catch (error) {
        hasError = true;
      }

      expect(hasError).to.be.equal(
        true,
        'Should not be able to stake exceeding approval amount',
      );
    });

    it('Allow stake if amount is good', async () => {
      let hasError = false;
      try {
        await this.tEXOInstance.approve(this.FAANGOrchestrator.address, '800', {
          from: staker1,
        });

        await this.FAANGOrchestrator.deposit(
          '0', // pool index
          '700', // stake amount,
          constants.ZERO_ADDRESS, // referrer,
          {
            from: staker1,
          },
        );
      } catch (_) {
        hasError = true;
      }

      expect(hasError).to.be.equal(
        false,
        'Must be able to stake within allowance',
      );
    });
  });

  // describe('Claim rewards & withdraw phase', () => {
  describe('Seeding pool tests', () => {
    beforeEach('User staked 800 tEXO', async () => {
      await this.tEXOInstance.approve(this.FAANGOrchestrator.address, '800', {
        from: staker1,
      });
      await this.FAANGOrchestrator.deposit(
        '0', // pool index
        '800', // stake amount,
        constants.ZERO_ADDRESS, // referrer,
        {
          from: staker1,
        },
      );
    });

    it('Can yield 1 FAANG after 1 block', async () => {
      time.advanceBlock(1);
      const staker1PendingFAANG = await this.FAANGOrchestrator.pendingFAANG(
        '0',
        staker1,
      );
      expect(
        web3.utils.fromWei(staker1PendingFAANG, 'ether').toString(),
      ).to.be.equal('1', 'Should yield 1 FAANG per block');
    });

    it('Yield tEXO after startBlock', async () => {
      const currentBlock = await time.latestBlock();

      await time.advanceBlockTo(currentBlock.toNumber() - this.offsetBlock + 9);

      const staker1PendingTEXO = await this.FAANGOrchestrator.pendingFAANG(
        '0',
        staker1,
      );

      expect(staker1PendingTEXO.gt(new BN(0))).to.be.eq(
        true,
        'Should yield tEXO reward after start block',
      );
    });

    it('Should reduce tEXO balance after staking', async () => {
      const userTEXOBalanceAfterStake = await this.tEXOInstance.balanceOf(
        staker1,
      );

      expect(userTEXOBalanceAfterStake.toNumber()).to.be.equal(
        200,
        'User should have spent 800 TEXO',
      );
    });

    it('Withdraw should have zero tEXO rewards when performed after startBlock but before claim rewards block', async () => {
      const latestBlock = await time.latestBlock();

      await time.advanceBlockTo(latestBlock.toNumber() - this.offsetBlock + 9);

      const beforeWithdrawRewards = await this.FAANGOrchestrator.pendingFAANG(
        '0',
        staker1,
      );

      await this.FAANGOrchestrator.withdraw('0', '400', { from: staker1 });

      await time.advanceBlock();

      const afterWithdrawRewards = await this.FAANGOrchestrator.pendingFAANG(
        '0',
        staker1,
      );

      //TODO with orchestrator for new without + reward logic
      expect(afterWithdrawRewards.gt(new BN(0))).to.be.equal(
        true,
        'rewards should continue to increase after withdraw',
      );
    });

    it('Withdraw should yield FAANG rewards after claim rewards block', async () => {
      const latestBlock = await time.latestBlock();

      await time.advanceBlockTo(
        latestBlock.toNumber() - this.offsetBlock + 5 * 24,
      );

      await this.FAANGOrchestrator.withdraw('0', '400', { from: staker1 });

      const userFAANGRewards = await this.FAANGInstance.balanceOf(staker1);

      expect(userFAANGRewards.gt(new BN(0))).to.be.equal(
        true,
        'User should have FAANG rewards after claim rewards time',
      );
    });
  });
  //
  //   describe('LP farm tests', () => {
  //     beforeEach('User staked 800 tEXO/BNB', async () => {
  //       await this.tEXOBNBFarmInstance.approve(this.FAANGOrchestrator.address, '800', {
  //         from: staker1,
  //       });
  //       this.offsetBlock++;
  //
  //       // Set alloc point of seeding pool to 0
  //       await this.FAANGOrchestrator.set('0', '0', '400', false, '0');
  //       this.offsetBlock++;
  //
  //       // Set alloc point of LP farm to 50
  //       await this.FAANGOrchestrator.set('1', '5000', '0', false, '0');
  //       this.offsetBlock++;
  //
  //       await this.FAANGOrchestrator.deposit(
  //         '1', // pool index
  //         '800', // stake amount,
  //         constants.ZERO_ADDRESS, // referrer,
  //         {
  //           from: staker1,
  //         },
  //       );
  //       this.offsetBlock++;
  //     });
  //
  //     it("Can't yield tEXO before ending staking phase", async () => {
  //       const staker1PendingTEXO = await this.FAANGOrchestrator.pendingTEXO(
  //         '1',
  //         staker1,
  //       );
  //
  //       expect(staker1PendingTEXO.eq(new BN(0))).to.be.equal(
  //         true,
  //         'Should not yield tEXO before ending staking phase',
  //       );
  //     });
  //
  //     it('Yield tEXO after staking phase ended', async () => {
  //       const latestBlock = await time.latestBlock();
  //       await time.advanceBlockTo(
  //         latestBlock.toNumber() - this.offsetBlock + 24 * 5,
  //       );
  //
  //       const staker1PendingTEXORightAtStakingPhase =
  //         await this.FAANGOrchestrator.pendingTEXO('1', staker1);
  //
  //       expect(staker1PendingTEXORightAtStakingPhase.eq(new BN(0))).to.be.eq(
  //         true,
  //       );
  //
  //       await time.advanceBlock();
  //
  //       const staker1PendingTEXOAfterStakingPhase =
  //         await this.FAANGOrchestrator.pendingTEXO('1', staker1);
  //
  //       expect(staker1PendingTEXOAfterStakingPhase.gt(new BN(0))).to.be.eq(
  //         true,
  //         'Should yield tEXO reward after staking phase',
  //       );
  //     });
  //
  //     it('Should reduce tEXO/BNB balance after staking', async () => {
  //       const userTEXOBalanceAfterStake =
  //         await this.tEXOBNBFarmInstance.balanceOf(staker1);
  //
  //       expect(userTEXOBalanceAfterStake.eq(new BN(200))).to.be.equal(
  //         true,
  //         'User should have spent 800 TEXO',
  //       );
  //     });
  //
  //     it('Withdraw should have zero tEXO rewards when performed before staking phase', async () => {
  //       const latestBlock = await time.latestBlock();
  //
  //       await time.advanceBlockTo(
  //         latestBlock.toNumber() - this.offsetBlock + 24 * 5 - 1,
  //       );
  //
  //       await this.FAANGOrchestrator.withdraw('1', '400', { from: staker1 });
  //
  //       const userTexoBalanceAfterWithdraw = await this.tEXOInstance.balanceOf(
  //         staker1,
  //       );
  //
  //       expect(userTexoBalanceAfterWithdraw.eq(new BN(0))).to.be.equal(
  //         true,
  //         'User should not have tEXO rewards before staking phase',
  //       );
  //     });
  //
  //     it('Withdraw should yield tEXO rewards after staking phase', async () => {
  //       const latestBlock = await time.latestBlock();
  //
  //       await time.advanceBlockTo(
  //         latestBlock.toNumber() - this.offsetBlock + 24 * 5,
  //       );
  //
  //       await this.FAANGOrchestrator.withdraw('1', '400', { from: staker1 });
  //
  //       const userTEXORewards = await this.tEXOInstance.balanceOf(staker1);
  //
  //       expect(userTEXORewards.gt(new BN(0))).to.be.equal(
  //         true,
  //         'User should have tEXO rewards after staking phase',
  //       );
  //     });
  //   });
  // });

  // describe('Referral feature', () => {
  //   beforeEach('User staked 800 TEXO', async () => {
  //     await this.bUSDInstance.approve(this.FAANGOrchestrator.address, '800', {
  //       from: staker1,
  //     });
  //     this.offsetBlock++;
  //
  //     await this.bUSDInstance.approve(this.FAANGOrchestrator.address, '800', {
  //       from: dev,
  //     });
  //     this.offsetBlock++;
  //   });
  //
  //   it('should record referrer correctly', async () => {
  //     await this.FAANGOrchestrator.deposit(
  //       '0', // pool index
  //       '800', // stake amount,
  //       referrer, // referrer,
  //       {
  //         from: staker1,
  //       },
  //     );
  //
  //     const referrerOfStaker1 = await this.FAANGOrchestrator.referrers(staker1);
  //     expect(referrerOfStaker1).to.be.equal(
  //       referrer,
  //       'Referrer of staker 1 should be Referrer account',
  //     );
  //   });
  //
  //   it('should remember previous referrer', async () => {
  //     await this.FAANGOrchestrator.deposit(
  //       '0', // pool index
  //       '400', // stake amount,
  //       referrer, // referrer,
  //       {
  //         from: staker1,
  //       },
  //     );
  //
  //     await this.FAANGOrchestrator.deposit(
  //       '0', // pool index
  //       '400', // stake amount,
  //       dev, // referrer,
  //       {
  //         from: staker1,
  //       },
  //     );
  //
  //     const referrerOfStaker1 = await this.FAANGOrchestrator.referrers(staker1);
  //     expect(referrerOfStaker1).to.be.equal(
  //       referrer,
  //       'Referrer of staker 1 should be Referrer account',
  //     );
  //   });
  //
  //   it('should return referredCount correctly', async () => {
  //     await this.FAANGOrchestrator.deposit(
  //       '0', // pool index
  //       '400', // stake amount,
  //       referrer, // referrer,
  //       {
  //         from: staker1,
  //       },
  //     );
  //
  //     await this.FAANGOrchestrator.deposit(
  //       '0', // pool index
  //       '400', // stake amount,
  //       referrer, // referrer,
  //       {
  //         from: dev,
  //       },
  //     );
  //
  //     const totalReferred = await this.FAANGOrchestrator.referredCount(referrer);
  //
  //     expect(totalReferred.eq(new BN(2))).to.be.equal(
  //       true,
  //       'Should have recorded both referee cases',
  //     );
  //   });
  //
  //   it('Should pay referrer correctly', async () => {
  //     const currentBlock = await time.latestBlock();
  //
  //     await this.FAANGOrchestrator.deposit(
  //       '0', // pool index
  //       '400', // stake amount,
  //       referrer, // referrer,
  //       {
  //         from: staker1,
  //       },
  //     );
  //     this.offsetBlock++;
  //
  //     await time.advanceBlockTo(
  //       currentBlock.toNumber() - this.offsetBlock + 24 * 5,
  //     );
  //
  //     await this.FAANGOrchestrator.withdraw('0', `${400 * 0.96}`, { from: staker1 });
  //
  //     const staker1Balance = await this.tEXOInstance.balanceOf(staker1);
  //     const referrerBalance = await this.tEXOInstance.balanceOf(referrer);
  //
  //     expect(staker1Balance.gt(new BN(0))).to.be.equal(
  //       true,
  //       'Staker1 should have received tEXO rewards',
  //     );
  //     expect(referrerBalance.gt(new BN(0))).to.be.equal(
  //       true,
  //       'Referrer should have received tEXO rewards',
  //     );
  //     expect(referrerBalance.eq(staker1Balance.div(new BN(10)))).to.be.equal(
  //       true,
  //       'Referrer should own 2% of what staker receives',
  //     );
  //   });
  // });
});
