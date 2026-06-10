# Foundry Fund Me

ETH 众筹合约 + Next.js 前端全栈项目。合约基于 Foundry 构建，通过 Chainlink Price Feed 将最低捐款额锚定至 USD，仅 owner 可提款。前端使用 wagmi v2 + RainbowKit + Tailwind CSS。

## 架构

```
src/
  FundMe.sol          - 主合约：fund / withdraw / cheaperWithdraw
  PriceConverter.sol  - 库：调用 Chainlink 将 ETH 换算为 USD
script/
  DeployFundMe.s.sol  - 部署脚本，自动选择对应网络的 priceFeed
  HelperConfig.s.sol  - 网络配置（chainId → priceFeed 地址）
  Interactions.s.sol  - fund / withdraw 交互脚本
test/
  unit/               - 单元测试（FundMeTest, ZkSyncDevOps）
  integration/        - 集成测试（脚本端到端验证）
  mocks/              - MockV3Aggregator（本地测试用）
frontend/             - Next.js 前端（wagmi v2 + RainbowKit + Tailwind）
  ├── src/components/   - Header, StatsPanel, FundCard, WithdrawCard, FundersLeaderboard
  ├── src/hooks/        - useFundMe（合约读写逻辑聚合层）
  ├── src/utils/        - explorer.ts（链浏览器 URL 工具）
  └── src/constants/    - ABI, 合约地址
lib/                  - 依赖（chainlink-brownie-contracts, foundry-devops, forge-std）
```

## 网络支持

| 网络 | priceFeed | 部署命令 |
|------|-----------|----------|
| Anvil (本地) | MockV3Aggregator（自动部署） | `make deploy` |
| Sepolia | 0x694AA1769357215DE4FAC081bf1f309aDC325306 | `make deploy-sepolia` |
| Mainnet | 0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419 | — |
| zkSync local | MockV3Aggregator | `make deploy-zk` |
| zkSync Sepolia | 0xfEefF7c3fB57d18C5C6Cdd71e45D2D0b4F9377bF | `make deploy-zk-sepolia` |

## Requirements

- [Foundry](https://getfoundry.sh/)（`forge`, `anvil`）
- Node.js 18+（前端 + `zk-anvil`）
- `.env` 文件（仅部署至测试网/主网时需要）

## 快速开始

### 安装依赖

```bash
make install       # 安装 Foundry 依赖
cd frontend && npm install   # 安装前端依赖
```

### 构建 & 测试

```bash
forge build
forge test

# 仅跑集成测试
forge test --match-path test/integration/*
```

### 本地全栈开发

```bash
# 终端 1：启动本地链
anvil

# 终端 2：部署合约
make deploy

# 终端 3：启动前端
cd frontend && npm run dev
```

前端默认访问 `http://localhost:3000`，连接本地 Anvil 节点。

部署合约后，将输出的合约地址填入 `frontend/.env.local`：

```env
NEXT_PUBLIC_ANVIL_CONTRACT_ADDRESS=0x...  # make deploy 输出的地址
```

### 前端功能

| 功能 | 说明 |
|------|------|
| StatsPanel | 合约余额、最低金额、Owner、我的贡献（实时轮询） |
| FundCard | ETH 捐款表单，含交易确认状态 |
| WithdrawCard | Owner 一键提取（非 owner 不可见） |
| FundersLeaderboard | 捐款人排行榜，按金额降序，高亮当前用户 |
| Etherscan 链接 | 交易成功后显示可点击的区块浏览器链接（Sepolia/Mainnet） |

### fund / withdraw（本地）

```bash
make fund
make withdraw
```

> `make fund` / `make withdraw` 需要 `SENDER_ADDRESS`，Makefile 中默认使用 Anvil 账户 #0。

## 部署至 Sepolia

创建 `.env` 文件（不提交）：

```env
SEPOLIA_RPC_URL=...
ACCOUNT=default
ETHERSCAN_API_KEY=...
```

```bash
make deploy-sepolia ARGS="--network sepolia"
```

## zkSync

```bash
make zkbuild           # 编译
make zktest            # 测试
make zk-anvil          # 启动本地 zkSync 节点
make deploy-zk         # 部署至本地 zkSync
make deploy-zk-sepolia # 部署至 zkSync Sepolia（需 ZKSYNC_SEPOLIA_RPC_URL）
```

## Makefile 主要目标

| 目标 | 说明 |
|------|------|
| `make build` | forge build |
| `make test` | forge test |
| `make deploy` | 部署至本地 Anvil |
| `make deploy-sepolia` | 部署至 Sepolia |
| `make fund` | 调用 fund 脚本 |
| `make withdraw` | 调用 withdraw 脚本 |
| `make anvil` | 启动 Anvil |
| `make zk-anvil` | 启动本地 zkSync 节点 |
| `make format` | forge fmt |
| `make snapshot` | gas snapshot |
