/**
 * [INPUT]: 依赖 useWithdraw, useFundMeStats, useMyContribution, useContractAddress, useAccount
 * [OUTPUT]: Withdraw 操作卡片，仅对 owner 可见
 * [POS]: components/ 的 owner 专属操作，被 app/page.tsx 渲染（非 owner 不渲染）
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

'use client'

import { useEffect } from 'react'
import { formatEther } from 'viem'
import { useAccount } from 'wagmi'
import { useWithdraw, useFundMeStats, useMyContribution, useContractAddress } from '@/hooks/useFundMe'

export function WithdrawCard() {
  const contractAddress = useContractAddress()
  const { address, isConnected } = useAccount()
  const { owner, balance, refetchBalance } = useFundMeStats()
  const { refetch: refetchContribution } = useMyContribution()
  const { withdraw, isPending, isConfirming, isSuccess, error, reset } = useWithdraw()

  const isOwner =
    isConnected && !!owner && !!address && owner.toLowerCase() === address.toLowerCase()

  useEffect(() => {
    if (isSuccess) {
      refetchBalance()
      refetchContribution()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  if (!contractAddress || !isConnected || !isOwner) return null

  const isLoading = isPending || isConfirming
  const isEmpty = !balance || balance.value === 0n
  const balanceDisplay = balance ? `${Number(formatEther(balance.value)).toFixed(4)} ETH` : '—'

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-base font-semibold text-card-foreground">Withdraw</h2>
        <span className="text-xs bg-accent text-accent-foreground border border-border px-2 py-0.5 rounded-full font-medium">
          Owner only
        </span>
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        当前可提取：<span className="text-card-foreground font-medium">{balanceDisplay}</span>
      </p>

      <button
        onClick={() => {
          reset()
          withdraw()
        }}
        disabled={isLoading || isEmpty}
        className="w-full bg-primary border border-primary hover:bg-primary/80 disabled:opacity-40 text-primary-foreground font-medium py-2.5 rounded-lg text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
      >
        {isPending
          ? '等待钱包确认...'
          : isConfirming
            ? '链上确认中...'
            : isEmpty
              ? '余额为零'
              : `提取 ${balanceDisplay}`}
      </button>

      {isSuccess && (
        <p className="text-chart-5 text-xs mt-3 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-chart-5" />
          提取成功！
        </p>
      )}
      {error && (
        <p className="text-destructive text-xs mt-3">交易失败，请重试。</p>
      )}
    </div>
  )
}
