//SPDX-License-Identifier: MIT

//Fund
//Withdraw

pragma solidity ^0.8.18;

import {Script, console} from "forge-std/Script.sol";
import {DevOpsTools} from "foundry-devops/src/DevOpsTools.sol";
import {FundMe} from "../src/FundMe.sol";

/**
 * [INPUT]: 依赖 DevOpsTools 获取最近部署地址，依赖 FundMe 合约接口
 * [OUTPUT]: 对外提供 FundFundMe.fundFundMe(), WithdrawFundMe.withdrawFundMe() 及各自的 run()
 * [POS]: script/ 的链上交互脚本，被 Makefile fund/withdraw 目标和 InteractionsTest 集成测试调用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
contract FundFundMe is Script {
    uint256 constant SEND_VALUE = 0.01 ether;

    function fundFundMe(address mostRecentlyDeployed) public {
        vm.startBroadcast();
        _fund(mostRecentlyDeployed);
        vm.stopBroadcast();
    }

    function fundFundMe(address mostRecentlyDeployed, address broadcaster) public {
        vm.startBroadcast(broadcaster);
        _fund(mostRecentlyDeployed);
        vm.stopBroadcast();
    }

    function _fund(address mostRecentlyDeployed) internal {
        FundMe(payable(mostRecentlyDeployed)).fund{value: SEND_VALUE}();
        console.log("Funded FundMe with %s", SEND_VALUE);
    }

    function run() external {
        address mostRecentlyDeployed = DevOpsTools.get_most_recent_deployment("FundMe", block.chainid);
        fundFundMe(mostRecentlyDeployed);
    }
}

contract WithdrawFundMe is Script {
    function withdrawFundMe(address mostRecentlyDeployed) public {
        vm.startBroadcast();
        FundMe(payable(mostRecentlyDeployed)).withdraw();
        vm.stopBroadcast();
    }

    function run() external {
        address mostRecentlyDeployed = DevOpsTools.get_most_recent_deployment("FundMe", block.chainid);
        withdrawFundMe(mostRecentlyDeployed);
    }
}
