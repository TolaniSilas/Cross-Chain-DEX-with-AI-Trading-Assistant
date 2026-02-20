import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ParticleBackground from '@/components/common/ParticleBackground'
import Link from 'next/link'
import { Wallet, ArrowLeftRight, Route, Database, Layers, TriangleAlert } from 'lucide-react'

export const metadata = {
  title: 'Documentation - C-DEX AI',
  description: 'How to use C-DEX AI swap, bridge, and portfolio features',
}

const sectionCard = 'bg-white/85 backdrop-blur border border-blue-100 rounded-2xl p-4 sm:p-6 md:p-7 shadow-sm'

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50">
      <div className="absolute inset-0 opacity-30">
        <ParticleBackground />
      </div>

      <Header />

      <main className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-20">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">Documentation</h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            Practical guide for using C-DEX AI safely on Sepolia and Polygon Amoy testnets.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6">
          <section className={sectionCard}>
            <h2 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-blue-800 mb-3">
              <Wallet className="w-5 h-5" /> Wallet Connection
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-gray-700">
              <li>Connect using the wallet button in the header. Supported flows are handled by RainbowKit + wagmi.</li>
              <li>Switch networks to <strong>Sepolia (11155111)</strong> or <strong>Polygon Amoy (80002)</strong> if prompted.</li>
              <li>Portfolio and balance data become address-bound once connected.</li>
            </ul>
          </section>

          <section className={sectionCard}>
            <h2 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-blue-800 mb-3">
              <ArrowLeftRight className="w-5 h-5" /> Swap Flow
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm sm:text-base text-gray-700">
              <li>Select token pair and amount.</li>
              <li>App requests live quote through internal route: <code>/api/swap/quote</code>.</li>
              <li>Before execution, app builds transaction via <code>/api/swap/build</code> and asks wallet signature.</li>
              <li>Transaction broadcasts to chain and status can be tracked in explorer.</li>
            </ol>
            <p className="text-xs sm:text-sm text-gray-600 mt-3">
              Note: quotes can change rapidly depending on route liquidity and network conditions.
            </p>
          </section>

          <section className={sectionCard}>
            <h2 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-blue-800 mb-3">
              <Route className="w-5 h-5" /> Bridge Flow
            </h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm sm:text-base text-gray-700">
              <li>Pick source chain, destination chain, token, amount, and recipient.</li>
              <li>Route quote is requested through <code>/api/bridge/quote</code>.</li>
              <li>Bridge transaction payload is built via <code>/api/bridge/build</code>.</li>
              <li>Wallet signs and submits transaction on source chain.</li>
            </ol>
          </section>

          <section className={sectionCard}>
            <h2 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-blue-800 mb-3">
              <Database className="w-5 h-5" /> Portfolio Data Sources
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-gray-700">
              <li><strong>Balances:</strong> fetched on-chain using RPC calls (wagmi/viem).</li>
              <li><strong>Prices:</strong> fetched from CoinGecko through <code>/api/prices</code>.</li>
              <li><strong>Value:</strong> computed client-side as <code>balance × price</code>.</li>
              <li><strong>Chart:</strong> fetched through <code>/api/prices/history</code> using historical market data.</li>
            </ul>
          </section>

          <section className={sectionCard}>
            <h2 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-blue-800 mb-3">
              <Layers className="w-5 h-5" /> Supported Networks and Tokens
            </h2>
            <div className="grid sm:grid-cols-2 gap-3 text-sm sm:text-base">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                <p className="font-semibold text-blue-900">Sepolia (11155111)</p>
                <p className="text-gray-700">ETH, USDC, USDT</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                <p className="font-semibold text-blue-900">Polygon Amoy (80002)</p>
                <p className="text-gray-700">MATIC, USDC, USDT</p>
              </div>
            </div>
          </section>

          <section className={sectionCard}>
            <h2 className="flex items-center gap-2 text-lg sm:text-xl font-semibold text-blue-800 mb-3">
              <TriangleAlert className="w-5 h-5" /> Testnet Limits and Caveats
            </h2>
            <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-gray-700">
              <li>Testnet markets are thinner than mainnet; quotes may be less stable.</li>
              <li>Token prices are market references and may not perfectly match executable on-chain route.</li>
              <li>Transactions can fail due to slippage, gas spikes, chain congestion, or route unavailability.</li>
              <li>Do not treat testnet assets as real monetary value.</li>
            </ul>
          </section>
        </div>

        <div className="mt-8 text-center text-sm text-gray-600">
          Need quick answers? See <Link href="/faq" className="text-blue-700 font-semibold hover:text-blue-800">FAQ</Link> or review <Link href="/security" className="text-blue-700 font-semibold hover:text-blue-800">Security</Link>.
        </div>
      </main>

      <Footer />
    </div>
  )
}
