// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Owned.sol";

contract Faucet is Owned {
    address[] public funders;

    modifier limitWithdraw(uint256 amount) {
        require(
            amount <= 100000000000000000,
            "You can not withdraw more then 0.1 ether"
        );
        _;
    }

    receive() external payable {}

    function test1() external checkIsOwner {}

    function test2() external checkIsOwner {}

    function addFunds() external payable {
        funders.push(msg.sender);
    }

    function withdraw(uint256 amount) external limitWithdraw(amount) {
        payable(msg.sender).transfer(amount);
    }

    function getAllFunders() public view returns (address[] memory) {
        return funders;
    }

    function getFunderAtIndex(uint8 index) external view returns (address) {
        address[] memory fetchFunders = getAllFunders();

        address funder = fetchFunders[index];

        return funder;
    }
}
