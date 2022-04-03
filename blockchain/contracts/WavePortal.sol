// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    struct Wave {
        address waver;
        string text;
        string author;
        uint256 timestamp;
    }

    event NewWave(
        address indexed from,
        uint256 timestamp,
        string text,
        string author
    );

    uint256 private seed;
    uint256 wavesCounter;
    Wave[] wavesArray;

    mapping(address => uint256) public lastWavedAt;

    constructor() payable {
        console.log("HELLO");
        seed = (block.timestamp + block.difficulty) % 100;
    }

    function addWaveHandler(string memory _text, string memory _author) public {
        require(
            lastWavedAt[msg.sender] + 15 minutes < block.timestamp,
            "Wait 15m"
        );

        lastWavedAt[msg.sender] = block.timestamp;
        wavesArray.push(Wave(msg.sender, _text, _author, block.timestamp));
        wavesCounter += 1;

        seed = (block.difficulty + block.timestamp + seed) % 100;

        console.log("Random # generated: %d", seed);

        if (seed <= 50) {
            uint256 prizeAmount = 0.0001 ether;
            require(
                prizeAmount <= address(this).balance,
                "Trying to withdraw more money than the contract has."
            );
            (bool success, ) = (msg.sender).call{value: prizeAmount}("");
            require(success, "Failed to withdraw money from contract.");
        }

        emit NewWave(msg.sender, block.timestamp, _text, _author);
    }

    function getCountWaves() public view returns (uint256) {
        return wavesCounter;
    }

    function getAllWaves() public view returns (Wave[] memory) {
        return wavesArray;
    }
}
