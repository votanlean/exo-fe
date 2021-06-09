// SPDX-License-Identifier: MIT

/**
 *Submitted for verification at BscScan.com on 2021-05-10
*/

pragma solidity 0.6.12;

import './SafeMath.sol';
import './Context.sol';
import './IBEP20.sol';
import './Address.sol';
import './ReentrancyGuard.sol';
import './Ownable.sol';
import './SafeBEP20.sol';
import './Pausable.sol';
import './FAANGToken.sol';
import './TAssetToken.sol';

contract TAssetOrchestrator is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using SafeBEP20 for IBEP20;

    /// @notice Event created when new tASSET is created
    event TAssetCreated(string name, string symbol);

    address BURN_ADDRESS = 0x000000000000000000000000000000000000dEaD;

    IBEP20 FAANG; // The FAANG token;

    constructor(IBEP20 _FAANG) public {
        FAANG = _FAANG;
    }

    TAssetToken[] public createdTAssets;

    function createTAsset(string calldata _name, string calldata _symbol) public onlyOwner {
        TAssetToken newTAsset = new TAssetToken(_name, _symbol);

        createdTAssets.push(newTAsset);
        
        emit TAssetCreated(_name, _symbol);
    }

    function initializeTAsset(uint256 tAssetIndex, address oracle, uint256 collateralRatio) public {
        TAssetToken tAsset = createdTAssets[tAssetIndex];

        tAsset.initialize(oracle, collateralRatio);
    }

    function redeemFAANG(uint256 tAssetIndex, uint256 redeemAmount) public nonReentrant {
        require(tAssetIndex < createdTAssets.length, "redeem: tAsset does not exist");
        require(redeemAmount > 0, "redeem: amount not good");

        TAssetToken tAsset = createdTAssets[tAssetIndex];

        FAANG.safeTransferFrom(msg.sender, BURN_ADDRESS, redeemAmount);
        bool isSuccess = tAsset.mint(msg.sender, redeemAmount);

        require(isSuccess, "redeem: mint tASSET failed");
    }
}

