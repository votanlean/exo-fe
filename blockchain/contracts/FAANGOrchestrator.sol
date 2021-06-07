// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "./SafeMath.sol";
import "./IBEP20.sol";
import "./SafeBEP20.sol";
import "./Ownable.sol";
import "./ReentrancyGuard.sol";

import "./FAANG.sol";

// MasterChef is the master of FAANG. He can make FAANG and he is a fair guy.
//
// Note that it's ownable and the owner wields tremendous power. The ownership
// will be transferred to a governance smart contract once JAGUAR is sufficiently
// distributed and the community can show to govern itself.
//
// Have fun reading it. Hopefully it's bug-free. God bless.
contract FAANGOrchestrator is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeBEP20 for IBEP20;

    // Info of each user.
    struct UserInfo {
        uint256 amount;         // How many LP tokens the user has provided.
        uint256 rewardDebt;     // Reward debt. See explanation below.
        uint256 rewardLockedUp; // Reward locked up regardless of user's current rewardDept
        //
        // We do some fancy math here. Basically, any point in time, the amount of JAGUARs
        // entitled to a user but is pending to be distributed is:
        //
        //   pending reward = (user.amount * pool.accFAANGPerShare) - user.rewardDebt
        //
        // Whenever a user deposits or withdraws LP tokens to a pool. Here's what happens:
        //   1. The pool's `accFAANGPerShare` (and `lastRewardBlock`) gets updated.
        //   2. User receives the pending reward sent to his/her address.
        //   3. User's `amount` gets updated.
        //   4. User's `rewardDebt` gets updated.
    }

    // Info of each pool.
    struct PoolInfo {
        IBEP20 lpToken;           // Address of LP token contract.
        uint256 allocPoint;       // How many allocation points assigned to this pool. JAGUARs to distribute per block.
        uint256 lastRewardBlock;  // Last block number that JAGUARs distribution occurs.
        uint256 accFAANGPerShare;   // Accumulated JAGUARs per share, times 1e12. See below.
        uint16 depositFeeBP;      // Deposit fee in basis points
    }

    // The JAGUAR TOKEN!
    FAANGToken public FAANG;
    // Dev address.
    address public devAddress;
    // Deposit Fee address
    address public feeAddress;
    // JAGUAR tokens created per block.
    uint256 public FAANGPerBlock;
    // Bonus muliplier for early FAANG makers.
    uint256 public constant BONUS_MULTIPLIER = 1;

    // Referral Bonus in basis points. Initially set to 2%
    uint256 public refBonusBP = 200;
    // Max referral commission rate: 20%.
    uint16 public constant MAXIMUM_REFERRAL_BP = 2000;
    // Referral Mapping
    mapping(address => address) public referrers; // account_address -> referrer_address
    mapping(address => uint256) public referredCount; // referrer_address -> num_of_referred

    // Initial emission rate: 1 JAGUAR per block.
    uint256 public constant INITIAL_EMISSION_RATE = 1 ether;

    // Info of each pool.
    PoolInfo[] public poolInfo;
    // Info of each user that stakes LP tokens.
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;
    // Total allocation points. Must be the sum of all allocation points in all pools.
    uint256 public totalAllocPoint = 0;
    // The block number when JAGUAR mining starts.
    uint256 public startBlock;

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event Referral(address indexed _referrer, address indexed _user);
    event ReferralPaid(address indexed _user, address indexed _userTo, uint256 _reward);
    event ReferralBonusBpChanged(uint256 _oldBp, uint256 _newBp);

    constructor(
        FAANGToken _FAANG,
        address _devAddr,
        address _feeAddress,
        uint256 _startBlock
    ) public {
        FAANG = _FAANG;
        devAddress = _devAddr;
        feeAddress = _feeAddress;
        startBlock = _startBlock;
        FAANGPerBlock = INITIAL_EMISSION_RATE;
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    // Add a new lp to the pool. Can only be called by the owner.
    // XXX DO NOT add the same LP token more than once. Rewards will be messed up if you do.
    function add(uint256 _allocPoint, IBEP20 _lpToken, uint16 _depositFeeBP, bool _withUpdate) public onlyOwner {
        require(_depositFeeBP <= 10000, "add: invalid deposit fee basis points");
        if (_withUpdate) {
            massUpdatePools();
        }
        uint256 lastRewardBlock = block.number > startBlock ? block.number : startBlock;
        totalAllocPoint = totalAllocPoint.add(_allocPoint);
        poolInfo.push(PoolInfo({
        lpToken: _lpToken,
        allocPoint: _allocPoint,
        lastRewardBlock: lastRewardBlock,
        accFAANGPerShare: 0,
        depositFeeBP: _depositFeeBP
        }));
    }

    // Update the given pool's JAGUAR allocation point and deposit fee. Can only be called by the owner.
    function set(uint256 _pid, uint256 _allocPoint, uint16 _depositFeeBP, bool _withUpdate) public onlyOwner {
        require(_depositFeeBP <= 10000, "set: invalid deposit fee basis points");
        if (_withUpdate) {
            massUpdatePools();
        }
        totalAllocPoint = totalAllocPoint.sub(poolInfo[_pid].allocPoint).add(_allocPoint);
        poolInfo[_pid].allocPoint = _allocPoint;
        poolInfo[_pid].depositFeeBP = _depositFeeBP;
    }

    // Return reward multiplier over the given _from to _to block.
    function getMultiplier(uint256 _from, uint256 _to) public pure returns (uint256) {
        return _to.sub(_from).mul(BONUS_MULTIPLIER);
    }

    // View function to see pending JAGUARs on frontend.
    function pendingFAANG(uint256 _pid, address _user) external view returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accFAANGPerShare = pool.accFAANGPerShare;
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (block.number > pool.lastRewardBlock && lpSupply != 0) {
            uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
            uint256 FAANGReward = multiplier.mul(FAANGPerBlock).mul(pool.allocPoint).div(totalAllocPoint);
            accFAANGPerShare = accFAANGPerShare.add(FAANGReward.mul(1e12).div(lpSupply));
        }
        return user.amount.mul(accFAANGPerShare).div(1e12).sub(user.rewardDebt);
    }

    // Update reward variables for all pools. Be careful of gas spending!
    function massUpdatePools() public {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        uint256 lpSupply = pool.lpToken.balanceOf(address(this));
        if (lpSupply == 0 || pool.allocPoint == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
        uint256 FAANGReward = multiplier.mul(FAANGPerBlock).mul(pool.allocPoint).div(totalAllocPoint);
        FAANG.mint(devAddress, FAANGReward.div(10));
        FAANG.mint(address(this), FAANGReward);
        pool.accFAANGPerShare = pool.accFAANGPerShare.add(FAANGReward.mul(1e12).div(lpSupply));
        pool.lastRewardBlock = block.number;
    }

    // Deposit LP tokens to MasterChef for tEXO allocation with referral.
    function deposit(uint256 _pid, uint256 _amount, address _referrer) public nonReentrant {
        require(_referrer == address(_referrer),"deposit: Invalid referrer address");

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        updatePool(_pid);

        payOrLockupPendingFAANG(_pid);

        if (_amount > 0 && _referrer != address(0) && _referrer != msg.sender) {
            setReferral(msg.sender, _referrer);
        }

        if (_amount > 0) {
            pool.lpToken.safeTransferFrom(address(msg.sender), address(this), _amount);

            if (pool.depositFeeBP > 0) {
                uint256 depositFee = _amount
                .mul(pool.depositFeeBP)
                .div(10000);

                user.amount = user.amount
                .add(_amount)
                .sub(depositFee);

                pool.lpToken.safeTransfer(feeAddress, depositFee);
            } else {
                user.amount = user.amount.add(_amount);
            }
        }

        user.rewardDebt = user.amount
        .mul(pool.accFAANGPerShare)
        .div(1e12);

        emit Deposit(msg.sender, _pid, _amount);
    }

    // Withdraw LP tokens from MasterChef.
    function withdraw(uint256 _pid, uint256 _amount) public nonReentrant {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        require(user.amount >= _amount, "withdraw: not good");

        updatePool(_pid);

        payOrLockupPendingFAANG(_pid);

        if (_amount > 0) {
            user.amount = user.amount.sub(_amount);
            pool.lpToken.safeTransfer(address(msg.sender), _amount);
        }

        user.rewardDebt = user.amount
        .mul(pool.accFAANGPerShare)
        .div(1e12);

        emit Withdraw(msg.sender, _pid, _amount);
    }


    // Pay or lockup pending tEXO.
    function payOrLockupPendingFAANG(uint256 _pid) internal {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        uint256 pending = user.amount
        .mul(pool.accFAANGPerShare)
        .div(1e12)
        .sub(user.rewardDebt);

        if (pending > 0 || user.rewardLockedUp > 0) {
            uint256 totalRewards = pending.add(user.rewardLockedUp);

            user.rewardLockedUp = 0;

            // send rewards
            safeFAANGTransfer(msg.sender, totalRewards);
            payReferralCommission(msg.sender, totalRewards);
        }
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdraw(uint256 _pid) public nonReentrant {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        uint256 amount = user.amount;
        user.amount = 0;
        user.rewardDebt = 0;
        pool.lpToken.safeTransfer(address(msg.sender), amount);
        emit EmergencyWithdraw(msg.sender, _pid, amount);
    }

    // Safe FAANG transfer function, just in case if rounding error causes pool to not have enough JAGUARs.
    function safeFAANGTransfer(address _to, uint256 _amount) internal {
        uint256 FAANGBal = FAANG.balanceOf(address(this));
        bool transferSuccess = false;
        if (_amount > FAANGBal) {
            transferSuccess = FAANG.transfer(_to, FAANGBal);
        } else {
            transferSuccess = FAANG.transfer(_to, _amount);
        }
        require(transferSuccess, "safeFAANGTransfer: Transfer failed");
    }

    // Update dev address by the previous dev.
    function setDevAddress(address _devAddress) public {
        require(msg.sender == devAddress, "setDevAddress: FORBIDDEN");
        devAddress = _devAddress;
    }

    function setFeeAddress(address _feeAddress) public {
        require(msg.sender == feeAddress, "setFeeAddress: FORBIDDEN");
        feeAddress = _feeAddress;
    }


    // Set Referral Address for a user
    function setReferral(address _user, address _referrer) internal {
        if (_referrer == address(_referrer) && referrers[_user] == address(0) && _referrer != address(0) && _referrer != _user) {
            referrers[_user] = _referrer;
            referredCount[_referrer] += 1;
            emit Referral(_user, _referrer);
        }
    }

    // Get Referral Address for a Account
    function getReferral(address _user) public view returns (address) {
        return referrers[_user];
    }

    // Pay referral commission to the referrer who referred this user.
    function payReferralCommission(address _user, uint256 _pending) internal {
        address referrer = getReferral(_user);
        if (referrer != address(0) && referrer != _user && refBonusBP > 0) {
            uint256 refBonusEarned = _pending.mul(refBonusBP).div(10000);
            FAANG.mint(referrer, refBonusEarned);
            emit ReferralPaid(_user, referrer, refBonusEarned);
        }
    }

    // Referral Bonus in basis points.
    // Initially set to 2%, this this the ability to increase or decrease the Bonus percentage based on
    // community voting and feedback.
    function updateReferralBonusBp(uint256 _newRefBonusBp) public onlyOwner {
        require(_newRefBonusBp <= MAXIMUM_REFERRAL_BP, "updateRefBonusPercent: invalid referral bonus basis points");
        require(_newRefBonusBp != refBonusBP, "updateRefBonusPercent: same bonus bp set");
        uint256 previousRefBonusBP = refBonusBP;
        refBonusBP = _newRefBonusBp;
        emit ReferralBonusBpChanged(previousRefBonusBP, _newRefBonusBp);
    }
}
