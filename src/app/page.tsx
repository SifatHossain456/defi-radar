import { Suspense } from 'react'
import { getGlobalData, getTopCoins, fmt, fmtPrice } from '@/lib/coingecko'
import { getChainTVLs, fmtTVL } from '@/lib/defillama'
import StatCard from '@/components/StatCard'
import WalletPortfolio from '@/components/WalletPortfolio'
import GasTracker from '@/components/GasTracker'
import { TrendingUp, Globe, BarChart2, Layers, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import Link from 'next/link'

async function GlobalStats() {
  const [global, coins] = await Promise.all([getGlobalData(), getTopCoins(1, 5)])
  const btc = coins.find((c) => c.id === 'bitcoin')
  const eth = coins.find((c) => c.id === 'ethereum')

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        label="Total Market Cap"
        value={fmt(global.total_market_cap?.usd ?? 0)}
        change={global.market_cap_change_percentage_24h_usd}
        icon={Globe}
        accent="#00d4ff"
      />
      <StatCard
        label="Bitcoin (BTC)"
        value={fmtPrice(btc?.current_price ?? 0)}
        change={btc?.price_change_percentage_24h}
        icon={TrendingUp}
        accent="#F7931A"
      />
      <StatCard
        label="Ethereum (ETH)"
        value={fmtPrice(eth?.current_price ?? 0)}
        change={eth?.price_change_percentage_24h}
        icon={BarChart2}
        accent="#627EEA"
      />
      <StatCard
        label="24h Volume"
        value={fmt(global.total_volume?.usd ?? 0)}
        icon={Layers}
        accent="#7c3aed"
      />
    </div>
  )
}

async function TopCoinsTable() {
  const coins = await getTopCoins(1, 8)
  return (
    <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e1e1e]">
        <h2 className="font-semibold text-sm">Top Coins</h2>
        <Link href="/markets" className="text-xs text-[#00d4ff] hover:underline">View all →</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full" aria-label="Top coins by market cap">
          <thead>
            <tr className="text-[#71717a] text-xs border-b border-[#1e1e1e]">
              <th className="px-5 py-3 text-left font-medium">#</th>
              <th className="px-3 py-3 text-left font-medium">Name</th>
              <th className="px-3 py-3 text-right font-medium">Price</th>
              <th className="px-3 py-3 text-right font-medium">24h</th>
              <th className="px-3 py-3 text-right font-medium hidden lg:table-cell">Market Cap</th>
              <th className="px-3 py-3 text-right font-medium hidden xl:table-cell">Volume 24h</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => {
              const pos = coin.price_change_percentage_24h >= 0
              return (
                <tr key={coin.id} className="border-b border-[#1a1a1a] hover:bg-[#161616] transition-colors">
                  <td className="px-5 py-3.5 text-[#71717a] text-sm">{coin.market_cap_rank}</td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full" />
                      <div>
                        <p className="text-sm font-medium leading-none">{coin.name}</p>
                        <p className="text-xs text-[#71717a] uppercase mt-0.5">{coin.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5 text-right text-sm font-mono">{fmtPrice(coin.current_price)}</td>
                  <td className="px-3 py-3.5 text-right">
                    <span className={`flex items-center justify-end gap-0.5 text-xs font-medium ${pos ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                      {pos ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-3 py-3.5 text-right text-sm text-[#a1a1aa] hidden lg:table-cell">{fmt(coin.market_cap)}</td>
                  <td className="px-3 py-3.5 text-right text-sm text-[#a1a1aa] hidden xl:table-cell">{fmt(coin.total_volume)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

async function ChainTVLs() {
  const chains = await getChainTVLs()
  return (
    <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">Chain TVL</h3>
        <Link href="/protocols" className="text-xs text-[#00d4ff] hover:underline">Protocols →</Link>
      </div>
      <div className="space-y-3">
        {(() => {
          const PALETTE = ['#00d4ff', '#7c3aed', '#22c55e', '#f97316', '#f59e0b', '#ec4899', '#6366f1']
          const maxTVL = chains[0]?.tvl ?? 1
          return chains.slice(0, 7).map((chain: { name: string; tvl: number }, i: number) => {
            const pct = (chain.tvl / maxTVL) * 100
            return (
              <div key={chain.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#a1a1aa]">{chain.name}</span>
                  <span className="font-mono">{fmtTVL(chain.tvl)}</span>
                </div>
                <div className="h-1.5 bg-[#1e1e1e] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: PALETTE[i % PALETTE.length] }} />
                </div>
              </div>
            )
          })
        })()}
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5 animate-pulse">
      <div className="h-3 bg-[#1e1e1e] rounded w-24 mb-4" />
      <div className="h-7 bg-[#1e1e1e] rounded w-32 mb-2" />
      <div className="h-3 bg-[#1e1e1e] rounded w-16" />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-sm text-[#71717a] mt-1">Real-time DeFi market intelligence</p>
      </div>

      <Suspense fallback={
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      }>
        <GlobalStats />
      </Suspense>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          <Suspense fallback={
            <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5 animate-pulse h-72" />
          }>
            <TopCoinsTable />
          </Suspense>
        </div>

        <div className="space-y-4">
          <WalletPortfolio />
          <Suspense fallback={
            <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5 animate-pulse h-48" />
          }>
            <ChainTVLs />
          </Suspense>
          <GasTracker />
        </div>
      </div>
    </div>
  )
}
