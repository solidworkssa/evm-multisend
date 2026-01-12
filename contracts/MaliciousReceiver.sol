// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title MaliciousReceiver
 * @dev Contract that attempts reentrancy attack for testing
 */
contract MaliciousReceiver {
    address public multiSendContract;
    bool public attackExecuted;

    constructor(address _multiSendContract) {
        multiSendContract = _multiSendContract;
    }

    receive() external payable {
        if (!attackExecuted) {
            attackExecuted = true;
            // Attempt to reenter the multiSendNative function
            address payable[] memory recipients = new address payable[](1);
            recipients[0] = payable(address(this));
            uint256[] memory amounts = new uint256[](1);
            amounts[0] = 0.1 ether;
            
            (bool success, ) = multiSendContract.call{value: 0.1 ether}(
                abi.encodeWithSignature(
                    "multiSendNative(address[],uint256[])",
                    recipients,
                    amounts
                )
            );
            require(success, "Reentrancy attack failed");
        }
    }
}
