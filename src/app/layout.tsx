import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Sidebar from '@/components/Sidebar'
import Navbar from '@/components/Navbar'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'DeFi Radar — Multi-Chain Intelligence', template: '%s — DeFi Radar' },
  description: 'Real-time DeFi portfolio tracker, market intelligence, protocol analytics, and token risk analyzer.',
  keywords: ['DeFi', 'portfolio tracker', 'multi-chain', 'yield', 'gas tracker', 'market cap', 'crypto'],
  openGraph: {
    title: 'DeFi Radar — Multi-Chain Intelligence',
    description: 'Real-time DeFi portfolio tracker, market intelligence, protocol analytics, and token risk analyzer.',
    type: 'website',
    siteName: 'DeFi Radar',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DeFi Radar — Multi-Chain Intelligence',
    description: 'Real-time DeFi portfolio tracker and multi-chain market intelligence.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="h-full bg-[#0a0a0a] text-white antialiased">
        <Providers>
          <div className="flex h-full">
            <Sidebar />
            <div className="flex flex-col flex-1 min-w-0">
              <Navbar />
              <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
