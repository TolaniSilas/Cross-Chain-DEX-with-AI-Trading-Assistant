import Header from '@/components/layout/Header'
import PortfolioCard from '@/components/wallet/PortfolioCard'
import { Lightbulb } from 'lucide-react'

export const metadata = {
  title: 'Portfolio - C-DEX AI',
  description: 'View your token holdings and portfolio performance',
}

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50">
      <Header />
      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Portfolio</h1>
          <p className="text-lg text-gray-600">
            Track your assets across all supported networks
          </p>
        </div>
        <PortfolioCard />
      </main>
    </div>
  )
}
