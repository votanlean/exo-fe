const chai = require('chai');

const { expect } = require("chai");
const { BN, expectRevert, time, constants } = require('@openzeppelin/test-helpers');

const FAANGToken = artifacts.require('FAANGToken');
const TAssetToken = artifacts.require('TAssetToken');
const TAssetOrchestrator = artifacts.require('TAssetOrchestrator');

contract('TAssetOrchestrator', ([owner, FAANGOwner, anonymous, oracle]) => {
  beforeEach(async () => {
    this.FAANGToken = await FAANGToken.new({ from: owner });
    this.tAssetOrchestrator = await TAssetOrchestrator.new(this.FAANGToken.address, { from: owner });
  });

  describe('tASSET Creation', () => {
    it('Creates new tASSET', async () => {
      await this.tAssetOrchestrator.createTAsset('Apple Token', 'tAPPL', { from: owner });

      const createdApplToken = await this.tAssetOrchestrator.createdTAssets(0);

      expect(createdApplToken).to.be.ok;
    });

    it('Only owner can create new tASSET', async () => {
      await expectRevert(this.tAssetOrchestrator.createTAsset('Apple Token', 'tAPPL', { from: anonymous }), "Ownable: caller is not the owner");
    });
  });

  describe('tASSET Redeem', () => {
    beforeEach(async () => {
      await this.tAssetOrchestrator.createTAsset('Apple Token', 'tAPPL', { from: owner });
      await this.tAssetOrchestrator.initializeTAsset('0', oracle, '15000', { from: owner });
      
      await this.FAANGToken.mint(FAANGOwner, '1000', { from: owner });
      await this.FAANGToken.approve(this.tAssetOrchestrator.address, constants.MAX_UINT256, { from: FAANGOwner });

    });

    it('Should throw if tASSET not found', async () => {
      await expectRevert(this.tAssetOrchestrator.redeemFAANG('1', '1000'), "redeem: tAsset does not exist");
    });

    it('Should throw if redeem more than FAANG balance', async () => {
      await expectRevert(this.tAssetOrchestrator.redeemFAANG('0', '1200'), "revert BEP20: transfer amount exceeds balance");
    });

    it('Should not redeem if oracle not initialized', async () => {
      await expectRevert(this.tAssetOrchestrator.redeemFAANG('0', '1000', { from: FAANGOwner }), "revert pausable: contract is paused");
    });
    
    it('Should redeem tASSET correctly within FAANG balance', async () => {
      const tAPPLAddress = await this.tAssetOrchestrator.createdTAssets(0);

      const tAPPL = new web3.eth.Contract(TAssetToken.abi, tAPPLAddress);

      await tAPPL.methods.updatePrice('30').send({ from: oracle });

      await this.tAssetOrchestrator.redeemFAANG('0', '1000', { from: FAANGOwner });

      const userTApplBalance = await tAPPL.methods.balanceOf(FAANGOwner).call();

      expect(userTApplBalance).to.be.equal('1000', "FAANG should have redeemed 1000 tAPPL");
    });

    it('Should check price expiration correctly', async () => {
      const tAPPLAddress = await this.tAssetOrchestrator.createdTAssets(0);

      const tAPPL = new web3.eth.Contract(TAssetToken.abi, tAPPLAddress);

      await tAPPL.methods.updatePrice('30').send({ from: oracle });

      const currentBlock = await time.latestBlock();

      await this.tAssetOrchestrator.redeemFAANG('0', '500', { from: FAANGOwner });

      const userTApplBalance = await tAPPL.methods.balanceOf(FAANGOwner).call();
      const userFAANGBalance = await this.FAANGToken.balanceOf(FAANGOwner);

      expect(userTApplBalance).to.be.equal('500', "FAANG should have redeemed 500 tAPPL");
      expect(userFAANGBalance.eq(new BN(500))).to.be.equal(true, "User should have burned 500 FAANG");

      await time.advanceBlockTo(currentBlock.toNumber() + 20);

      await expectRevert(this.tAssetOrchestrator.redeemFAANG('0', '500', { from: FAANGOwner }), "pausable: contract is paused");
    });
  });
});