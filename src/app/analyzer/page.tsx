import TokenAnalyzerClient from './TokenAnalyzerClient'

export default function AnalyzerPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Token Analyzer</h1>
        <p className="text-sm text-[#71717a] mt-1">Search any token — risk score, liquidity, market data</p>
      </div>
      <TokenAnalyzerClient />
    </div>
  )
}
