// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Test} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {FundMe} from "../../src/FundMe.sol";
import {HelperConfig} from "../../script/HelperConfig.s.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import {DeployFundMe} from "../../script/DeployFundMe.s.sol";
import {FundFundMe, WithdrawFundMe} from "../../script/Interactions.s.sol";

/**
 * [INPUT]: 依赖 DeployFundMe 脚本，依赖 FundFundMe/WithdrawFundMe 交互脚本
 * [OUTPUT]: 集成测试套件，验证 部署→fund→withdraw 完整链路
 * [POS]: test/integration/ 的端到端验证，通过 DeployFundMe 部署合约（owner = DEFAULT_SENDER）
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
contract InteractionsTest is Test {
    FundMe fundMe;
    HelperConfig helperConfig;
    uint256 constant SEND_VALUE = 10e18;
    uint256 constant STARTING_BALANCE = 100e18;
    uint256 constant GAS_PRICE = 1;

    address USER = makeAddr("user");

    function setUp() external {
        DeployFundMe deploy = new DeployFundMe();
        fundMe = deploy.run();
        vm.deal(USER, STARTING_BALANCE);
    }

    function testUserCanFundInteractions() public {
        FundFundMe fundFundMe = new FundFundMe();
        fundFundMe.fundFundMe(address(fundMe));

        WithdrawFundMe withdrawFundMe = new WithdrawFundMe();
        withdrawFundMe.withdrawFundMe(address(fundMe));

        assert(address(fundMe).balance == 0);
    }
}
