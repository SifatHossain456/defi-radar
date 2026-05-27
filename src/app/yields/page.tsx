import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Yield Farming',
  description: 'Top DeFi yield opportunities ranked by APY — live pool data from DefiLlama.',
}

import { getTopYields, fmtTVL } from '@/lib/defillama'
import { Zap, Shield } from 'lucide-react'

async function YieldsTable() {
  const pools = await getTopYields(40)
  return (
    <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#1e1e1e] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[#00d4ff]" />
          <h2 className="font-semibold text-sm">Top Yield Opportunities</h2>
        </div>
        <span className="text-xs text-[#71717a]">Min $100K TVL · Max 1000% APY · Live</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-[#71717a] text-xs border-b border-[#1e1e1e]">
              <th className="px-5 py-3 text-left font-medium">#</th>
              <th className="px-3 py-3 text-left font-medium">Pool</th>
              <th className="px-3 py-3 text-left font-medium hidden md:table-cell">Protocol</th>
              <th className="px-3 py-3 text-left font-medium hidden lg:table-cell">Chain</th>
              <th className="px-3 py-3 text-right font-medium">APY</th>
              <th className="px-3 py-3 text-right font-medium hidden md:table-cell">Base APY</th>
              <th className="px-3 py-3 text-right font-medium hidden md:table-cell">Reward APY</th>
              <th className="px-3 py-3 text-right font-medium">TVL</th>
              <th className="px-3 py-3 text-center font-medium hidden lg:table-cell">Stable</th>
            </tr>
          </thead>
          <tbody>
            {pools.map((pool, i) => {
              const apyColor = pool.apy > 50 ? '#f59e0b' : pool.apy > 20 ? '#22c55e' : '#a1a1aa'
              return (
                <tr key={pool.pool} className="border-b border-[#161616] hover:bg-[#161616] transition-colors">
                  <td className="px-5 py-3 text-[#71717a] text-sm">{i + 1}</td>
                  <td className="px-3 py-3">
                    <p className="text-sm font-medium">{pool.symbol}</p>
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell">
                    <span className="text-xs px-2 py-0.5 bg-[#1e1e1e] rounded-full text-[#a1a1aa]">{pool.project}</span>
                  </td>
                  <td className="px-3 py-3 text-sm text-[#a1a1aa] hidden lg:table-cell">{pool.chain}</td>
                  <td className="px-3 py-3 text-right">
                    <span className="text-sm font-bold font-mono" style={{ color: apyColor }}>
                      {pool.apy.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right text-sm text-[#a1a1aa] font-mono hidden md:table-cell">
                    {pool.apyBase != null ? `${pool.apyBase.toFixed(2)}%` : '—'}
                  </td>
                  <td className="px-3 py-3 text-right text-sm font-mono hidden md:table-cell">
                    {pool.apyReward != null && pool.apyReward > 0 ? (
                      <span className="text-[#22c55e]">{pool.apyReward.toFixed(2)}%</span>
                    ) : '—'}
                  </td>
                  <td className="px-3 py-3 text-right text-sm text-[#a1a1aa] font-mono">{fmtTVL(pool.tvlUsd)}</td>
                  <td className="px-3 py-3 text-center hidden lg:table-cell">
                    {pool.stablecoin ? (
                      <div className="flex justify-center">
                        <Shield className="w-3.5 h-3.5 text-[#22c55e]" />
                      </div>
                    ) : (
                      <span className="text-[#3a3a3a] text-xs">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default async function YieldsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Yields</h1>
        <p className="text-sm text-[#71717a] mt-1">Best DeFi yield opportunities — live from DeFiLlama</p>
      </div>
      <YieldsTable />
    </div>
  )
}
