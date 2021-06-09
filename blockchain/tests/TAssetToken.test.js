const { expect } = require("chai");
const { BN, expectRevert, time, constants } = require('@openzeppelin/test-helpers');

const TAssetToken = artifacts.require('TAssetToken');

contract('TAssetToken', ([owner, oracle, transferer, recepient, mintee]) => {
  beforeEach(async () => {
    this.tAssetToken = await TAssetToken.new('Apple Token', 'tAPPL', {
      from: owner
    });
  });

  describe('Metadata tests', () => {
    it('Has correct name and token symbol', async () => {
      const name = await this.tAssetToken.name();
      const symbol = await this.tAssetToken.symbol();
  
      expect(name).to.equal('Apple Token', 'tAPPl symbol should be "Apple Token"');
      expect(symbol).to.equal('tAPPL', 'tAPPl symbol should be tAPPl');
    });
  });

  describe('Intialization test', () => {
    it('mints', async () => {
      await this.tAssetToken.initialize(oracle, 15000);
      await this.tAssetToken.updatePrice('30', { from: oracle });
      await this.tAssetToken.mint(mintee, 1000, {
        from: owner
      });
  
      await this.tAssetToken.mint(transferer, 1000, {
        from: owner,
      });

      const minteeBalance = await this.tAssetToken.balanceOf(mintee);
      const transfererBalance = await this.tAssetToken.balanceOf(transferer);
      const totalSupply = await this.tAssetToken.totalSupply();
  
      expect(minteeBalance.toString()).to.equal('1000');
      expect(transfererBalance.toString()).to.equal('1000');
      expect(totalSupply.toString()).to.equal('2000');
    });

    it('Cannot init under collateral ratio or pass empty oracle', async () => {
      await expectRevert(this.tAssetToken.initialize(constants.ZERO_ADDRESS, '15000'), "initialize: oracle must not be empty");
      await expectRevert(this.tAssetToken.initialize(oracle, '1500'), "initialize: minimum collateral ratio not satisfied");
    })
  
    it('initialize oracle and collateral ratio', async () => {
      await this.tAssetToken.initialize(oracle, '15000', { from: owner });

      const tAssetOracle = await this.tAssetToken.oracle();

      expect(tAssetOracle.toString()).to.be.equal(oracle.toString(), "Oracle must have been registered");

      const tAssetCollateralRatio = await this.tAssetToken.collateralRatio();

      expect(tAssetCollateralRatio.eq(new BN(15000))).to.be.equal(true, "Collateral ratio must have been registered");
    });
  });

  describe('Price update and Pause test', () => {
    beforeEach(async () => {
      await this.tAssetToken.initialize(oracle, '15000', { from: owner });
      await this.tAssetToken.updatePrice('20', { from: oracle });
    });

    it('Can update price by oracle', async () => {
      const currentPrice = await this.tAssetToken.price();

      expect(currentPrice.eq(new BN(20))).to.be.equal(true, "Price must be updated by oracle");
    });

    it('Only oracle can update price', async () => {
      await expectRevert(this.tAssetToken.updatePrice('20', { from: owner }), "Only oracle is authorized");
    });

    it('Can transfer if price is up to date', async () => {
      await this.tAssetToken.mint(transferer, 1000, {
        from: owner,
      });
      await this.tAssetToken.transfer(recepient, '1000', { from: transferer });

      const transfererBalance = await this.tAssetToken.balanceOf(transferer);

      expect(transfererBalance.eq(new BN(0))).to.be.equal(true, "Should be able to transfer");

      const recepientBalance = await this.tAssetToken.balanceOf(recepient);
      expect(recepientBalance.eq(new BN(1000))).to.be.equal(true, "Should be able to receive");
    });

    it('Throw if transfer when price is out of date', async () => {
      await this.tAssetToken.updatePrice('30', { from: oracle });

      const currentBlock = await time.latestBlock();
      await time.advanceBlockTo(currentBlock.toNumber() + 20);

      await expectRevert(this.tAssetToken.transfer(recepient, 1000, { from: transferer }), "pausable: contract is paused");
    });
  });
});