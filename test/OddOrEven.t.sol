// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "hardhat/console.sol";
import "../contracts/OddOrEven.sol";

contract OddOrEvenTest {
    OddOrEven public oddOrEven;

    constructor() {
        oddOrEven = new OddOrEven();
    }

    function assert_(bool condition, string memory failMsg) internal pure {
        if (!condition) revert(failMsg);
    }

    function testIsEven_Zero() public view {
        bool result = oddOrEven.isEven(0);
        assert_(result == true, "0 deve ser par");
    }

    function testIsEven_Two() public view {
        bool result = oddOrEven.isEven(2);
        assert_(result == true, "2 deve ser par");
    }

    function testIsOdd_One() public view {
        bool result = oddOrEven.isOdd(1);
        assert_(result == true, "1 deve ser impar");
    }

    function testIsOdd_Three() public view {
        bool result = oddOrEven.isOdd(3);
        assert_(result == true, "3 deve ser impar");
    }

    function testBitwiseConsistency() public view {
        for (uint256 i = 0; i < 20; i++) {
            bool even = oddOrEven.isEven(i);
            bool odd = oddOrEven.isOdd(i);
            assert_(even != odd, "isEven e isOdd devem ser opostos");
        }
    }

    function testOwnerIsDeployer() public view {
        address contractOwner = oddOrEven.owner();
        assert_(contractOwner == address(this), "Owner deve ser o deployer");
    }

    function testTotalChecksIncrement() public {
        uint256 beforeCount = oddOrEven.totalChecks();
        oddOrEven.checkNumber(42);
        uint256 afterCount = oddOrEven.totalChecks();
        assert_(afterCount == beforeCount + 1, "totalChecks deve incrementar");
    }

    function testEIP155_V_Calculation() public pure {
        uint256 chainId = 1;
        uint256 recId0 = 0;
        uint256 recId1 = 1;

        uint256 v0 = recId0 + (chainId * 2) + 35;
        uint256 v1 = recId1 + (chainId * 2) + 35;

        require(v0 != 27 && v0 != 28, "v0 nao pode ser 27 ou 28");
        require(v1 != 27 && v1 != 28, "v1 nao pode ser 27 ou 28");
        require(v0 == 37, "v0 deve ser 37 para chainId=1");
        require(v1 == 38, "v1 deve ser 38 para chainId=1");
    }
}
