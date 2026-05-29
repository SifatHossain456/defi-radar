# DeFi Radar — Multi-Chain Intelligence

Real-time DeFi portfolio tracker, market intelligence, protocol analytics, and token risk analyzer — aggregating live data from DeFiLlama, CoinGecko, and on-chain RPCs into a single dashboard.

## Features

- **Markets** — Top 250 tokens by market cap with live prices, 24h change, volume, and sparklines
- **Protocols** — DeFi protocol TVL rankings from DeFiLlama with 24h/7d change and per-chain breakdown
- **Yields** — Top yield opportunities filtered by APY and TVL minimum, live from DeFiLlama
- **Token Analyzer** — Risk scoring for any ERC-20: liquidity depth, holder concentration, contract audit status
- **Gas Tracker** — Real-time gas prices across Ethereum, Base, Arbitrum, Optimism, and Polygon

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 App Router (RSC) |
| Styling | Tailwind CSS v4 |
| Data | DeFiLlama API, CoinGecko API |
| Fonts | Geist Sans + Geist Mono |

## Getting Started

```bash
git clone https://github.com/SifatHossain456/defi-radar.git
cd defi-radar
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No API keys required — all data is fetched from free public APIs.

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Portfolio overview
│   ├── markets/          # Token price table
│   ├── protocols/        # TVL rankings + chain breakdown
│   ├── yields/           # Yield farming opportunities
│   └── analyzer/         # Token risk analyzer
└── lib/
    ├── defillama.ts      # DeFiLlama API client
    └── coingecko.ts      # CoinGecko API client
```

## License

MIT
