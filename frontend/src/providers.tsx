/**
 * [INPUT]: 依赖 wagmiConfig、RainbowKitProvider、QueryClientProvider
 * [OUTPUT]: 对外提供 Providers 组件，包裹整个应用的 Web3 上下文
 * [POS]: src/ 的全局 Provider 根，被 app/layout.tsx 包裹 children
 * [PROTOCOL]: 变更时更新此头部，然后检查 CLAUDE.md
 */

'use client'

import '@rainbow-me/rainbowkit/styles.css'
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { useState } from 'react'
import { wagmiConfig } from '@/config/wagmi'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={lightTheme({
          accentColor: 'rgb(201, 100, 66)',
          accentColorForeground: 'white',
          borderRadius: 'medium',
        })}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
