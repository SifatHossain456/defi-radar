'use client'

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, arbitrum, optimism, base, bsc } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'DeFi Radar',
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? 'defi-radar-demo',
  chains: [mainnet, polygon, arbitrum, optimism, base, bsc],
  ssr: true,
})

export const CHAINS = [
  { id: 1, name: 'Ethereum', symbol: 'ETH', color: '#627EEA', explorer: 'etherscan.io' },
  { id: 137, name: 'Polygon', symbol: 'MATIC', color: '#8247E5', explorer: 'polygonscan.com' },
  { id: 42161, name: 'Arbitrum', symbol: 'ETH', color: '#28A0F0', explorer: 'arbiscan.io' },
  { id: 10, name: 'Optimism', symbol: 'ETH', color: '#FF0420', explorer: 'optimistic.etherscan.io' },
  { id: 8453, name: 'Base', symbol: 'ETH', color: '#0052FF', explorer: 'basescan.org' },
  { id: 56, name: 'BNB Chain', symbol: 'BNB', color: '#F0B90B', explorer: 'bscscan.com' },
]
