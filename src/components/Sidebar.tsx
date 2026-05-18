import Link from 'next/link'
import {
  LayoutDashboard,
  TrendingUp,
  Database,
  Search,
  Zap,
  Radio,
} from 'lucide-react'

const NAV = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/markets', label: 'Markets', icon: TrendingUp },
  { href: '/protocols', label: 'Protocols', icon: Database },
  { href: '/analyzer', label: 'Analyzer', icon: Search },
  { href: '/yields', label: 'Yields', icon: Zap },
]

export default function Sidebar() {
  return (
    <aside className="w-60 flex-shrink-0 bg-[#111111] border-r border-[#1e1e1e] flex flex-col hidden md:flex">
      <div className="px-5 py-5 border-b border-[#1e1e1e]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d4ff] to-[#7c3aed] flex items-center justify-center">
            <Radio className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">DeFi Radar</span>
        </div>
        <p className="text-xs text-[#71717a] mt-1 ml-10.5">Multi-Chain Intelligence</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-[#1a1a1a] transition-colors text-sm font-medium group"
          >
            <Icon className="w-4 h-4 group-hover:text-[#00d4ff] transition-colors" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-[#1e1e1e]">
        <div className="flex items-center gap-2 text-xs text-[#71717a]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] live-dot" />
          Live data — no fake numbers
        </div>
      </div>
    </aside>
  )
}
