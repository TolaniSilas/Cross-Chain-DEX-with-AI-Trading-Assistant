import Link from 'next/link'
import Header from '../src/components/layout/Header'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header /> 
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Welcome to DEX AI Assistant
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            A decentralized exchange powered by artificial intelligence
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            This project is a coalescence of two groundbreaking technologies - blockchain and artificial intelligence (AI) - to solve an imperative problem: making Decentralized Finance (DeFi) accessible to everyone, including non-technical users. With the integration of the AI Agent assistant, it turns or alters a potentially confusing Decentralized Exchange (DEX) into a guided, educational trading experience.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Token Swaps</h3>
            <p className="text-gray-600">
              Seamlessly swap tokens on Ethereum and Polygon networks with the best rates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">Cross-Chain Bridge</h3>
            <p className="text-gray-600">
              Transfer assets between Ethereum and Polygon in a single transaction.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-gray-900">AI Trading Assistant</h3>
            <p className="text-gray-600">
              Chat with our AI to execute trades, learn about DeFi, and get personalized guidance.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex justify-center gap-4">
          <Link 
            href="/swap"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start Trading
          </Link>
          <Link 
            href="/chat"
            className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Try AI Assistant
          </Link>
        </div>
      </main>
    </div>
  )
}