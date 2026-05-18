import { getTopProtocols, getChainTVLs, fmtTVL } from '@/lib/defillama'
import { ArrowUpRight, ArrowDownRight, ExternalLink } from 'lucide-react'

async function ProtocolsTable() {
  const protocols = await getTopProtocols(50)
  return (
    <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#1e1e1e] flex items-center justify-between">
        <h2 className="font-semibold text-sm">DeFi Protocols by TVL</h2>
        <span className="text-xs text-[#71717a]">Live — DeFiLlama</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-[#71717a] text-xs border-b border-[#1e1e1e]">
              <th className="px-5 py-3 text-left font-medium">#</th>
              <th className="px-3 py-3 text-left font-medium">Protocol</th>
              <th className="px-3 py-3 text-left font-medium hidden md:table-cell">Category</th>
              <th className="px-3 py-3 text-right font-medium">TVL</th>
              <th className="px-3 py-3 text-right font-medium">24h</th>
              <th className="px-3 py-3 text-right font-medium hidden lg:table-cell">7d</th>
              <th className="px-3 py-3 text-left font-medium hidden xl:table-cell">Chains</th>
            </tr>
          </thead>
          <tbody>
            {protocols.map((p, i) => {
              const c1 = p.change_1d ?? 0
              const c7 = p.change_7d ?? 0
              const Chg = ({ v }: { v: number }) => (
                <span className={`flex items-center justify-end gap-0.5 text-xs font-medium ${v >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                  {v >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {Math.abs(v).toFixed(2)}%
                </span>
              )
              return (
                <tr key={p.id ?? p.name} className="border-b border-[#161616] hover:bg-[#161616] transition-colors">
                  <td className="px-5 py-3 text-[#71717a] text-sm">{i + 1}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      {p.logo ? (
                        <img
                          src={p.logo}
                          alt={p.name}
                          className="w-6 h-6 rounded-full bg-[#1e1e1e] flex-shrink-0"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-[#1e1e1e] flex-shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center gap-1">
                          <p className="text-sm font-medium leading-none">{p.name}</p>
                          {p.url && (
                            <a href={p.url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3 text-[#71717a] hover:text-[#00d4ff]" />
                            </a>
                          )}
                        </div>
                        <p className="text-xs text-[#71717a] uppercase mt-0.5">{p.symbol ?? '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell">
                    <span className="text-xs px-2 py-0.5 bg-[#1e1e1e] rounded-full text-[#a1a1aa]">{p.category ?? '—'}</span>
                  </td>
                  <td className="px-3 py-3 text-right text-sm font-mono font-semibold">{fmtTVL(p.tvl)}</td>
                  <td className="px-3 py-3 text-right"><Chg v={c1} /></td>
                  <td className="px-3 py-3 text-right hidden lg:table-cell"><Chg v={c7} /></td>
                  <td className="px-3 py-3 hidden xl:table-cell">
                    <div className="flex gap-1 flex-wrap max-w-32">
                      {(p.chains ?? []).slice(0, 3).map((chain: string) => (
                        <span key={chain} className="text-[10px] px-1.5 py-0.5 bg-[#1e1e1e] rounded text-[#71717a]">{chain}</span>
                      ))}
                      {(p.chains ?? []).length > 3 && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-[#1e1e1e] rounded text-[#71717a]">+{(p.chains ?? []).length - 3}</span>
                      )}
                    </div>
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

async function ChainBreakdown() {
  const chains = await getChainTVLs()
  const total = chains.reduce((s: number, c: { tvl: number }) => s + c.tvl, 0)
  return (
    <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5 mb-4">
      <h3 className="font-semibold text-sm mb-4">TVL by Chain</h3>
      <div className="space-y-3">
        {chains.slice(0, 10).map((chain: { name: string; tvl: number }, i: number) => {
          const pct = (chain.tvl / total) * 100
          const colors = ['#00d4ff', '#7c3aed', '#F7931A', '#627EEA', '#8247E5', '#28A0F0', '#22c55e', '#FF0420', '#F0B90B', '#0052FF']
          return (
            <div key={chain.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#a1a1aa]">{chain.name}</span>
                <div className="flex gap-3">
                  <span className="text-[#71717a]">{pct.toFixed(1)}%</span>
                  <span className="font-mono">{fmtTVL(chain.tvl)}</span>
                </div>
              </div>
              <div className="h-1.5 bg-[#1e1e1e] rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: colors[i] ?? '#374151' }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default async function ProtocolsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Protocols</h1>
        <p className="text-sm text-[#71717a] mt-1">DeFi protocol TVL — live from DeFiLlama</p>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        <div className="xl:col-span-3">
          <ProtocolsTable />
        </div>
        <div>
          <ChainBreakdown />
        </div>
      </div>
    </div>
  )
}
