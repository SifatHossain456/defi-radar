'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useEffect, useState } from 'react'
import { RefreshCw } from 'lucide-react'

export default function Navbar() {
  const { address } = useAccount()
  const [lastUpdate, setLastUpdate] = useState<string>('')

  useEffect(() => {
    const tick = () => setLastUpdate(new Date().toLocaleTimeString())
    tick()
    const id = setInterval(tick, 30_000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="h-14 bg-[#111111] border-b border-[#1e1e1e] flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-2 text-xs text-[#71717a]">
        <RefreshCw className="w-3 h-3" />
        <span>Updated {lastUpdate}</span>
        {address && (
          <span className="ml-3 px-2 py-0.5 bg-[#1a1a1a] rounded text-[#00d4ff] font-mono">
            {address.slice(0, 6)}…{address.slice(-4)}
          </span>
        )}
      </div>
      <ConnectButton
        showBalance={false}
        chainStatus="icon"
        accountStatus="avatar"
      />
    </header>
  )
}
