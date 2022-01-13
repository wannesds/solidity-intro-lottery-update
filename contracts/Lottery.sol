// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Lottery {
    address public manager;
    address [] public players;
    
    constructor() {
        manager = msg.sender;
    }
    
    function enter() public payable {
        require(msg.value > .01 ether);
        
        players.push(msg.sender);
    }
    
    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }
    
    using address_make_payable for address;
    function pickWinner() public restricted payable{
        uint index = random() % players.length;
        address payable winner = address(players[index]).make_payable();
        payable(winner).transfer(address(this).balance);
        players = new address[](0);
    }
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    function getPlayers() public view returns (address[] memory){
        return players;
    }

}

library address_make_payable {
    function make_payable(address x) internal pure returns (address payable){
        return address(uint160(x));
    }
}