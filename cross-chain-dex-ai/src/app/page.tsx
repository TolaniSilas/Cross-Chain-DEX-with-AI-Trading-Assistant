import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ParticleBackground from '@/components/common/ParticleBackground'
import { ArrowRight, Zap, Link as LinkIcon } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-blue-50 relative overflow-hidden">
      {/* Particle background effect */}
      <div className="absolute inset-0 opacity-30">
        <ParticleBackground />
      </div>
      
      <Header />
      
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
        {/* Hero Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Trade smarter with AI
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-1">
            AI-powered cross-chain trading. Swap tokens across Ethereum and Polygon with intelligent guidance.
          </p>

          {/* CTA Buttons - mobile: compact size, min 44px touch target (WCAG/Apple HIG) */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-2.5 sm:gap-4">
            <Link 
              href="/swap"
              className="w-full sm:w-auto min-w-0 max-w-[200px] sm:max-w-none min-h-[44px] bg-blue-600 text-white px-4 py-2.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-lg"
            >
              Start Trading
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            </Link>
            <Link 
              href="/chat"
              className="w-full sm:w-auto min-w-0 max-w-[200px] sm:max-w-none min-h-[44px] bg-white text-blue-600 border-2 border-blue-600 px-4 py-2.5 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-lg"
            >
              Try AI Assistant
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-20">
          <div className="bg-white/80 backdrop-blur p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-gray-200 hover:border-blue-300 transition-all hover:shadow-lg text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 mx-auto">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">Lightning Fast</h3>
            <p className="text-sm sm:text-base text-gray-600 leading-snug">
              Instant swaps with the best rates across chains.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-gray-200 hover:border-blue-300 transition-all hover:shadow-lg text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 mx-auto">
              <LinkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">Cross-Chain</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Bridge assets seamlessly between networks
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl border border-gray-200 hover:border-blue-300 transition-all hover:shadow-lg text-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4 mx-auto">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-900">AI Powered</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Trade with intelligent, conversational guidance
            </p>
          </div>
        </div>
      </main>
      
      <Footer />

    </div>
  )
}