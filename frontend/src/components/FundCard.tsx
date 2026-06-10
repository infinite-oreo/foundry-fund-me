/**
 * [INPUT]: 依赖 useFund, useFundMeStats, useMyContribution, useContractAddress, useAccount
 * [OUTPUT]: Fund 表单组件，含金额输入、交易状态反馈
 * [POS]: components/ 的写操作入口，被 app/page.tsx 渲染
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useFund, useFundMeStats, useMyContribution, useContractAddress } from '@/hooks/useFundMe'

function getErrorMessage(err: Error): string {
  const msg = err.message
  if (msg.includes('User rejected') || msg.includes('user rejected')) return '已取消交易。'
  if (msg.includes('need to spend more') || msg.includes('MINIMUM')) return '金额低于最低要求（$5 USD）。'
  return '交易失败，请重试。'
}

export function FundCard() {
  const [amount, setAmount] = useState('')
  const contractAddress = useContractAddress()
  const { isConnected } = useAccount()
  const { fund, isPending, isConfirming, isSuccess, error, reset } = useFund()
  const { refetchBalance } = useFundMeStats()
  const { refetch: refetchContribution } = useMyContribution()

  useEffect(() => {
    if (isSuccess) {
      refetchBalance()
      refetchContribution()
      setAmount('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = parseFloat(amount)
    if (isNaN(parsed) || parsed <= 0) return
    fund(amount)
  }

  const isLoading = isPending || isConfirming
  const canSubmit =
    isConnected && !!contractAddress && !!amount && parseFloat(amount) > 0 && !isLoading

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h2 className="text-base font-semibold text-card-foreground mb-1">Fund Contract</h2>
      <p className="text-xs text-muted-foreground mb-4">发送 ETH 给合约，最低价值 $5 USD。</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-muted-foreground mb-1.5">金额 (ETH)</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              step="0.001"
              min="0"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value)
                if (error) reset()
              }}
              placeholder="0.01"
              className="flex-1 bg-background border border-input rounded-lg px-3 py-2.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
            />
            <span className="text-muted-foreground text-sm font-medium w-8">ETH</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">最低 $5 USD（按实时 ETH 汇率计算）</p>
        </div>

        <button
          type="submit"
          disabled={!canSubmit}
          className="w-full bg-primary border border-primary hover:bg-primary/80 disabled:opacity-40 text-primary-foreground font-medium py-2.5 rounded-lg text-sm transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          {isPending
            ? '等待钱包确认...'
            : isConfirming
              ? '链上确认中...'
              : 'Fund'}
        </button>
      </form>

      {isSuccess && (
        <p className="text-chart-5 text-xs mt-3 flex items-center gap-1">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-chart-5" />
          充值成功！
        </p>
      )}
      {error && (
        <p className="text-destructive text-xs mt-3">{getErrorMessage(error)}</p>
      )}
      {!isConnected && (
        <p className="text-muted-foreground text-xs mt-3">请先连接钱包。</p>
      )}
    </div>
  )
}
