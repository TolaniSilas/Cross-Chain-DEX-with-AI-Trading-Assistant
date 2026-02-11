import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BridgeCard from '@/components/bridge/BridgeCard'
import ParticleBackground from '@/components/common/ParticleBackground'

export const metadata = {
  title: 'Bridge - C-DEX AI',
  description: 'Bridge tokens across chains securely',
}

export default function BridgePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50">

      {/* Particle background effect */}
      <div className="absolute inset-0 opacity-30">
      <ParticleBackground />
      </div>
      
      <Header />
      
      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Cross-Chain Bridge</h1>
          <p className="text-lg text-gray-600">
            Transfer assets seamlessly between Ethereum and Polygon networks
          </p>
        </div>
        <BridgeCard />
      </main>

      <Footer />

    </div>
  )
}
