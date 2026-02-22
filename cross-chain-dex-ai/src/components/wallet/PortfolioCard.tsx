'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import { useAccount, useChainId, useBalance } from 'wagmi'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import Link from 'next/link'
import { Copy, ExternalLink, Wallet as WalletIcon, TrendingUp, TrendingDown, Send, Download, DollarSign, MoreHorizontal, Sparkles, ArrowUpRight, Landmark, ArrowDownCircle, ArrowRightLeft, ChevronDown, X, QrCode, ArrowLeft } from 'lucide-react'
import { supportedChains } from '@/config/chains'
import { getTokensByChain, type Token } from '@/config/tokens'
import useTokenBalance, { useMultipleTokenBalances } from '@/hooks/useTokenBalance'
import { useTokenPrices } from '@/hooks/useTokenPrices'

function getTokenIconPath(symbol: string): string {
  const s = symbol.toUpperCase()
  if (s === 'ETH') return '/icons/ethereum-eth-logo.svg'
  if (s === 'MATIC') return '/icons/polygon-matic-logo.svg'
  if (s === 'USDC') return '/icons/tokens/usd-coin-usdc-logo.svg'
  if (s === 'USDT') return '/icons/tokens/tether-usdt-logo.svg'
  return '/icons/cdex-ai-logo.png'
}

export default function PortfolioCard() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'overview' | 'tokens' | 'activity'>('overview')
  const [showBuyPanel, setShowBuyPanel] = useState(false)
  const [showReceivePanel, setShowReceivePanel] = useState(false)
  const [showTransferPanel, setShowTransferPanel] = useState(false)

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
        <div className="max-w-6xl mx-auto">
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
      <div className="max-w-6xl mx-auto">
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
          <div className="p-5 sm:p-7 md:p-10">
            {selectedTab === 'overview' && (
              <RealOverviewTab
                address={address}
                chainId={chainId}
                chainTokens={chainTokens}
                currentChain={currentChain}
                onOpenBuyPanel={() => setShowBuyPanel(true)}
                onOpenReceivePanel={() => setShowReceivePanel(true)}
                onOpenTransferPanel={() => setShowTransferPanel(true)}
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

        {/* Buy crypto panel modal - Swap / Buy / Sell only */}
        {showBuyPanel && (
          <BuyCryptoPanel chainTokens={chainTokens} onClose={() => setShowBuyPanel(false)} />
        )}

        {/* Receive crypto modal */}
        {showReceivePanel && address && (
          <ReceiveCryptoPanel
            address={address}
            currentChain={currentChain}
            onClose={() => setShowReceivePanel(false)}
          />
        )}

        {/* Transfer modal */}
        {showTransferPanel && (
          <TransferPanel onClose={() => setShowTransferPanel(false)} />
        )}
      </div>
    </div>
  )
}

const BINANCE_BUY_URL = 'https://www.binance.com/en/crypto/BUY'
const BINANCE_SELL_URL = 'https://www.binance.com/en/crypto/SELL'

// Buy crypto panel: only Swap, Buy, Sell tabs (opens from Quick Action "Buy crypto")
function BuyCryptoPanel({ chainTokens, onClose }: { chainTokens: Token[]; onClose: () => void }) {
  const [panelTab, setPanelTab] = useState<'swap' | 'buy' | 'sell'>('buy')
  const [fiatAmount, setFiatAmount] = useState('')
  const [selectedCrypto, setSelectedCrypto] = useState('ETH')
  const [currencyLabel] = useState('USD')
  const [tokenDropdownOpen, setTokenDropdownOpen] = useState(false)
  const [showBinanceStep, setShowBinanceStep] = useState(false)
  const [showBinanceSellStep, setShowBinanceSellStep] = useState(false)
  const tokenDropdownRef = useRef<HTMLDivElement>(null)

  const quickAmounts = ['100', '300', '1000']

  // Unique tokens by symbol (project tokens for current chain)
  const buyTokens = useMemo(() => {
    const seen = new Set<string>()
    return chainTokens.filter((t) => {
      if (seen.has(t.symbol)) return false
      seen.add(t.symbol)
      return true
    })
  }, [chainTokens])

  const selectedToken = buyTokens.find((t) => t.symbol === selectedCrypto) ?? buyTokens[0]

  useEffect(() => {
    if (buyTokens.length > 0 && !buyTokens.some((t) => t.symbol === selectedCrypto)) {
      setSelectedCrypto(buyTokens[0].symbol)
    }
  }, [buyTokens, selectedCrypto])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tokenDropdownRef.current && !tokenDropdownRef.current.contains(e.target as Node)) {
        setTokenDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAmountChange = (value: string) => {
    const sanitized = value.replace(/[^0-9.]/g, '')
    const parts = sanitized.split('.')
    if (parts.length > 2) return
    if (parts[1]?.length > 2) return
    setFiatAmount(sanitized)
  }

  const displayAmount = fiatAmount === '' ? '0' : fiatAmount
  const hasAmount = fiatAmount !== '' && parseFloat(fiatAmount) > 0

  // "Complete transaction with Binance" view when user clicks Continue (same style as Coinbase step, no Get help)
  if (showBinanceStep) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" aria-hidden onClick={onClose} />
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <button
              type="button"
              onClick={() => setShowBinanceStep(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-auto"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="p-6 sm:p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden bg-blue-100 shrink-0">
                <Image
                  src="/icons/binance-svgrepo-com.svg"
                  alt="Binance"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain [filter:invert(27%)_sepia(98%)_saturate(1000%)_hue-rotate(210deg)]"
                />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Complete transaction with Binance</h2>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              Go to the Binance tab to continue. It&apos;s safe to close this modal now.
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              By continuing, you acknowledge that you&apos;ll be subject to the Terms of Service and Privacy Policy with Binance, as applicable.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // "Complete sell with Binance" view when user clicks Continue on Sell tab (user knows they're selling)
  if (showBinanceSellStep) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" aria-hidden onClick={onClose} />
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <button
              type="button"
              onClick={() => setShowBinanceSellStep(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-auto"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="p-6 sm:p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden bg-blue-100 shrink-0">
                <Image
                  src="/icons/binance-svgrepo-com.svg"
                  alt="Binance"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain [filter:invert(27%)_sepia(98%)_saturate(1000%)_hue-rotate(210deg)]"
                />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Complete sell with Binance</h2>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              You&apos;re selling crypto for fiat. Go to the Binance tab to continue. It&apos;s safe to close this modal now.
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              By continuing, you acknowledge that you&apos;ll be subject to the Terms of Service and Privacy Policy with Binance, as applicable.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" aria-hidden onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-visible">
        <div className="flex items-center justify-end p-3 border-b border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tabs: Swap | Buy | Sell only */}
        <div className="flex border-b border-gray-200">
          {(['swap', 'buy', 'sell'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setPanelTab(tab)}
              className={`flex-1 py-3 px-4 text-sm font-semibold capitalize transition-colors ${
                panelTab === tab
                  ? 'bg-gray-100 text-gray-900 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="p-5">
          {panelTab === 'buy' && (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">You&apos;re buying</span>
                <button
                  type="button"
                  className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 rounded-lg px-2 py-1 hover:bg-gray-100"
                >
                  <span className="font-medium">{currencyLabel}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <div className="mb-4">
                <label htmlFor="buy-fiat-amount" className="sr-only">
                  Amount in USD
                </label>
                <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                  <span className="text-2xl sm:text-3xl font-semibold text-gray-900 tabular-nums">$</span>
                  <input
                    id="buy-fiat-amount"
                    type="text"
                    inputMode="decimal"
                    placeholder="0"
                    value={fiatAmount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="flex-1 min-w-0 text-2xl sm:text-3xl font-semibold text-gray-900 bg-transparent border-none outline-none tabular-nums placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div className="flex gap-2 mb-5">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setFiatAmount(amt)}
                    className="flex-1 py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition-colors"
                  >
                    ${amt}
                  </button>
                ))}
              </div>
              <div className="relative" ref={tokenDropdownRef}>
                <button
                  type="button"
                  onClick={() => setTokenDropdownOpen((o) => !o)}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-100/50 transition-colors mb-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden shrink-0">
                      <Image
                        src={getTokenIconPath(selectedToken?.symbol ?? selectedCrypto)}
                        alt=""
                        width={20}
                        height={20}
                        className="rounded-full object-contain"
                      />
                    </div>
                    <span className="font-semibold text-gray-900">{selectedToken?.symbol ?? selectedCrypto}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${tokenDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {tokenDropdownOpen && buyTokens.length > 0 && (
                  <div className="absolute left-0 right-0 bottom-full z-10 mb-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-hidden flex flex-col">
                    <p className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-100 shrink-0">
                      Select a token
                    </p>
                    <div className="overflow-auto py-1">
                    {buyTokens.map((token) => (
                      <button
                        key={`${token.chainId}-${token.symbol}-${token.address}`}
                        type="button"
                        onClick={() => {
                          setSelectedCrypto(token.symbol)
                          setTokenDropdownOpen(false)
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-left transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden shrink-0">
                          <Image
                            src={getTokenIconPath(token.symbol)}
                            alt=""
                            width={20}
                            height={20}
                            className="rounded-full object-contain"
                          />
                        </div>
                        <span className="font-semibold text-gray-900">{token.symbol}</span>
                        <span className="text-xs text-gray-500">{token.name}</span>
                      </button>
                    ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (hasAmount) {
                    window.open(BINANCE_BUY_URL, '_blank', 'noopener,noreferrer')
                    setShowBinanceStep(true)
                  }
                }}
                className={`w-full py-3 px-4 rounded-xl font-medium text-sm transition-colors ${
                  hasAmount
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {hasAmount ? 'Continue' : 'Enter an amount'}
              </button>
            </>
          )}

          {panelTab === 'swap' && (
            <div className="py-6 text-center">
              <p className="text-gray-600 text-sm mb-4">Swap tokens on this DEX.</p>
              <Link
                href="/swap"
                onClick={onClose}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Go to Swap
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {panelTab === 'sell' && (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">You&apos;re selling</span>
                <button
                  type="button"
                  className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900 rounded-lg px-2 py-1 hover:bg-gray-100"
                >
                  <span className="font-medium">{currencyLabel}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
              <div className="mb-4">
                <label htmlFor="sell-fiat-amount" className="sr-only">
                  Amount in USD
                </label>
                <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-3 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                  <span className="text-2xl sm:text-3xl font-semibold text-gray-900 tabular-nums">$</span>
                  <input
                    id="sell-fiat-amount"
                    type="text"
                    inputMode="decimal"
                    placeholder="0"
                    value={fiatAmount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    className="flex-1 min-w-0 text-2xl sm:text-3xl font-semibold text-gray-900 bg-transparent border-none outline-none tabular-nums placeholder:text-gray-400"
                  />
                </div>
              </div>
              <div className="flex gap-2 mb-5">
                {quickAmounts.map((amt) => (
                  <button
                    key={`sell-${amt}`}
                    type="button"
                    onClick={() => setFiatAmount(amt)}
                    className="flex-1 py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 transition-colors"
                  >
                    ${amt}
                  </button>
                ))}
              </div>
              <div className="relative" ref={tokenDropdownRef}>
                <button
                  type="button"
                  onClick={() => setTokenDropdownOpen((o) => !o)}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-100/50 transition-colors mb-4"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden shrink-0">
                      <Image
                        src={getTokenIconPath(selectedToken?.symbol ?? selectedCrypto)}
                        alt=""
                        width={20}
                        height={20}
                        className="rounded-full object-contain"
                      />
                    </div>
                    <span className="font-semibold text-gray-900">{selectedToken?.symbol ?? selectedCrypto}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${tokenDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {tokenDropdownOpen && buyTokens.length > 0 && (
                  <div className="absolute left-0 right-0 bottom-full z-10 mb-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-56 overflow-hidden flex flex-col">
                    <p className="px-4 py-3 text-sm font-semibold text-gray-900 border-b border-gray-100 shrink-0">
                      Select a token
                    </p>
                    <div className="overflow-auto py-1">
                    {buyTokens.map((token) => (
                      <button
                        key={`sell-token-${token.chainId}-${token.symbol}-${token.address}`}
                        type="button"
                        onClick={() => {
                          setSelectedCrypto(token.symbol)
                          setTokenDropdownOpen(false)
                        }}
                        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-50 text-left transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden shrink-0">
                          <Image
                            src={getTokenIconPath(token.symbol)}
                            alt=""
                            width={20}
                            height={20}
                            className="rounded-full object-contain"
                          />
                        </div>
                        <span className="font-semibold text-gray-900">{token.symbol}</span>
                        <span className="text-xs text-gray-500">{token.name}</span>
                      </button>
                    ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (hasAmount) {
                    window.open(BINANCE_SELL_URL, '_blank', 'noopener,noreferrer')
                    setShowBinanceSellStep(true)
                  }
                }}
                className={`w-full py-3 px-4 rounded-xl font-medium text-sm transition-colors ${
                  hasAmount
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {hasAmount ? 'Continue' : 'Enter an amount'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Receive crypto modal: title, description, address block (copy + QR). Clicking QR opens "Ethereum Address" view. No Get help.
function ReceiveCryptoPanel({
  address,
  currentChain,
  onClose,
}: {
  address: string
  currentChain: { name?: string } | undefined
  onClose: () => void
}) {
  const [copied, setCopied] = useState(false)
  const [showQrDetailView, setShowQrDetailView] = useState(false)
  const truncated = `${address.slice(0, 6)}...${address.slice(-4)}`
  const networkLabel = currentChain?.name ? `${currentChain.name}` : 'Ethereum'
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&color=2563eb&bgcolor=FFFFFF&data=${encodeURIComponent(address)}`

  const handleCopy = () => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // "Ethereum Address" view when user clicks QR: back arrow, title, QR, address box. No Get help, no "Use this address on 16 networks".
  if (showQrDetailView) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          aria-hidden
          onClick={() => setShowQrDetailView(false)}
        />
        <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-4 py-4 sm:px-5 sm:py-5 border-b border-gray-100">
            <button
              type="button"
              onClick={() => setShowQrDetailView(false)}
              className="p-2.5 -ml-1 hover:bg-gray-100 rounded-xl transition-colors justify-self-start"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 text-center truncate">
              Ethereum Address
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors justify-self-end"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <img
                  src={qrUrl}
                  alt="QR code for Ethereum address"
                  className="w-52 h-52 sm:w-60 sm:h-60 rounded-xl"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Ethereum address</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="p-2.5 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors shrink-0"
                  aria-label="Copy address"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <p className="font-mono text-sm sm:text-base text-gray-900 break-all leading-relaxed">
                {address}
              </p>
            </div>
            {copied && (
              <p className="text-sm text-green-600 text-center mt-4 font-medium">Address copied!</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" aria-hidden onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-end p-3 border-b border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-1">Receive crypto</h2>
          <p className="text-sm text-gray-600 text-center mb-6">
            Fund your wallet by transferring crypto from another wallet or account
          </p>

          <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50/50 mb-5">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
              <WalletIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-mono font-semibold text-gray-900 truncate">{truncated}</p>
              <p className="text-xs text-gray-500 mt-0.5">{networkLabel}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={handleCopy}
                className="p-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                aria-label="Copy address"
              >
                <Copy className="w-4 h-4 text-gray-700" />
              </button>
              <button
                type="button"
                onClick={() => setShowQrDetailView(true)}
                className="p-2.5 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                aria-label="Show QR code"
              >
                <QrCode className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>
          {copied && (
            <p className="text-xs text-green-600 text-center -mt-3 mb-2">Address copied!</p>
          )}
        </div>
      </div>
    </div>
  )
}

// Transfer modal: initial view (Transfer + Coinbase option). Clicking Coinbase shows "Complete transaction with Coinbase". Back arrow, no Get help.
function TransferPanel({ onClose }: { onClose: () => void }) {
  const [showCoinbaseStep, setShowCoinbaseStep] = useState(false)

  if (showCoinbaseStep) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" aria-hidden onClick={onClose} />
        <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <button
              type="button"
              onClick={() => setShowCoinbaseStep(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-auto"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="p-6 sm:p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden bg-gray-100 shrink-0">
                <Image
                  src="/icons/coinbase-v2-svgrepo-com.svg"
                  alt="Coinbase"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain"
                />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Complete transaction with Coinbase</h2>
            <p className="text-sm text-gray-600 mb-8 leading-relaxed">
              Go to the Coinbase tab to continue. It&apos;s safe to close this modal now.
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              By continuing, you acknowledge that you&apos;ll be subject to the Terms of Service and Privacy Policy with Coinbase, as applicable.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" aria-hidden onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-end p-3 border-b border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">Transfer</h2>
          <p className="text-sm text-gray-600 mb-6 text-center">Move funds from a trading platform.</p>

          <button
            type="button"
            onClick={() => {
              window.open(
                'https://pay.coinbase.com/landing?defaultExperience=send&partnerUserId=e8f9c752-14f3-4975-8ba5-49906a4e9d7e&redirectUrl=https%3A%2F%2Fapp.uniswap.org%2Fbuy&sessionToken=MWYxMGZjNDAtOGFkNS02MmFlLWJkN2UtNWU4M2E3YWU3ZDMx',
                '_blank',
                'noopener,noreferrer'
              )
              setShowCoinbaseStep(true)
            }}
            className="w-full flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-left"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-gray-100">
              <Image
                src="/icons/coinbase-v2-svgrepo-com.svg"
                alt="Coinbase"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
              />
            </div>
            <span className="font-semibold text-gray-900">Coinbase</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Demo Wallet Component (shows when not connected)
function DemoWallet() {
  const demoAddress = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
  const demoTokens = [
    { symbol: 'ETH', name: 'Ethereum', balance: '0.033', value: 64.02 },
    { symbol: 'MATIC', name: 'Polygon', balance: '12.80', value: 6.40 },
    { symbol: 'USDC', name: 'USD Coin', balance: '8.39', value: 8.39 },
    { symbol: 'USDT', name: 'Tether USD', balance: '4.00', value: 4.00 },
  ]
  const demoTotal = demoTokens.reduce((sum, t) => sum + t.value, 0)
  const demoActivity = [
    { text: 'Received ETH', date: 'Today' },
    { text: 'Swapped USDC', date: 'Yesterday' },
    { text: 'Bridged MATIC', date: '2d ago' },
  ]

  return (
    <div className="max-w-5xl mx-auto w-full">
      <div className="bg-white/60 backdrop-blur border border-blue-100 rounded-2xl sm:rounded-3xl shadow-md overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-blue-100 bg-white/70">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm sm:text-base">Demo wallet</p>
                <code className="text-xs sm:text-sm text-gray-600 truncate block">{demoAddress.slice(0, 10)}...{demoAddress.slice(-4)}</code>
              </div>
            </div>
            <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">All networks</span>
          </div>
        </div>

        <div className="p-4 sm:p-6 md:p-8">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">Portfolio value</p>
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 tabular-nums">${demoTotal.toFixed(2)}</h3>
              <div className="flex items-center gap-2 mt-1 mb-4">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs sm:text-sm font-semibold text-green-600">+$0.53 (0.20%)</span>
              </div>
              <LivePriceChart symbol="ETH" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Actions</h4>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
                <button className="p-3 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors text-center flex flex-col items-center justify-center">
                  <Send className="w-6 h-6 text-blue-600 mb-1" />
                  <p className="text-xs font-semibold text-blue-900">Send</p>
                </button>
                <button className="p-3 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors text-center flex flex-col items-center justify-center">
                  <Download className="w-6 h-6 text-blue-600 mb-1" />
                  <p className="text-xs font-semibold text-blue-900">Receive</p>
                </button>
                <button className="p-3 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors text-center flex flex-col items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600 mb-1" />
                  <p className="text-xs font-semibold text-blue-900">Buy</p>
                </button>
                <button className="p-3 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors text-center flex flex-col items-center justify-center">
                  <MoreHorizontal className="w-6 h-6 text-blue-600 mb-1" />
                  <p className="text-xs font-semibold text-blue-900">More</p>
                </button>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Tracked tokens</p>
                <p className="text-lg font-semibold text-gray-900">{demoTokens.length}</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mt-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Tokens</h4>
              <div className="space-y-2">
                {demoTokens.map((token, index) => (
                  <div key={index} className="flex items-center justify-between gap-3 p-3 bg-gray-50/70 rounded-xl border border-gray-200">
                    <div className="flex items-center gap-2 min-w-0">
                      <Image src={getTokenIconPath(token.symbol)} alt={`${token.symbol} logo`} width={24} height={24} className="w-6 h-6 rounded-full object-contain" />
                      <div className="min-w-0">
                        <p className="font-semibold text-sm text-gray-900">{token.symbol}</p>
                        <p className="text-xs text-gray-600">{token.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-sm text-gray-900 tabular-nums">{token.balance} {token.symbol}</p>
                      <p className="text-xs text-gray-600 tabular-nums">${token.value.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Recent activity</h4>
              <div className="space-y-2">
                {demoActivity.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50/70 rounded-xl border border-gray-200">
                    <p className="text-sm font-medium text-gray-800">{item.text}</p>
                    <span className="text-xs text-gray-500">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-xl text-center">
            <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
              <span className="font-semibold">Demo mode:</span> connect wallet to fetch live balances for your address.
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
  onOpenBuyPanel,
  onOpenReceivePanel,
  onOpenTransferPanel,
}: {
  address: string
  chainId: number
  chainTokens: Token[]
  currentChain: any
  onOpenBuyPanel?: () => void
  onOpenReceivePanel?: () => void
  onOpenTransferPanel?: () => void
}) {
  const { data: nativeBalance } = useBalance({ address: address as `0x${string}` })
  const tokenBalances = useMultipleTokenBalances(chainTokens, address)
  const prices = useTokenPrices()
  const nativeSymbol = currentChain?.nativeCurrency?.symbol ?? 'ETH'
  const nativeTokenData = tokenBalances.find((tb) => tb.token.symbol === nativeSymbol)
  const totalValue = useMemo(() => {
    return tokenBalances.reduce((sum, tb) => sum + Number(tb.balanceUsd), 0)
  }, [tokenBalances])

  return (
    <div className="grid lg:grid-cols-3 gap-8 sm:gap-10">
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

        <LivePriceChart symbol={nativeSymbol} />

        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm sm:text-base font-semibold text-gray-700">Tracked tokens</h4>
            <span className="text-xs text-blue-700 bg-blue-100 rounded-full px-2 py-1">{chainTokens.length} tokens</span>
          </div>
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <div className="hidden sm:grid sm:grid-cols-[1.8fr_1fr_1fr_1.1fr] gap-4 px-4 md:px-6 py-3 bg-gray-50 text-xs font-semibold text-gray-700">
              <div className="text-left">Token</div>
              <div className="text-center">Price</div>
              <div className="text-center">Balance</div>
              <div className="text-center">Value</div>
            </div>
            <div className="divide-y divide-gray-200">
              {chainTokens.map((token) => (
                <RealTokenRow
                  key={token.address}
                  token={token}
                  address={address}
                  price={prices[token.symbol] ?? 0}
                  blockExplorer={currentChain?.blockExplorers?.default}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Real Native Balance */}
        <div className="mt-6 p-5 sm:p-7 bg-blue-50 rounded-xl sm:rounded-2xl border border-blue-200">
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
                ${Number(nativeTokenData?.balanceUsd ?? 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Quick Actions */}
      <div>
        <h4 className="text-sm sm:text-base font-semibold text-gray-700 mb-3 sm:mb-4">Quick Actions</h4>
        <div className="space-y-3 mb-5 sm:mb-8">
          <button
            type="button"
            onClick={onOpenBuyPanel}
            className="w-full p-4 bg-blue-50 hover:bg-blue-100 rounded-xl sm:rounded-2xl border border-blue-200 transition-colors text-left"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Landmark className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900">Buy crypto</p>
                <p className="text-xs text-blue-700/80">Purchase with a debit card or bank account.</p>
              </div>
            </div>
          </button>
          <button
            type="button"
            onClick={onOpenReceivePanel}
            className="w-full p-4 bg-blue-50 hover:bg-blue-100 rounded-xl sm:rounded-2xl border border-blue-200 transition-colors text-left"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <ArrowDownCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900">Receive crypto</p>
                <p className="text-xs text-blue-700/80">Move funds from another wallet.</p>
              </div>
            </div>
          </button>
          <button
            type="button"
            onClick={onOpenTransferPanel}
            className="w-full p-4 bg-blue-50 hover:bg-blue-100 rounded-xl sm:rounded-2xl border border-blue-200 transition-colors text-left"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <ArrowRightLeft className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900">Transfer</p>
                <p className="text-xs text-blue-700/80">Move funds from a trading platform.</p>
              </div>
            </div>
          </button>
        </div>

        {/* Network Info */}
        <div className="p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl border border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Connected to</p>
          <p className="text-base sm:text-lg font-semibold text-gray-900">{currentChain?.name}</p>
          <p className="text-xs text-gray-500 mt-1">Chain ID: {chainId}</p>
          <a
            href={`${currentChain?.blockExplorers?.default?.url}/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-3 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            View address on explorer
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

        <div className="mt-3 p-3 sm:p-4 bg-white border border-gray-200 rounded-xl sm:rounded-2xl">
          <p className="text-xs sm:text-sm text-gray-600 mb-2">Address bound data</p>
          <p className="text-sm font-bold text-blue-700 break-all">{address}</p>
          <p className="text-xs text-gray-500 mt-1">
            Balances are fetched live for this connected address only.
          </p>
        </div>
      </div>
    </div>
  )
}

function LivePriceChart({ symbol }: { symbol: string }) {
  const [points, setPoints] = useState<Array<{ t: number; p: number }>>([])

  useEffect(() => {
    let cancelled = false
    const fetchChart = async () => {
      try {
        const res = await fetch(`/api/prices/history?symbol=${symbol}&days=1`)
        const data = await res.json()
        if (!cancelled && Array.isArray(data.points)) {
          setPoints(data.points)
        }
      } catch {
        if (!cancelled) setPoints([])
      }
    }
    fetchChart()
    const id = setInterval(fetchChart, 60_000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [symbol])

  const chartData = points.length > 0 ? points : [{ t: 0, p: 0 }, { t: 1, p: 0 }]
  const min = Math.min(...chartData.map((d) => d.p))
  const max = Math.max(...chartData.map((d) => d.p))
  const range = max - min || 1

  const coords = chartData
    .map((d, i) => {
      const x = (i / (chartData.length - 1 || 1)) * 100
      const y = 100 - ((d.p - min) / range) * 100
      return `${x},${y}`
    })
    .join(' ')

  const start = chartData[0]?.p ?? 0
  const end = chartData[chartData.length - 1]?.p ?? 0
  const changePct = start > 0 ? ((end - start) / start) * 100 : 0
  const positive = changePct >= 0

  return (
    <div className="mb-5 sm:mb-8 p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-xl sm:rounded-2xl border border-blue-200">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs sm:text-sm font-semibold text-gray-700">{symbol} 24h</p>
        <p className={`text-xs sm:text-sm font-semibold ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {positive ? '+' : ''}{changePct.toFixed(2)}%
        </p>
      </div>
      <div className="h-32 sm:h-40 md:h-44">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
          <polyline
            fill="none"
            stroke={positive ? '#16a34a' : '#dc2626'}
            strokeWidth="2.5"
            points={coords}
          />
        </svg>
      </div>
      {points.length === 0 && (
        <p className="text-[11px] sm:text-xs text-gray-500 mt-1">Waiting for live chart data...</p>
      )}
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
  const prices = useTokenPrices()

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
        <div className="hidden sm:grid sm:grid-cols-[1.8fr_1fr_1fr_1.1fr] gap-4 px-4 md:px-6 py-3 md:py-4 bg-gray-50 text-xs md:text-sm font-semibold text-gray-700">
          <div className="text-left">Token</div>
          <div className="text-center">Price</div>
          <div className="text-center">Balance</div>
          <div className="text-center">Value</div>
        </div>

        <div className="divide-y divide-gray-200">
          {chainTokens.map((token) => (
            <RealTokenRow
              key={token.address}
              token={token}
              address={address}
              price={prices[token.symbol] ?? 0}
              blockExplorer={currentChain?.blockExplorers?.default}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Real Token Row - fetches actual balance and live price
function RealTokenRow({
  token,
  address,
  price,
  blockExplorer,
}: {
  token: Token
  address: string
  price: number
  blockExplorer?: any
}) {
  const { balance, balanceUsd, isLoading } = useTokenBalance(token, address, price)
  const priceStr = price >= 1 ? price.toFixed(2) : price.toFixed(4)

  return (
    <div className="flex flex-col sm:grid sm:grid-cols-[1.8fr_1fr_1fr_1.1fr] gap-2 sm:gap-4 px-4 md:px-6 py-3 sm:py-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
          <Image
            src={getTokenIconPath(token.symbol)}
            alt={`${token.symbol} logo`}
            width={24}
            height={24}
            className="w-5 h-5 sm:w-6 sm:h-6 rounded-full object-contain"
          />
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 text-sm sm:text-base">{token.symbol}</p>
          <p className="text-xs sm:text-sm text-gray-600">{token.name}</p>
        </div>
      </div>
      <div className="flex justify-between sm:justify-center sm:text-center text-sm">
        <span className="sm:hidden text-gray-500">Price</span>
        <p className="font-semibold text-gray-900">${priceStr}</p>
      </div>
      <div className="flex justify-between sm:justify-center sm:text-center text-sm">
        <span className="sm:hidden text-gray-500">Balance</span>
        <p className="font-semibold text-gray-900 tabular-nums">{isLoading ? '...' : balance}</p>
      </div>
      <div className="flex justify-between sm:justify-center items-center gap-2 text-sm">
        <span className="sm:hidden text-gray-500">Value</span>
        <div className="flex items-center sm:justify-center gap-2 min-w-[92px]">
          <p className="font-semibold text-gray-900 tabular-nums text-center min-w-[56px]">${balanceUsd}</p>
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