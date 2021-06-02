const {
  expect
} = require("chai");

const TEXOToken = artifacts.require('TEXOToken');

contract('TEXOToken', ([alice, bob, carol, dev, minter]) => {
  beforeEach(async () => {
    this.tEXOInstance = await TEXOToken.new({
      from: minter
    });
  });

  it('Has correct name and token symbol', async () => {
    const name = await this.tEXOInstance.name();
    const symbol = await this.tEXOInstance.symbol();

    expect(name).to.equal('tEXO Token', 'tEXO symbol should be "tEXO Token"');
    expect(symbol).to.equal('tEXO', 'tEXO symbol should be tEXO');
  });


  it('mints', async () => {
    await this.tEXOInstance.mint(alice, 1000, {
      from: minter
    });

    const aliceBalance = await this.tEXOInstance.balanceOf(alice);
    const totalSupply = await this.tEXOInstance.totalSupply();

    expect(aliceBalance.toString()).to.equal('1000');
    expect(totalSupply.toString()).to.equal('1000');
  });
});