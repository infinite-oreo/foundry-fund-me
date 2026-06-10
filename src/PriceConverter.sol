// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/**
 * [INPUT]: 依赖 Chainlink AggregatorV3Interface 的 latestRoundData
 * [OUTPUT]: 对外提供 getPrice(priceFeed), getConversionRate(ethAmount, priceFeed)
 * [POS]: src/ 的价格工具库，被 FundMe 以 `using PriceConverter for uint256` 形式消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */
library PriceConverter {
    // We could make this public, but then we'd have to deploy it
    function getPrice(AggregatorV3Interface priceFeed) internal view returns (uint256) {
        // Sepolia ETH / USD Address
        // https://docs.chain.link/data-feeds/price-feeds/addresses
        (, int256 answer, , , ) = priceFeed.latestRoundData();
        // ETH/USD 价格不可能为负，显式断言消除强转歧义
        require(answer > 0, "Invalid price");
        return uint256(answer) * 1e10;
    }

    // 1000000000
    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 ethPrice = getPrice(priceFeed);
        uint256 ethAmountInUsd = (ethPrice * ethAmount) / 1000000000000000000;
        // the actual ETH/USD conversion rate, after adjusting the extra 0s.
        return ethAmountInUsd;
    }
}