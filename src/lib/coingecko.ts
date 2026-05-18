const BASE = 'https://api.coingecko.com/api/v3'

export interface CoinMarket {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  price_change_percentage_24h: number
  price_change_percentage_7d_in_currency: number
  total_volume: number
  circulating_supply: number
  sparkline_in_7d: { price: number[] }
}

export interface TrendingCoin {
  item: {
    id: string
    name: string
    symbol: string
    thumb: string
    market_cap_rank: number
    data: { price_change_percentage_24h: { usd: number }; price: string }
  }
}

export async function getTopCoins(page = 1, perPage = 50): Promise<CoinMarket[]> {
  const res = await fetch(
    `${BASE}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=7d`,
    { next: { revalidate: 60 } }
  )
  if (!res.ok) throw new Error('CoinGecko API error')
  return res.json()
}

export async function getTrending(): Promise<TrendingCoin[]> {
  const res = await fetch(`${BASE}/search/trending`, { next: { revalidate: 300 } })
  if (!res.ok) throw new Error('CoinGecko trending error')
  const data = await res.json()
  return data.coins ?? []
}

export async function getGlobalData() {
  const res = await fetch(`${BASE}/global`, { next: { revalidate: 120 } })
  if (!res.ok) throw new Error('CoinGecko global error')
  const data = await res.json()
  return data.data
}

export async function getCoinDetails(id: string) {
  const res = await fetch(
    `${BASE}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
    { next: { revalidate: 60 } }
  )
  if (!res.ok) throw new Error('CoinGecko coin detail error')
  return res.json()
}

export function fmt(n: number, decimals = 2): string {
  if (!n && n !== 0) return 'N/A'
  if (Math.abs(n) >= 1e12) return `$${(n / 1e12).toFixed(decimals)}T`
  if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(decimals)}B`
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(decimals)}M`
  if (Math.abs(n) >= 1e3) return `$${(n / 1e3).toFixed(decimals)}K`
  return `$${n.toFixed(decimals)}`
}

export function fmtPrice(n: number): string {
  if (!n && n !== 0) return 'N/A'
  if (n >= 1000) return `$${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}`
  if (n >= 1) return `$${n.toFixed(4)}`
  return `$${n.toPrecision(4)}`
}
