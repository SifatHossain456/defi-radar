import { getTopCoins, getTrending, fmt, fmtPrice } from '@/lib/coingecko'
import { ArrowUpRight, ArrowDownRight, Flame } from 'lucide-react'

async function MarketsTable() {
  const coins = await getTopCoins(1, 50)
  return (
    <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#1e1e1e] flex items-center justify-between">
        <h2 className="font-semibold text-sm">All Markets</h2>
        <span className="text-xs text-[#71717a]">Top 50 by market cap</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-[#71717a] text-xs border-b border-[#1e1e1e]">
              <th className="px-5 py-3 text-left font-medium">#</th>
              <th className="px-3 py-3 text-left font-medium">Name</th>
              <th className="px-3 py-3 text-right font-medium">Price</th>
              <th className="px-3 py-3 text-right font-medium">1h</th>
              <th className="px-3 py-3 text-right font-medium">24h</th>
              <th className="px-3 py-3 text-right font-medium">7d</th>
              <th className="px-3 py-3 text-right font-medium hidden lg:table-cell">Market Cap</th>
              <th className="px-3 py-3 text-right font-medium hidden xl:table-cell">Volume 24h</th>
            </tr>
          </thead>
          <tbody>
            {coins.map((coin) => {
              const p24 = coin.price_change_percentage_24h
              const p7 = coin.price_change_percentage_7d_in_currency
              const Chg = ({ v }: { v: number }) => (
                <span className={`flex items-center justify-end gap-0.5 text-xs font-medium ${v >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                  {v >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(v ?? 0).toFixed(2)}%
                </span>
              )
              return (
                <tr key={coin.id} className="border-b border-[#161616] hover:bg-[#161616] transition-colors">
                  <td className="px-5 py-3 text-[#71717a] text-sm">{coin.market_cap_rank}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <img src={coin.image} alt={coin.name} className="w-6 h-6 rounded-full flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium leading-none">{coin.name}</p>
                        <p className="text-xs text-[#71717a] uppercase mt-0.5">{coin.symbol}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right text-sm font-mono">{fmtPrice(coin.current_price)}</td>
                  <td className="px-3 py-3 text-right"><Chg v={0} /></td>
                  <td className="px-3 py-3 text-right"><Chg v={p24} /></td>
                  <td className="px-3 py-3 text-right"><Chg v={p7 ?? 0} /></td>
                  <td className="px-3 py-3 text-right text-sm text-[#a1a1aa] hidden lg:table-cell">{fmt(coin.market_cap)}</td>
                  <td className="px-3 py-3 text-right text-sm text-[#a1a1aa] hidden xl:table-cell">{fmt(coin.total_volume)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

async function TrendingCoins() {
  const trending = await getTrending()
  return (
    <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Flame className="w-4 h-4 text-orange-400" />
        <h3 className="font-semibold text-sm">Trending</h3>
      </div>
      <div className="space-y-3">
        {trending.slice(0, 7).map(({ item }, i) => {
          const chg = item.data?.price_change_percentage_24h?.usd ?? 0
          return (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-[#71717a] w-4">{i + 1}</span>
                <img src={item.thumb} alt={item.name} className="w-5 h-5 rounded-full" />
                <div>
                  <p className="text-xs font-medium">{item.name}</p>
                  <p className="text-[10px] text-[#71717a] uppercase">{item.symbol}</p>
                </div>
              </div>
              <span className={`text-xs font-medium ${chg >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                {chg >= 0 ? '+' : ''}{chg.toFixed(2)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default async function MarketsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Markets</h1>
        <p className="text-sm text-[#71717a] mt-1">Live prices — CoinGecko</p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div className="xl:col-span-3">
          <MarketsTable />
        </div>
        <div>
          <TrendingCoins />
        </div>
      </div>
    </div>
  )
}
