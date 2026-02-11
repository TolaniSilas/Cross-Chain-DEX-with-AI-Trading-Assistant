import Header from '@/components/layout/Header'
import SwapCard from '@/components/swap/SwapCard'

export const metadata = {
  title: 'Swap - C-DEX AI',
  description: 'Swap tokens across chains with AI-powered trading',
}

export default function SwapPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50">
      <Header />
      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Token Swap</h1>
          <p className="text-lg text-gray-600">
            Exchange tokens instantly with competitive rates across supported networks
          </p>
        </div>
        <SwapCard />
      </main>
    </div>
  )
}
