/**
 * [INPUT]: 依赖 NEXT_PUBLIC_ANVIL_CONTRACT_ADDRESS / NEXT_PUBLIC_SEPOLIA_CONTRACT_ADDRESS 环境变量
 * [OUTPUT]: 对外提供 CONTRACT_ADDRESSES，按 chainId 映射合约地址
 * [POS]: constants/ 的地址注册表，被 useContractAddress hook 消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

import { anvil, sepolia } from 'wagmi/chains'

export const CONTRACT_ADDRESSES: Partial<Record<number, `0x${string}`>> = {
  [anvil.id]: process.env.NEXT_PUBLIC_ANVIL_CONTRACT_ADDRESS as `0x${string}` | undefined,
  [sepolia.id]: process.env.NEXT_PUBLIC_SEPOLIA_CONTRACT_ADDRESS as `0x${string}` | undefined,
}
