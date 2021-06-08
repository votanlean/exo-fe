const { expect } = require("chai");
const { time, expectRevert } = require('@openzeppelin/test-helpers');

const abi = new ethers.utils.AbiCoder();
const encodeParameters = (types, data) => abi.encode(types, data);

const TEXOToken = artifacts.require('TEXOToken');
const TEXOOrchestrator = artifacts.require('TEXOOrchestrator');
const Timelock = artifacts.require('Timelock');

contract('Timelock', ([owner, admin, dev, fee]) => {
  beforeEach(async () => {
		const latestBlock = await time.latestBlock();

    this.tEXOInstance = await TEXOToken.new({
      from: owner
    });
		
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
		
		this.Timelock = await Timelock.new(
			owner,
			21600, // 6h
			{
				from: owner
			}
		)
  });

	it('Prevent non-owner operation', async () => {
		await this.tEXOInstance.transferOwnership(this.tEXOOrchestrator.address, {
			from: owner
		});

		await expectRevert(
			this.tEXOInstance.transferOwnership(admin, {
				from: owner
			}),
			"Ownable: caller is not the owner"
		)

		const latestTime = (await time.latest());

		await expectRevert(
			this.Timelock.queueTransaction(
				this.tEXOOrchestrator.address,
				'0',
				'setEmissionRate(uint256)',
        encodeParameters(['uint256'], [500]),
				latestTime.add(time.duration.hours(6)),
				{
					from: admin
				}
			),
			"Timelock::queueTransaction: Call must come from admin."
		)
	})

	it('Should lock transaction', async () => {
		const latestTime = (await time.latest());
		const eta = latestTime.add(time.duration.hours(9))

		await this.tEXOInstance.transferOwnership(this.Timelock.address, {
			from: owner
		})

		await this.Timelock.queueTransaction(
			this.tEXOInstance.address,
			'0',
			'transferOwnership(address)',
			encodeParameters(['address'], [admin]),
			eta,
			{
				from: owner
			}
		);

		await expectRevert(
			this.Timelock.executeTransaction(
				this.tEXOInstance.address,
				'0',
				'transferOwnership(address)',
				encodeParameters(['address'], [owner]),
				eta,
				{
					from: owner
				}
			),
			"Timelock::executeTransaction: Transaction hasn't been queued."
		);

		await expectRevert(
			this.Timelock.executeTransaction(
				this.tEXOInstance.address,
				'0',
				'transferOwnership(address)',
				encodeParameters(['address'], [admin]),
				eta,
				{
					from: owner
				}
			),
			"Timelock::executeTransaction: Transaction hasn't surpassed time lock."
		);

		await time.increase(time.duration.hours(12));
		await this.Timelock.executeTransaction(
			this.tEXOInstance.address,
			'0',
			'transferOwnership(address)',
			encodeParameters(['address'], [admin]),
			eta,
			{
				from: owner
			}
		);

		assert.equal((await this.tEXOInstance.owner()).valueOf(), admin);
	});

	it("Should work with TEXOOrchestrator", async () => {
		const latestTime = (await time.latest());
		const eta = latestTime.add(time.duration.hours(9))

		await this.tEXOOrchestrator.transferOwnership(this.Timelock.address, {
			from: owner
		});

		await this.Timelock.queueTransaction(
			this.tEXOOrchestrator.address,
			'0',
			'setEmissionRate(uint256)',
			encodeParameters(['uint256'], [500]),
			eta,
			{
				from: owner
			}
		);

		await time.increase(time.duration.hours(12));

		await this.Timelock.executeTransaction(
			this.tEXOOrchestrator.address,
			'0',
			'setEmissionRate(uint256)',
			encodeParameters(['uint256'], [500]),
			eta,
			{
				from: owner
			}
		);

		assert.equal((await this.tEXOOrchestrator.tEXOPerBlock()).valueOf(), 500);
	})
});