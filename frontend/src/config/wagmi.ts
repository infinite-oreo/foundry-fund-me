/**
 * [INPUT]: 依赖 NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID / NEXT_PUBLIC_SEPOLIA_RPC_URL 环境变量
 * [OUTPUT]: 对外提供 wagmiConfig，供 WagmiProvider 消费
 * [POS]: config/ 的 wagmi 全局配置，支持 Anvil(31337) 和 Sepolia(11155111) 两条链
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { http } from 'wagmi'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { anvil, sepolia } from 'wagmi/chains'

export const wagmiConfig = getDefaultConfig({
  appName: 'FundMe',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? 'placeholder',
  chains: [anvil, sepolia],
  // 明确指定 transport，确保 useReadContract 走正确的 RPC（wagmi 读操作走 transport，写操作走钱包 provider）
  transports: {
    [anvil.id]: http('http://127.0.0.1:8545'),
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
  },
  ssr: true,
})
