/**
 * [INPUT]: 依赖 RainbowKit ConnectButton
 * [OUTPUT]: 导航栏，含应用名称和钱包连接按钮
 * [POS]: components/ 的顶部导航，被 app/page.tsx 渲染
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">FundMe</h1>
          <p className="text-xs text-muted-foreground">Decentralized Crowdfunding</p>
        </div>
        <ConnectButton />
      </div>
    </header>
  )
}
