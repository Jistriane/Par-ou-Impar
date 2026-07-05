// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/**
 * @title OddOrEven
 * @notice Smart contract que verifica se um numero e par ou impar
 * @dev Demonstra uso de eventos, modificadores e funcoes puras/view
 */
contract OddOrEven {
    address public owner;
    uint256 public totalChecks;
    mapping(address => uint256) public userChecks;

    event NumberChecked(
        address indexed caller,
        uint256 indexed number,
        bool isEven,
        string result
    );

    event OwnerChanged(address indexed oldOwner, address indexed newOwner);

    error NotOwner(address caller);
    error ZeroAddressNotAllowed();

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NotOwner(msg.sender);
        }
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function checkNumber(uint256 number)
        external
        returns (bool evenResult, string memory result)
    {
        evenResult = (number & 1) == 0;
        result = evenResult ? "Even" : "Odd";

        totalChecks++;
        userChecks[msg.sender]++;

        emit NumberChecked(msg.sender, number, evenResult, result);
    }

    function isEven(uint256 number) external pure returns (bool) {
        return (number & 1) == 0;
    }

    function isOdd(uint256 number) external pure returns (bool) {
        return (number & 1) == 1;
    }

    function getUserChecks(address user) external view returns (uint256) {
        return userChecks[user];
    }

    function recoverSigner(
        bytes32 messageHash,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external pure returns (address signer) {
        signer = ecrecover(messageHash, v, r, s);
    }

    function getEthSignedMessageHash(bytes memory message)
        external
        pure
        returns (bytes32)
    {
        return keccak256(
            abi.encodePacked(
                "\x19Ethereum Signed Message:\n",
                uintToStr(message.length),
                message
            )
        );
    }

    function transferOwnership(address newOwner) external onlyOwner {
        if (newOwner == address(0)) revert ZeroAddressNotAllowed();
        emit OwnerChanged(owner, newOwner);
        owner = newOwner;
    }

    function uintToStr(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";

        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }

        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits--;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }

        return string(buffer);
    }
}
