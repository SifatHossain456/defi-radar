const BASE = 'https://api.llama.fi'

export interface Protocol {
  id: string
  name: string
  slug: string
  tvl: number
  chainTvls: Record<string, number>
  change_1d: number
  change_7d: number
  mcap: number
  category: string
  chains: string[]
  logo: string
  url: string
  description: string
  symbol: string
}

export interface YieldPool {
  pool: string
  chain: string
  project: string
  symbol: string
  tvlUsd: number
  apy: number
  apyBase: number
  apyReward: number
  stablecoin: boolean
}

export async function getTopProtocols(limit = 50): Promise<Protocol[]> {
  const res = await fetch(`${BASE}/protocols`, { cache: 'no-store' })
  if (!res.ok) throw new Error('DeFiLlama protocols error')
  const data: Protocol[] = await res.json()
  return data
    .filter((p) => p.tvl > 0)
    .sort((a, b) => b.tvl - a.tvl)
    .slice(0, limit)
}

export async function getTotalTVL() {
  const res = await fetch(`${BASE}/v2/historicalChainTvl`, { cache: 'no-store' })
  if (!res.ok) throw new Error('DeFiLlama TVL error')
  return res.json()
}

export async function getChainTVLs() {
  const res = await fetch(`${BASE}/v2/chains`, { cache: 'no-store' })
  if (!res.ok) throw new Error('DeFiLlama chains error')
  const data = await res.json()
  return data.sort((a: { tvl: number }, b: { tvl: number }) => b.tvl - a.tvl).slice(0, 15)
}

export async function getTopYields(limit = 30): Promise<YieldPool[]> {
  const res = await fetch('https://yields.llama.fi/pools', { cache: 'no-store' })
  if (!res.ok) throw new Error('DeFiLlama yields error')
  const data = await res.json()
  return (data.data as YieldPool[])
    .filter((p) => p.tvlUsd > 100_000 && p.apy > 0 && p.apy < 1000)
    .sort((a, b) => b.apy - a.apy)
    .slice(0, limit)
}

export function fmtTVL(n: number): string {
  if (!n && n !== 0) return 'N/A'
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`
  return `$${n.toFixed(2)}`
}
