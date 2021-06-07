const { expect } = require('chai');

const FAANGToken = artifacts.require('FAANGToken');

contract('FAANGToken', ([alice, bob, carol, dev, minter]) => {
  beforeEach(async () => {
    this.FAANGInstance = await FAANGToken.new({
      from: minter,
    });
  });

  it('Has correct name and token symbol', async () => {
    const name = await this.FAANGInstance.name();
    const symbol = await this.FAANGInstance.symbol();

    expect(name).to.equal(
      'FAANG Token',
      'FAANG symbol should be "FAANG Token"',
    );
    expect(symbol).to.equal('FAANG', 'FAANG symbol should be FAANG');
  });

  it('mints', async () => {
    await this.FAANGInstance.mint(alice, 1000, {
      from: minter,
    });

    const aliceBalance = await this.FAANGInstance.balanceOf(alice);
    const totalSupply = await this.FAANGInstance.totalSupply();

    expect(aliceBalance.toString()).to.equal('1000');
    expect(totalSupply.toString()).to.equal('1000');
  });
});
