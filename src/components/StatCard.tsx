import { TrendingUp, TrendingDown } from 'lucide-react'
import { type LucideIcon } from 'lucide-react'

interface Props {
  label: string
  value: string
  change?: number
  icon: LucideIcon
  accent?: string
}

export default function StatCard({ label, value, change, icon: Icon, accent = '#00d4ff' }: Props) {
  const isPositive = (change ?? 0) >= 0
  return (
    <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-5 hover:border-[#2a2a2a] transition-colors">
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-[#71717a] uppercase tracking-wide">{label}</span>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${accent}18` }}>
          <Icon className="w-4 h-4" style={{ color: accent }} />
        </div>
      </div>
      <p className="text-2xl font-bold tracking-tight mb-1">{value}</p>
      {change !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-[#22c55e]' : 'text-[#ef4444]'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {isPositive ? '+' : ''}{change.toFixed(2)}% (24h)
        </div>
      )}
    </div>
  )
}
