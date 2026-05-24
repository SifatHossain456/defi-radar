'use client'

import { useEffect, useState } from 'react'
import { createPublicClient, http, formatUnits } from 'viem'
import { mainnet, polygon, arbitrum, base, optimism } from 'wagmi/chains'
import { Fuel } from 'lucide-react'

const CHAINS_GAS = [
  { chain: mainnet, label: 'Ethereum', color: '#627EEA', symbol: 'Gwei' },
  { chain: polygon, label: 'Polygon', color: '#8247E5', symbol: 'Gwei' },
  { chain: arbitrum, label: 'Arbitrum', color: '#28A0F0', symbol: 'Gwei' },
  { chain: base, label: 'Base', color: '#0052FF', symbol: 'Gwei' },
  { chain: optimism, label: 'Optimism', color: '#FF0420', symbol: 'Gwei' },
]

interface GasEntry {
  label: string
  color: string
  gwei: string | null
  error: boolean
  loading: boolean
}

export default function GasTracker() {
  const [entries, setEntries] = useState<GasEntry[]>(
    CHAINS_GAS.map((c) => ({ label: c.label, color: c.color, gwei: null, error: false, loading: true }))
  )

  useEffect(() => {
    const clients = CHAINS_GAS.map(({ chain }) =>
      createPublicClient({ chain, transport: http() })
    )

    const fetchAll = async () => {
      const results = await Promise.allSettled(clients.map((c) => c.getGasPrice()))
      setEntries(
        results.map((r, i) => ({
          label: CHAINS_GAS[i].label,
          color: CHAINS_GAS[i].color,
          gwei: r.status === 'fulfilled' ? parseFloat(formatUnits(r.value, 9)).toFixed(2) : null,
          error: r.status === 'rejected',
          loading: false,
        }))
      )
    }

    fetchAll()
    const id = setInterval(fetchAll, 15_000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Fuel className="w-4 h-4 text-[#00d4ff]" />
        <h3 className="font-semibold text-sm">Gas Tracker</h3>
        <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] live-dot ml-auto" />
      </div>
      <div className="space-y-2.5">
        {entries.map(({ label, color, gwei, error, loading }) => (
          <div key={label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: color }} />
              <span className="text-sm text-[#a1a1aa]">{label}</span>
            </div>
            {loading ? (
              <div className="w-16 h-4 bg-[#1e1e1e] rounded animate-pulse" aria-label="Loading" />
            ) : error ? (
              <span className="text-sm font-mono text-[#ef4444]" title="Failed to fetch">—</span>
            ) : (
              <span className="text-sm font-mono font-medium">{gwei} Gwei</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
