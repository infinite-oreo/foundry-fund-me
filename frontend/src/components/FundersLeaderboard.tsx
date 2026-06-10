/**
 * [INPUT]: 依赖 useFundersList, useContractAddress, useAccount
 * [OUTPUT]: 捐款人排行榜，按金额降序排列，高亮当前用户
 * [POS]: components/ 的只读展示组件，被 app/page.tsx 渲染在 FundCard 下方
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

'use client'

import { formatEther } from 'viem'
import { useAccount } from 'wagmi'
import { useFundersList, useContractAddress } from '@/hooks/useFundMe'

export function FundersLeaderboard() {
  const contractAddress = useContractAddress()
  const { funders, isLoading } = useFundersList()
  const { address } = useAccount()

  if (!contractAddress) return null

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-card-foreground">Funders</h2>
        {funders.length > 0 && (
          <span className="text-xs bg-accent text-accent-foreground border border-border px-2 py-0.5 rounded-full font-medium">
            {funders.length}
          </span>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : funders.length === 0 ? (
        <p className="text-sm text-muted-foreground">No funders yet. Be the first!</p>
      ) : (
        <div className="space-y-1.5">
          {funders.map((funder, i) => {
            const isMe =
              !!address && funder.address.toLowerCase() === address.toLowerCase()
            return (
              <div
                key={funder.address}
                className={`flex items-center justify-between py-2 px-3 rounded-lg ${
                  isMe ? 'bg-accent border border-border' : 'bg-background'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs text-muted-foreground w-5 text-right shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm font-mono text-card-foreground truncate">
                    {funder.address.slice(0, 6)}…{funder.address.slice(-4)}
                    {isMe && (
                      <span className="ml-1.5 text-xs text-muted-foreground not-italic">
                        (you)
                      </span>
                    )}
                  </span>
                </div>
                <span className="text-sm font-medium text-card-foreground shrink-0 ml-4">
                  {Number(formatEther(funder.amount)).toFixed(4)} ETH
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
