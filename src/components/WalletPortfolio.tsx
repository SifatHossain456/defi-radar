'use client'

import { useAccount, useBalance } from 'wagmi'
import { mainnet, polygon, arbitrum, base } from 'wagmi/chains'
import { Wallet, ExternalLink } from 'lucide-react'
import type { Chain } from 'viem'

const CHAINS_TO_CHECK: { chain: Chain; label: string; color: string }[] = [
  { chain: mainnet, label: 'Ethereum', color: '#627EEA' },
  { chain: polygon, label: 'Polygon', color: '#8247E5' },
  { chain: arbitrum, label: 'Arbitrum', color: '#28A0F0' },
  { chain: base, label: 'Base', color: '#0052FF' },
]

function ChainBalance({ address, chain, label, color }: {
  address: `0x${string}`,
  chain: Chain,
  label: string,
  color: string,
}) {
  const { data, isLoading } = useBalance({ address, chainId: chain.id })
  if (isLoading) {
    return (
      <div className="flex items-center justify-between py-2.5 border-b border-[#1e1e1e] last:border-0">
        <div className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
          <span className="text-sm text-[#a1a1aa]">{label}</span>
        </div>
        <div className="w-16 h-4 bg-[#1e1e1e] rounded animate-pulse" />
      </div>
    )
  }
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#1e1e1e] last:border-0">
      <div className="flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full" style={{ background: color }} />
        <span className="text-sm text-[#a1a1aa]">{label}</span>
      </div>
      <span className="text-sm font-mono font-medium">
        {data ? `${parseFloat(data.formatted).toFixed(4)} ${data.symbol}` : '—'}
      </span>
    </div>
  )
}

export default function WalletPortfolio() {
  const { address, isConnected } = useAccount()

  if (!isConnected || !address) {
    return (
      <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 flex flex-col items-center justify-center gap-3 min-h-48">
        <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] flex items-center justify-center">
          <Wallet className="w-6 h-6 text-[#71717a]" />
        </div>
        <div className="text-center">
          <p className="font-medium text-sm">Connect your wallet</p>
          <p className="text-xs text-[#71717a] mt-1">See real balances across chains</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm">Native Balances</h3>
        <a
          href={`https://etherscan.io/address/${address}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-[#71717a] hover:text-[#00d4ff] flex items-center gap-1 transition-colors"
        >
          Etherscan <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <div>
        {CHAINS_TO_CHECK.map(({ chain, label, color }) => (
          <ChainBalance key={chain.id} address={address} chain={chain} label={label} color={color} />
        ))}
      </div>
      <p className="text-xs text-[#71717a] mt-3 font-mono">{address.slice(0, 10)}…{address.slice(-6)}</p>
    </div>
  )
}
