import Link from 'next/link'
import Header from '@/components/layout/Header'
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
      
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Trade smarter with AI
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            AI-powered cross-chain trading. Swap tokens across Ethereum and Polygon with intelligent guidance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/swap"
              className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
            >
              Start Trading
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/chat"
              className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-2xl font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2 text-lg"
            >
              Try AI Assistant
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <div className="bg-white/80 backdrop-blur p-8 rounded-3xl border border-gray-200 hover:border-blue-300 transition-all hover:shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Lightning Fast</h3>
            <p className="text-gray-600">
              Instant swaps with the best rates across chains
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur p-8 rounded-3xl border border-gray-200 hover:border-blue-300 transition-all hover:shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
              <LinkIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Cross-Chain</h3>
            <p className="text-gray-600">
              Bridge assets seamlessly between networks
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur p-8 rounded-3xl border border-gray-200 hover:border-blue-300 transition-all hover:shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900">AI Powered</h3>
            <p className="text-gray-600">
              Trade with intelligent, conversational guidance
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}