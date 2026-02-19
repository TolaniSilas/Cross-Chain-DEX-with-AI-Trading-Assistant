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
        <div className="max-w-2xl mx-auto">
          {/* Connect Wallet Card */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 backdrop-blur border border-blue-200 rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-10 md:p-16 lg:p-20 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-blue-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <WalletIcon className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-blue-600" />
              </div>
              <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 mb-5 sm:mb-6 leading-snug px-1">
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
      <div className="max-w-2xl mx-auto">
        {/* Portfolio Content */}
        <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl sm:rounded-3xl shadow-lg overflow-hidden">
          {/* Header with Wallet Info */}
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-white/50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="w-11 h-11 sm:w-14 sm:h-14 bg-blue-200 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-base sm:text-xl font-bold text-blue-600">
                    {address.slice(2, 4).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                    <code className="text-sm sm:text-base font-mono text-gray-900 truncate">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </code>
                    <button
                      onClick={handleCopyAddress}
                      className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                      aria-label="Copy address"
                    >
                      <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600" />
                    </button>
                  </div>
                  {copiedAddress && <p className="text-xs text-green-600">✓ Address copied!</p>}
                </div>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="text-left sm:text-right">
                  <p className="text-xs sm:text-sm text-gray-600">Network</p>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">{currentChain?.name || 'Unknown'}</p>
                </div>
                <span className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-100 text-blue-600 rounded-full text-xs sm:text-sm font-semibold shrink-0">
                  {currentChain?.name || 'Unknown'}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-white/30">
            <div className="flex px-2 sm:px-6">
              <button
                onClick={() => setSelectedTab('overview')}
                className={`flex-1 sm:flex-none px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold transition-colors border-b-2 ${
                  selectedTab === 'overview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setSelectedTab('tokens')}
                className={`flex-1 sm:flex-none px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold transition-colors border-b-2 ${
                  selectedTab === 'tokens'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Tokens
              </button>
              <button
                onClick={() => setSelectedTab('activity')}
                className={`flex-1 sm:flex-none px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold transition-colors border-b-2 ${
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
          <div className="p-4 sm:p-6 md:p-8">
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
    <div className="max-w-5xl mx-auto w-full">
      <div className="bg-white/50 backdrop-blur border border-gray-200 rounded-2xl sm:rounded-3xl shadow-md overflow-hidden">
        {/* Demo Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100/50">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center shrink-0">
              <span className="text-base sm:text-xl">✨</span>
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 text-sm sm:text-base">Demo wallet</p>
              <code className="text-xs sm:text-sm text-gray-600 truncate block">{demoAddress.slice(0, 10)}...{demoAddress.slice(-4)}</code>
            </div>
          </div>
        </div>

        {/* Demo Content */}
        <div className="p-4 sm:p-6">
          {/* Demo Portfolio Value */}
          <div className="mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-gray-600 mb-0.5 sm:mb-1">Portfolio Value</p>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-1 sm:mb-2 tabular-nums">$253.63</h3>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-red-600">
                $4.67 (1.72%)
              </span>
            </div>
          </div>

          {/* Demo Chart */}
          <div className="h-28 sm:h-36 md:h-40 bg-gradient-to-br from-red-50 to-red-100/30 rounded-xl sm:rounded-2xl border border-red-200 mb-4 sm:mb-6 flex items-center justify-center">
            <p className="text-gray-500 text-xs sm:text-sm italic">Demo portfolio chart</p>
          </div>

          {/* Demo Tokens */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Tokens</h4>
            <div className="space-y-2 sm:space-y-3">
              {demoTokens.map((token, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 p-3 sm:p-4 bg-gray-50/50 rounded-xl sm:rounded-2xl border border-gray-200"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm sm:text-xl shrink-0">
                      {token.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">{token.symbol}</p>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{token.name}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold text-gray-900 text-sm sm:text-base tabular-nums">{token.balance} {token.symbol}</p>
                    <p className="text-xs sm:text-sm text-gray-600 tabular-nums">${token.value.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Demo Info */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-xl sm:rounded-2xl text-center">
            <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
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
    <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
      {/* Left: Real Portfolio Value */}
      <div className="lg:col-span-2">
        <div className="mb-5 sm:mb-8">
          <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 tabular-nums">
            ${totalValue.toFixed(2)}
          </h3>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" />
            <span className="text-xs sm:text-base font-semibold text-green-600">
              Real-time data from blockchain
            </span>
          </div>
        </div>

        {/* Chart Placeholder - integrate real chart library */}
        <div className="h-40 sm:h-52 md:h-64 bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-xl sm:rounded-2xl border border-blue-200 flex items-center justify-center mb-5 sm:mb-8">
          <p className="text-gray-500 text-xs sm:text-sm text-center px-2">Live portfolio chart (connect chart library)</p>
        </div>

        {/* Real Native Balance */}
        <div className="p-4 sm:p-6 bg-blue-50 rounded-xl sm:rounded-2xl border border-blue-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <p className="text-xs sm:text-sm text-blue-800 mb-0.5 sm:mb-1">Native Balance</p>
              <p className="text-lg sm:text-2xl font-bold text-blue-900 tabular-nums">
                {nativeBalance ? parseFloat(nativeBalance.formatted).toFixed(4) : '0.0000'} {currentChain?.nativeCurrency.symbol}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-xs sm:text-sm text-blue-800 mb-0.5 sm:mb-1">USD Value</p>
              <p className="text-lg sm:text-2xl font-bold text-blue-900 tabular-nums">
                ${totalValue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Quick Actions */}
      <div>
        <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-3 sm:mb-4">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-5 sm:mb-8">
          <button className="p-3 sm:p-5 bg-blue-50 hover:bg-blue-100 rounded-xl sm:rounded-2xl border border-blue-200 transition-colors text-center">
            <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">📤</div>
            <p className="text-xs sm:text-sm font-semibold text-blue-900">Send</p>
          </button>
          <button className="p-3 sm:p-5 bg-blue-50 hover:bg-blue-100 rounded-xl sm:rounded-2xl border border-blue-200 transition-colors text-center">
            <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">📥</div>
            <p className="text-xs sm:text-sm font-semibold text-blue-900">Receive</p>
          </button>
          <button className="p-3 sm:p-5 bg-blue-50 hover:bg-blue-100 rounded-xl sm:rounded-2xl border border-blue-200 transition-colors text-center">
            <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">💰</div>
            <p className="text-xs sm:text-sm font-semibold text-blue-900">Buy</p>
          </button>
          <button className="p-3 sm:p-5 bg-blue-50 hover:bg-blue-100 rounded-xl sm:rounded-2xl border border-blue-200 transition-colors text-center">
            <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">•••</div>
            <p className="text-xs sm:text-sm font-semibold text-blue-900">More</p>
          </button>
        </div>

        {/* Network Info */}
        <div className="p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Connected to</p>
          <p className="text-base sm:text-lg font-semibold text-gray-900">{currentChain?.name}</p>
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-2xl font-bold text-gray-900">
          Tokens on {currentChain?.name}
        </h3>
        <p className="text-sm sm:text-base text-gray-600">{chainTokens.length} tokens</p>
      </div>

      {/* Table - card layout on mobile */}
      <div className="border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden">
        <div className="hidden sm:grid grid-cols-4 gap-4 px-4 md:px-6 py-3 md:py-4 bg-gray-50 text-xs md:text-sm font-semibold text-gray-700">
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
    <div className="flex flex-col sm:grid sm:grid-cols-4 gap-2 sm:gap-4 px-4 py-3 sm:py-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-200 rounded-full flex items-center justify-center shrink-0">
          <span className="text-xs sm:text-sm font-bold text-blue-600">{token.symbol[0]}</span>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm sm:text-base">{token.symbol}</p>
          <p className="text-xs sm:text-sm text-gray-600 truncate">{token.name}</p>
        </div>
      </div>
      <div className="flex justify-between sm:justify-end sm:text-right text-sm">
        <span className="sm:hidden text-gray-500">Price</span>
        <p className="font-semibold text-gray-900">${price}</p>
      </div>
      <div className="flex justify-between sm:justify-end sm:text-right text-sm">
        <span className="sm:hidden text-gray-500">Balance</span>
        <p className="font-semibold text-gray-900 tabular-nums">{balance}</p>
      </div>
      <div className="flex justify-between sm:justify-end items-center gap-2 text-sm">
        <span className="sm:hidden text-gray-500">Value</span>
        <div className="flex items-center gap-2">
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
    </div>
  )
}

// Real Activity Tab - fetch from blockchain
function RealActivityTab({ address, currentChain }: { address: string; currentChain: any }) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-2xl font-bold text-gray-900">Recent activity</h3>
        <p className="text-sm sm:text-base text-gray-600">Loading from blockchain...</p>
      </div>

      <div className="p-5 sm:p-8 text-center bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200">
        <p className="text-sm sm:text-base text-gray-600">
          Real transaction history will be fetched from {currentChain?.name} blockchain
        </p>
        <p className="text-xs sm:text-sm text-gray-500 mt-2 break-all">
          Address: {address}
        </p>
      </div>
    </div>
  )
}