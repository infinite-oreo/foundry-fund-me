/**
 * [INPUT]: 依赖 useFundMeStats, useMyContribution, useContractAddress, useAccount
 * [OUTPUT]: 展示 4 个合约统计卡片（余额、最低金额、Owner、我的贡献）
 * [POS]: components/ 的数据展示层，被 app/page.tsx 渲染在顶部
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

'use client'

import { formatEther } from 'viem'
import { useAccount } from 'wagmi'
import { useFundMeStats, useMyContribution, useContractAddress } from '@/hooks/useFundMe'

function StatCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
      <p className="text-lg font-semibold text-card-foreground mt-1 truncate">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
    </div>
  )
}

export function StatsPanel() {
  const contractAddress = useContractAddress()
  const { owner, minimumUsd, balance } = useFundMeStats()
  const { contribution } = useMyContribution()
  const { isConnected, address } = useAccount()

  if (!contractAddress) {
    return (
      <div className="bg-card border border-border rounded-xl p-4 text-sm text-muted-foreground">
        合约地址未配置。复制 .env.local.example 为 .env.local 并填写{' '}
        <code className="text-foreground">NEXT_PUBLIC_ANVIL_CONTRACT_ADDRESS</code>。
      </div>
    )
  }

  const balanceDisplay = balance
    ? `${Number(formatEther(balance.value)).toFixed(4)} ETH`
    : '—'

  const minUsdDisplay = minimumUsd
    ? `$${Number(formatEther(minimumUsd)).toFixed(0)} USD`
    : '—'

  const ownerDisplay = owner
    ? `${owner.slice(0, 6)}…${owner.slice(-4)}`
    : '—'

  const ownerSub =
    owner && address && owner.toLowerCase() === address.toLowerCase() ? '(you)' : undefined

  const contributionDisplay = contribution
    ? `${Number(formatEther(contribution)).toFixed(4)} ETH`
    : '0.0000 ETH'

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatCard label="Contract Balance" value={balanceDisplay} />
      <StatCard label="Minimum" value={minUsdDisplay} />
      <StatCard label="Owner" value={ownerDisplay} sub={ownerSub} />
      <StatCard
        label="Your Contribution"
        value={isConnected ? contributionDisplay : '—'}
        sub={isConnected ? undefined : 'Connect wallet'}
      />
    </div>
  )
}
