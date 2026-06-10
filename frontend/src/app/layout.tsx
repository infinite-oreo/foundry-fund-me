import type { Metadata } from 'next'
import { Poppins, Roboto_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from '@/providers'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'FundMe',
  description: '基于 Chainlink 价格预言机的去中心化众筹合约',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${robotoMono.variable} font-sans bg-background text-foreground antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
