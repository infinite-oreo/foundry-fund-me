/**
 * [INPUT]: chainId (number), tx hash (string)
 * [OUTPUT]: 对外提供 getExplorerTxUrl，返回区块浏览器 tx URL 或 null（本地链）
 * [POS]: utils/ 的链信息工具，被 FundCard 和 WithdrawCard 消费
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

const TX_BASE: Record<number, string> = {
  1: 'https://etherscan.io/tx/',
  11155111: 'https://sepolia.etherscan.io/tx/',
}

export function getExplorerTxUrl(chainId: number, hash: string): string | null {
  const base = TX_BASE[chainId]
  return base ? `${base}${hash}` : null
}
