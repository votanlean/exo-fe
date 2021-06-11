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

    const latestBlock = await time.latestBlock();
    this.offsetBlock = 0;

    this.FAANGOrchestrator = await FAANGOrchestrator.new(
      this.FAANGInstance.address,
      latestBlock.toNumber() + 24 * 5, // Start calculate rewards after 5 days,
      {
        from: owner,
      },
    );

    this.offsetBlock++;

    // Add tEXO seed pool.
    this.FAANGOrchestrator.add(
      this.tEXOInstance.address,
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
        await this.tEXOInstance.approve(
          this.FAANGOrchestrator.address,
          '600',
          {
            from: staker1,
          }
        );

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
        await this.tEXOInstance.approve(
          this.FAANGOrchestrator.address,
          '800',
          {
            from: staker1,
          },
        );

        await this.FAANGOrchestrator.deposit(
          '0', // pool index
          '700', // stake amount,
          {
            from: staker1,
          },
        );
      } catch (error) {
        console.log(error);
        hasError = true;
      }

      expect(hasError).to.be.equal(
        false,
        'Must be able to stake within allowance',
      );
    });
  });

  describe('Seeding pool tests', () => {
    beforeEach('User staked 800 tEXO', async () => {
      await this.tEXOInstance.approve(
        this.FAANGOrchestrator.address,
        '800',
        {
          from: staker1,
        }
      );
      this.offsetBlock++;

      await this.FAANGOrchestrator.deposit(
        '0', // pool index
        '800', // stake amount,
        {
          from: staker1,
        },
      );
      this.offsetBlock++;
    });

    it('Can yield 1 FAANG after 1 block', async () => {
      const latestBlock = await time.latestBlock();
      await time.advanceBlockTo(latestBlock.toNumber() - this.offsetBlock + 24 * 5 + 1);

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

      await time.advanceBlockTo(currentBlock.toNumber() - this.offsetBlock + 24 * 5 + 1);

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

    it('Should yield no rewards after 30 days', async () => {
      const currentBlock = await time.latestBlock();
      await time.advanceBlockTo(currentBlock.toNumber() - this.offsetBlock + 24 * 5 + 24 * 30 - 1);

      await this.FAANGOrchestrator.updatePool('0');

      const before30DaysReward = await this.FAANGOrchestrator.pendingFAANG('0', staker1);

      expect(before30DaysReward.gt(new BN(0))).to.be.equal(true, "reward before 30 days should be non zero");

      await this.FAANGOrchestrator.updatePool('0');

      const after30DaysReward = await this.FAANGOrchestrator.pendingFAANG('0', staker1);

      const block2 = await time.latestBlock();

      expect(before30DaysReward.eq(after30DaysReward)).to.be.equal(true, "Latest block rewards must not increase after 30 days");
    });

    it('Should not allow staking after 30 days', async () => {
      let hasError = false;
      
      try {
        const currentBlock = await time.latestBlock();
        await time.advanceBlockTo(currentBlock.toNumber() - this.offsetBlock + 24 * 5 + 24 * 30);

        await this.FAANGOrchestrator.deposit('0', '0', { from: staker1 });
      } catch (error) {
        hasError = true;
      }

      expect(hasError).to.be.equal(true, "Must not be able to stake after 30 days");
    });

    it('Withdraw should yield no FAANG before startBlock', async () => {
      const currentBlock = await time.latestBlock();
      await time.advanceBlockTo(currentBlock.toNumber() - this.offsetBlock + 24);

      await this.FAANGOrchestrator.updatePool('0');

      const phase1Reward = await this.FAANGOrchestrator.pendingFAANG('0', staker1);

      expect(phase1Reward.eq(new BN(0))).to.be.equal(true, "Must not yield FAANG before startBlock");
    });

    it('Withdraw should yield FAANG rewards after startBlock', async () => {
      const latestBlock = await time.latestBlock();

      await time.advanceBlockTo(latestBlock.toNumber() - this.offsetBlock + 5 * 24);

      await this.FAANGOrchestrator.withdraw('0', '400', { from: staker1 });

      const userFAANGRewards = await this.FAANGInstance.balanceOf(staker1);

      expect(userFAANGRewards.gt(new BN(0))).to.be.equal(
        true,
        'User should have FAANG rewards after claim rewards time',
      );
    });

    it('Withdraw should yield no rewards after 30 days', async () => {
      const latestBlock = await time.latestBlock();

      await time.advanceBlockTo(latestBlock.toNumber() - this.offsetBlock + 24 * 5 + 30 * 24 - 1);

      await this.FAANGOrchestrator.withdraw('0', '400', { from: staker1 });

      const stakerFAANGBalance = await this.FAANGInstance.balanceOf(staker1);

      expect(stakerFAANGBalance.gt(new BN(0))).to.be.equal(true, "Staker should have received all FAANG rewards before 30 days");

      await this.FAANGOrchestrator.withdraw('0', '400', { from: staker1 });

      const stakerFAANGBalanceAfter30Days = await this.FAANGInstance.balanceOf(staker1);

      expect(stakerFAANGBalance.eq(stakerFAANGBalanceAfter30Days)).to.be.equal(
        true,
        'Withdraw should not yield FAANG after 30 days',
      );
    });

    it('Should preserve user\'s reward after 30 days', async () => {
      const latestBlock = await time.latestBlock();
      await time.advanceBlockTo(latestBlock.toNumber() - this.offsetBlock + 24 * 5 + 30 * 24);

      const userPendingRewardLastDay = await this.FAANGOrchestrator.pendingFAANG('0', staker1);

      expect(userPendingRewardLastDay.gt(new BN(0)), "User should have pending reward");

      await time.advanceBlock();

      const userPendingRewardExceed1Day = await this.FAANGOrchestrator.pendingFAANG('0', staker1);

      expect(userPendingRewardLastDay.eq(userPendingRewardExceed1Day)).to.be.equal(true, "Should not increase reward after 30 days");

      await this.FAANGOrchestrator.withdraw('0', '800', { from: staker1 });

      const userRewardBalance = await this.FAANGInstance.balanceOf(staker1);

      expect(userRewardBalance.eq(userPendingRewardLastDay)).to.be.equal(true, "User should have FAANG balance equal to pending reward");
    });
  });

  describe('Re-configure start block feature', () => {
    it('Should throw if new start block is behind', async () => {
      await expectRevert(this.FAANGOrchestrator.updateStartBlock(0, { from: owner }), "update startblock: new start block must be after previous start block");
    });

    it('Reconfigure FAANG start block correctly', async () => {
      const currentBlock = await time.latestBlock();
      const newStartBlock = currentBlock.toNumber() + 24 * 6; // Delay 24 hours;

      await this.FAANGOrchestrator.updateStartBlock(newStartBlock, { from: owner });

      const updatedFAANGPool = await this.FAANGOrchestrator.poolInfo(0);
      const updatedLastRewardBlock = updatedFAANGPool.lastRewardBlock;

      expect(updatedLastRewardBlock.eq(new BN(newStartBlock))).to.be.equal(true, "last reward block should be updated");
    });
  });
});
