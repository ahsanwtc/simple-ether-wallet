// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

contract SimpleEtherWallet {
  address public owner;
  constructor() {
      owner = msg.sender;
  }

  receive() external payable {}
    
  function send(address payable to, uint amount) public {
    require(owner == msg.sender, "sender is not allowed");
    to.transfer(amount);
  }

  function balanceOf() public view returns(uint) {
    return address(this).balance;
  }
}
