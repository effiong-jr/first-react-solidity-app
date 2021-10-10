// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Owned {
    address public isOwner;

    constructor() {
        isOwner = msg.sender;
    }

    modifier checkIsOwner() {
        require(isOwner == msg.sender, "Only owner can call this function.");
        _;
    }
}
