'use client'

import { useState } from 'react'
import { Search, AlertTriangle, CheckCircle, XCircle, ExternalLink, TrendingUp, TrendingDown } from 'lucide-react'
import { fmtPrice, fmt } from '@/lib/coingecko'

interface CoinData {
  id: string
  name: string
  symbol: string
  image: { large: string }
  market_data: {
    current_price: { usd: number }
    market_cap: { usd: number }
    total_volume: { usd: number }
    circulating_supply: number
    total_supply: number
    max_supply: number
    price_change_percentage_24h: number
    price_change_percentage_7d: number
    price_change_percentage_30d: number
    ath: { usd: number }
    ath_change_percentage: { usd: number }
    atl: { usd: number }
  }
  market_cap_rank: number
  genesis_date: string
  hashing_algorithm: string | null
  links: {
    homepage: string[]
    blockchain_site: string[]
    repos_url: { github: string[] }
    twitter_screen_name: string
    telegram_channel_identifier: string
  }
  description: { en: string }
  developer_data: {
    forks: number
    stars: number
    subscribers: number
    total_issues: number
    closed_issues: number
    commit_count_4_weeks: number
  }
  public_interest_stats: {
    alexa_rank: number
  }
  community_data: {
    twitter_followers: number
    telegram_channel_user_count: number
  }
}

function riskScore(coin: CoinData): { score: number; level: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME'; flags: string[] } {
  const flags: string[] = []
  let risk = 0

  const rank = coin.market_cap_rank ?? 999
  if (rank > 500) { risk += 30; flags.push('Low market cap rank') }
  else if (rank > 100) { risk += 15 }
  else if (rank > 50) { risk += 5 }

  const mcap = coin.market_data?.market_cap?.usd ?? 0
  if (mcap < 1_000_000) { risk += 25; flags.push('Very low market cap < $1M') }
  else if (mcap < 10_000_000) { risk += 15; flags.push('Low market cap < $10M') }
  else if (mcap < 100_000_000) { risk += 8 }

  const vol = coin.market_data?.total_volume?.usd ?? 0
  const volRatio = mcap > 0 ? vol / mcap : 0
  if (volRatio > 0.5) { risk += 15; flags.push('Unusually high volume/mcap ratio') }
  if (vol < 50_000 && mcap > 0) { risk += 20; flags.push('Very low liquidity') }

  const p30 = Math.abs(coin.market_data?.price_change_percentage_30d ?? 0)
  if (p30 > 200) { risk += 15; flags.push('Extreme 30d price volatility') }
  else if (p30 > 100) { risk += 8 }

  const athChg = coin.market_data?.ath_change_percentage?.usd ?? 0
  if (athChg < -95) { risk += 20; flags.push('Down >95% from ATH') }
  else if (athChg < -80) { risk += 10; flags.push('Down >80% from ATH') }

  if (!coin.links?.repos_url?.github?.length) { risk += 10; flags.push('No GitHub repository') }
  if (!coin.links?.homepage?.[0]) { risk += 5; flags.push('No official website') }

  const commits = coin.developer_data?.commit_count_4_weeks ?? 0
  if (commits === 0 && coin.hashing_algorithm === null) { risk += 10; flags.push('No recent developer activity') }

  const score = Math.min(100, risk)
  const level = score < 25 ? 'LOW' : score < 50 ? 'MEDIUM' : score < 75 ? 'HIGH' : 'EXTREME'
  return { score, level, flags }
}

const LEVEL_COLOR = {
  LOW: '#22c55e',
  MEDIUM: '#f59e0b',
  HIGH: '#ef4444',
  EXTREME: '#dc2626',
}

const POPULAR = [
  { id: 'bitcoin', label: 'BTC' },
  { id: 'ethereum', label: 'ETH' },
  { id: 'chainlink', label: 'LINK' },
  { id: 'uniswap', label: 'UNI' },
  { id: 'aave', label: 'AAVE' },
  { id: 'matic-network', label: 'MATIC' },
]

export default function TokenAnalyzerClient() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [coin, setCoin] = useState<CoinData | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyze = async (id: string) => {
    setLoading(true)
    setError(null)
    setCoin(null)
    try {
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true`
      )
      if (!res.ok) {
        if (res.status === 404) throw new Error(`Token "${id}" not found. Try the CoinGecko ID (e.g. "bitcoin", "ethereum", "uniswap")`)
        throw new Error('API error — try again later')
      }
      const data: CoinData = await res.json()
      setCoin(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const id = query.trim().toLowerCase().replace(/\s+/g, '-')
    if (id) analyze(id)
  }

  const risk = coin ? riskScore(coin) : null

  return (
    <div className="max-w-4xl">
      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#71717a]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter CoinGecko ID (bitcoin, ethereum, uniswap...)"
            className="w-full bg-[#111111] border border-[#1e1e1e] rounded-xl pl-9 pr-4 py-3 text-sm outline-none focus:border-[#00d4ff] transition-colors placeholder:text-[#71717a]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 bg-[#00d4ff] text-black text-sm font-semibold rounded-xl hover:bg-[#00b8d9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </form>

      <div className="flex gap-2 flex-wrap mb-6">
        {POPULAR.map((p) => (
          <button
            key={p.id}
            onClick={() => { setQuery(p.id); analyze(p.id) }}
            className="px-3 py-1.5 bg-[#1a1a1a] border border-[#1e1e1e] rounded-lg text-xs font-medium text-[#a1a1aa] hover:text-white hover:border-[#2a2a2a] transition-colors"
          >
            {p.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-[#1a0a0a] border border-[#ef4444]/30 rounded-xl p-4 flex items-start gap-3 mb-6">
          <XCircle className="w-5 h-5 text-[#ef4444] flex-shrink-0 mt-0.5" />
          <p className="text-sm text-[#ef4444]">{error}</p>
        </div>
      )}

      {coin && risk && (
        <div className="space-y-4">
          <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <img src={coin.image?.large} alt={coin.name} className="w-12 h-12 rounded-full" />
                <div>
                  <h2 className="font-bold text-lg leading-none">{coin.name}</h2>
                  <p className="text-sm text-[#71717a] uppercase mt-1">{coin.symbol} · #{coin.market_cap_rank}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold font-mono">{fmtPrice(coin.market_data?.current_price?.usd ?? 0)}</p>
                <span className={`text-sm font-medium ${(coin.market_data?.price_change_percentage_24h ?? 0) >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                  {(coin.market_data?.price_change_percentage_24h ?? 0) >= 0 ? '+' : ''}{(coin.market_data?.price_change_percentage_24h ?? 0).toFixed(2)}% (24h)
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5">
              <h3 className="font-semibold text-sm mb-4">Risk Analysis</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1e1e1e" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.9" fill="none"
                      stroke={LEVEL_COLOR[risk.level]}
                      strokeWidth="3"
                      strokeDasharray={`${risk.score} ${100 - risk.score}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-bold">{risk.score}</span>
                    <span className="text-[10px] text-[#71717a]">/100</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-[#71717a] mb-1">Risk Level</p>
                  <p className="text-xl font-bold" style={{ color: LEVEL_COLOR[risk.level] }}>{risk.level}</p>
                  <p className="text-xs text-[#71717a] mt-1">{risk.flags.length} flag{risk.flags.length !== 1 ? 's' : ''} detected</p>
                </div>
              </div>
              <div className="space-y-2">
                {risk.flags.length === 0 ? (
                  <div className="flex items-center gap-2 text-xs text-[#22c55e]">
                    <CheckCircle className="w-3.5 h-3.5" /> No risk flags detected
                  </div>
                ) : (
                  risk.flags.map((f) => (
                    <div key={f} className="flex items-start gap-2 text-xs text-[#f59e0b]">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5">
              <h3 className="font-semibold text-sm mb-4">Market Data</h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Market Cap', value: fmt(coin.market_data?.market_cap?.usd ?? 0) },
                  { label: '24h Volume', value: fmt(coin.market_data?.total_volume?.usd ?? 0) },
                  { label: 'ATH', value: fmtPrice(coin.market_data?.ath?.usd ?? 0) },
                  { label: 'ATH Change', value: `${(coin.market_data?.ath_change_percentage?.usd ?? 0).toFixed(1)}%` },
                  { label: '7d Change', value: `${(coin.market_data?.price_change_percentage_7d ?? 0).toFixed(2)}%` },
                  { label: '30d Change', value: `${(coin.market_data?.price_change_percentage_30d ?? 0).toFixed(2)}%` },
                  { label: 'Circ. Supply', value: (coin.market_data?.circulating_supply ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 }) },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-[#71717a]">{label}</span>
                    <span className="font-mono text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5">
              <h3 className="font-semibold text-sm mb-4">Price Performance</h3>
              <div className="space-y-3">
                {[
                  { label: '24h', v: coin.market_data?.price_change_percentage_24h ?? 0 },
                  { label: '7d', v: coin.market_data?.price_change_percentage_7d ?? 0 },
                  { label: '30d', v: coin.market_data?.price_change_percentage_30d ?? 0 },
                ].map(({ label, v }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-xs text-[#71717a] w-8">{label}</span>
                    <div className="flex-1 h-1.5 bg-[#1e1e1e] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(100, Math.abs(v) * 1.5)}%`,
                          background: v >= 0 ? '#22c55e' : '#ef4444',
                        }}
                      />
                    </div>
                    <span className={`text-xs font-medium w-16 text-right ${v >= 0 ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
                      {v >= 0 ? '+' : ''}{v.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5">
              <h3 className="font-semibold text-sm mb-4">Community & Dev</h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: 'Twitter', value: (coin.community_data?.twitter_followers ?? 0).toLocaleString() },
                  { label: 'Telegram', value: (coin.community_data?.telegram_channel_user_count ?? 0).toLocaleString() },
                  { label: 'GitHub Stars', value: (coin.developer_data?.stars ?? 0).toLocaleString() },
                  { label: 'GitHub Forks', value: (coin.developer_data?.forks ?? 0).toLocaleString() },
                  { label: 'Commits (4w)', value: (coin.developer_data?.commit_count_4_weeks ?? 0).toLocaleString() },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-[#71717a]">{label}</span>
                    <span className="font-mono">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5">
            <h3 className="font-semibold text-sm mb-3">Links</h3>
            <div className="flex gap-3 flex-wrap">
              {coin.links?.homepage?.[0] && (
                <a href={coin.links.homepage[0]} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs px-3 py-2 bg-[#1a1a1a] rounded-lg text-[#a1a1aa] hover:text-white transition-colors">
                  <ExternalLink className="w-3 h-3" /> Website
                </a>
              )}
              {coin.links?.repos_url?.github?.[0] && (
                <a href={coin.links.repos_url.github[0]} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs px-3 py-2 bg-[#1a1a1a] rounded-lg text-[#a1a1aa] hover:text-white transition-colors">
                  <ExternalLink className="w-3 h-3" /> GitHub
                </a>
              )}
              {coin.links?.twitter_screen_name && (
                <a href={`https://twitter.com/${coin.links.twitter_screen_name}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs px-3 py-2 bg-[#1a1a1a] rounded-lg text-[#a1a1aa] hover:text-white transition-colors">
                  <ExternalLink className="w-3 h-3" /> Twitter
                </a>
              )}
              {coin.links?.blockchain_site?.filter(Boolean).slice(0, 2).map((url: string) => (
                <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs px-3 py-2 bg-[#1a1a1a] rounded-lg text-[#a1a1aa] hover:text-white transition-colors">
                  <ExternalLink className="w-3 h-3" /> Explorer
                </a>
              ))}
            </div>
          </div>

          {coin.description?.en && (
            <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5">
              <h3 className="font-semibold text-sm mb-3">About {coin.name}</h3>
              <p className="text-sm text-[#a1a1aa] leading-relaxed line-clamp-6"
                dangerouslySetInnerHTML={{ __html: coin.description.en.replace(/<[^>]+>/g, '') }}
              />
            </div>
          )}
        </div>
      )}

      {!coin && !loading && !error && (
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-12 text-center">
          <Search className="w-10 h-10 text-[#2a2a2a] mx-auto mb-3" />
          <p className="text-[#71717a] text-sm">Search any token by CoinGecko ID</p>
          <p className="text-xs text-[#3a3a3a] mt-1">Examples: bitcoin, ethereum, chainlink, uniswap</p>
        </div>
      )}
    </div>
  )
}
