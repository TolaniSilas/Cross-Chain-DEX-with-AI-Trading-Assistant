import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import PortfolioCard from '@/components/wallet/PortfolioCard'
import ParticleBackground from '@/components/common/ParticleBackground'

export const metadata = {
  title: 'Portfolio - C-DEX AI',
  description: 'View your token holdings and portfolio performance',
}

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50">
    
    {/* Particle background effect */}
    <div className="absolute inset-0 opacity-30">
    <ParticleBackground />
    </div>

      <Header />
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
        <div className="mb-6 sm:mb-8 text-center px-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">Your Portfolio</h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Track your assets across all supported networks
          </p>
        </div>
        <PortfolioCard />
      </main>
      
      <Footer />

    </div>
  )
}
