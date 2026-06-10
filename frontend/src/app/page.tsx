import { Header } from '@/components/Header'
import { StatsPanel } from '@/components/StatsPanel'
import { FundCard } from '@/components/FundCard'
import { WithdrawCard } from '@/components/WithdrawCard'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <StatsPanel />
        <FundCard />
        <WithdrawCard />
      </main>
    </div>
  )
}
