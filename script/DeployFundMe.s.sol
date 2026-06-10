// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import {Script} from "forge-std/Script.sol";
import {FundMe} from "../src/FundMe.sol";
import {HelperConfig} from "./HelperConfig.s.sol";

/**
 * [INPUT]: 依赖 HelperConfig 获取网络 priceFeed 地址，依赖 FundMe 合约
 * [OUTPUT]: 对外提供 run() 返回已部署的 FundMe 实例
 * [POS]: script/ 的部署入口，被 Makefile deploy 目标和集成测试 InteractionsTest 调用
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
contract DeployFundMe is Script {
    function run() external returns (FundMe) {
        // Before startBroadcast, not real tx
        HelperConfig helperConfig = new HelperConfig();
        HelperConfig.NetworkConfig memory networkConfig = helperConfig.getActiveNetworkConfig();
        address ethUsdPriceFeed = networkConfig.priceFeed;


        //After startBroadcast, real tx

        vm.startBroadcast();
        FundMe fundMe = new FundMe(ethUsdPriceFeed);
        vm.stopBroadcast();
        return fundMe;
    }
}
