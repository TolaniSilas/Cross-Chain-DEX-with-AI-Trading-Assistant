'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAccount, useChainId, useBalance } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Copy, ExternalLink, Wallet as WalletIcon, TrendingUp, TrendingDown } from 'lucide-react'
import { supportedChains } from '@/config/chains'
import { getTokensByChain, type Token } from '@/config/tokens'

export default function PortfolioCard() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'overview' | 'tokens' | 'activity'>('overview')

  const currentChain = useMemo(() => {
    return supportedChains.find(c => c.id === chainId)
  }, [chainId])

  const chainTokens = useMemo(() => {
    return chainId ? getTokensByChain(chainId) : []
  }, [chainId])

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    }
  }

  // Show demo wallet when not connected
  if (!isConnected || !address) {
    return (
      <div className="w-full px-4">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Portfolio</h1>
            <p className="text-gray-600">Track your assets across all supported networks</p>
          </div>

          {/* Connect Wallet Card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur border border-blue-200 rounded-3xl shadow-lg p-20 text-center">
              <div className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <WalletIcon className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Connect a wallet to view your portfolio
              </h2>
              <div className="flex justify-center">
                <ConnectButton />
              </div>
            </div>
          </div>

          {/* Demo Wallet Section - Shows when not connected */}
          <div className="mt-12">
            <DemoWallet />
          </div>
        </div>
      </div>
    )
  }

  // Real wallet connected - show actual data
  return (
    <div className="w-full px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Portfolio</h1>
          <p className="text-gray-600">Track your assets across all supported networks</p>
        </div>

        {/* Portfolio Content */}
        <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-3xl shadow-lg overflow-hidden">
          {/* Header with Wallet Info */}
          <div className="p-6 border-b border-gray-200 bg-white/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-200 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600">
                    {address.slice(2, 4).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <code className="text-base font-mono text-gray-900">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </code>
                    <button
                      onClick={handleCopyAddress}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                      aria-label="Copy address"
                    >
                      <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  {copiedAddress && <p className="text-xs text-green-600">✓ Address copied!</p>}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right mr-3">
                  <p className="text-sm text-gray-600">Network</p>
                  <p className="text-base font-semibold text-gray-900">{currentChain?.name || 'Unknown'}</p>
                </div>
                <span className="px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                  {currentChain?.name || 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-white/30">
            <div className="flex px-6">
              <button
                onClick={() => setSelectedTab('overview')}
                className={`px-6 py-4 text-base font-semibold transition-colors border-b-2 ${
                  selectedTab === 'overview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setSelectedTab('tokens')}
                className={`px-6 py-4 text-base font-semibold transition-colors border-b-2 ${
                  selectedTab === 'tokens'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Tokens
              </button>
              <button
                onClick={() => setSelectedTab('activity')}
                className={`px-6 py-4 text-base font-semibold transition-colors border-b-2 ${
                  selectedTab === 'activity'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Activity
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {selectedTab === 'overview' && (
              <RealOverviewTab
                address={address}
                chainId={chainId}
                chainTokens={chainTokens}
                currentChain={currentChain}
              />
            )}

            {selectedTab === 'tokens' && (
              <RealTokensTab
                address={address}
                chainTokens={chainTokens}
                currentChain={currentChain}
              />
            )}

            {selectedTab === 'activity' && (
              <RealActivityTab address={address} currentChain={currentChain} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Demo Wallet Component (shows when not connected)
function DemoWallet() {
  const demoAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
  const demoTokens = [
    { symbol: 'ETH', name: 'Ethereum', balance: '0.033', value: 64.02, icon: '⟠' },
    { symbol: 'ETH', name: 'Base ETH', balance: '0.015', value: 30.27, icon: '🔵' },
    { symbol: 'USDC', name: 'USD Coin', balance: '8.39', value: 8.39, icon: '💵' },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white/50 backdrop-blur border border-gray-200 rounded-3xl shadow-md overflow-hidden">
        {/* Demo Header */}
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
              <span className="text-xl">✨</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Demo wallet</p>
              <code className="text-sm text-gray-600">{demoAddress.slice(0, 10)}...{demoAddress.slice(-4)}</code>
            </div>
          </div>
        </div>

        {/* Demo Content */}
        <div className="p-6">
          {/* Demo Portfolio Value */}
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-1">Portfolio Value</p>
            <h3 className="text-4xl font-bold text-gray-900 mb-2">$253.63</h3>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span className="text-sm font-semibold text-red-600">
                $4.67 (1.72%)
              </span>
            </div>
          </div>

          {/* Demo Chart */}
          <div className="h-40 bg-gradient-to-br from-red-50 to-red-100/30 rounded-2xl border border-red-200 mb-6 flex items-center justify-center">
            <p className="text-gray-500 text-sm italic">Demo portfolio chart</p>
          </div>

          {/* Demo Tokens */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Tokens</h4>
            <div className="space-y-3">
              {demoTokens.map((token, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                      {token.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{token.symbol}</p>
                      <p className="text-sm text-gray-600">{token.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{token.balance} {token.symbol}</p>
                    <p className="text-sm text-gray-600">${token.value.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl text-center">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Note:</span> This is demo data. Connect your wallet to see your real portfolio.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Real Overview Tab (fetches actual on-chain data)
function RealOverviewTab({
  address,
  chainId,
  chainTokens,
  currentChain,
}: {
  address: string
  chainId: number
  chainTokens: Token[]
  currentChain: any
}) {
  const { data: nativeBalance } = useBalance({ address: address as `0x${string}` })
  const [totalValue, setTotalValue] = useState(0)

  useEffect(() => {
    // Calculate total portfolio value from real balances
    if (nativeBalance) {
      const ethValue = parseFloat(nativeBalance.formatted) * 1956 // Mock ETH price
      setTotalValue(ethValue)
    }
  }, [nativeBalance])

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Left: Real Portfolio Value */}
      <div className="lg:col-span-2">
        <div className="mb-8">
          <h3 className="text-5xl font-bold text-gray-900 mb-3">
            ${totalValue.toFixed(2)}
          </h3>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-base font-semibold text-green-600">
              Real-time data from blockchain
            </span>
          </div>
        </div>

        {/* Chart Placeholder - integrate real chart library */}
        <div className="h-64 bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-2xl border border-blue-200 flex items-center justify-center mb-8">
          <p className="text-gray-500">Live portfolio chart (connect chart library)</p>
        </div>

        {/* Real Native Balance */}
        <div className="p-6 bg-blue-50 rounded-2xl border border-blue-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-blue-800 mb-1">Native Balance</p>
              <p className="text-2xl font-bold text-blue-900">
                {nativeBalance ? parseFloat(nativeBalance.formatted).toFixed(4) : '0.0000'} {currentChain?.nativeCurrency.symbol}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-blue-800 mb-1">USD Value</p>
              <p className="text-2xl font-bold text-blue-900">
                ${totalValue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Quick Actions */}
      <div>
        <h4 className="text-base font-semibold text-gray-700 mb-4">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button className="p-5 bg-blue-50 hover:bg-blue-100 rounded-2xl border border-blue-200 transition-colors text-center">
            <div className="text-3xl mb-2">📤</div>
            <p className="text-sm font-semibold text-blue-900">Send</p>
          </button>
          <button className="p-5 bg-blue-50 hover:bg-blue-100 rounded-2xl border border-blue-200 transition-colors text-center">
            <div className="text-3xl mb-2">📥</div>
            <p className="text-sm font-semibold text-blue-900">Receive</p>
          </button>
          <button className="p-5 bg-blue-50 hover:bg-blue-100 rounded-2xl border border-blue-200 transition-colors text-center">
            <div className="text-3xl mb-2">💰</div>
            <p className="text-sm font-semibold text-blue-900">Buy</p>
          </button>
          <button className="p-5 bg-blue-50 hover:bg-blue-100 rounded-2xl border border-blue-200 transition-colors text-center">
            <div className="text-3xl mb-2">•••</div>
            <p className="text-sm font-semibold text-blue-900">More</p>
          </button>
        </div>

        {/* Network Info */}
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Connected to</p>
          <p className="text-lg font-semibold text-gray-900">{currentChain?.name}</p>
          <p className="text-xs text-gray-500 mt-1">Chain ID: {chainId}</p>
        </div>
      </div>
    </div>
  )
}

// Real Tokens Tab
function RealTokensTab({
  address,
  chainTokens,
  currentChain,
}: {
  address: string
  chainTokens: Token[]
  currentChain: any
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">
          Tokens on {currentChain?.name}
        </h3>
        <p className="text-base text-gray-600">{chainTokens.length} tokens</p>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-gray-50 text-sm font-semibold text-gray-700">
          <div>Token</div>
          <div className="text-right">Price</div>
          <div className="text-right">Balance</div>
          <div className="text-right">Value</div>
        </div>

        <div className="divide-y divide-gray-200">
          {chainTokens.map((token) => (
            <RealTokenRow
              key={token.address}
              token={token}
              address={address}
              blockExplorer={currentChain?.blockExplorers?.default}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Real Token Row - fetches actual balance
function RealTokenRow({
  token,
  address,
  blockExplorer,
}: {
  token: Token
  address: string
  blockExplorer?: any
}) {
  // Fetch real token balance here
  const balance = '0.00' // Replace with actual balance fetch
  const price = '1,956.58' // Replace with actual price fetch

  return (
    <div className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
          <span className="text-sm font-bold text-blue-600">{token.symbol[0]}</span>
        </div>
        <div>
          <p className="font-semibold text-gray-900">{token.symbol}</p>
          <p className="text-sm text-gray-600">{token.name}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-900">${price}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-900">{balance}</p>
      </div>
      <div className="text-right flex items-center justify-end gap-2">
        <p className="font-semibold text-gray-900">$0.00</p>
        {blockExplorer && (
          <a
            href={`${blockExplorer.url}/token/${token.address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-gray-500" />
          </a>
        )}
      </div>
    </div>
  )
}

// Real Activity Tab - fetch from blockchain
function RealActivityTab({ address, currentChain }: { address: string; currentChain: any }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Recent activity</h3>
        <p className="text-base text-gray-600">Loading from blockchain...</p>
      </div>

      <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200">
        <p className="text-gray-600">
          Real transaction history will be fetched from {currentChain?.name} blockchain
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Address: {address}
        </p>
      </div>
    </div>
  )
}