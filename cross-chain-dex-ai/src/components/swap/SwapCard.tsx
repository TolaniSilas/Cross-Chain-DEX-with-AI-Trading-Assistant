'use client'

import { useState, useMemo } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { ArrowDownUp, Settings, AlertCircle } from 'lucide-react'
import { getTokensByChain, type Token } from '@/config/tokens'
import { supportedChains } from '@/config/chains'

export default function SwapCard() {
  const { isConnected } = useAccount()
  const chainId = useChainId()

  const [fromToken, setFromToken] = useState<Token | null>(null)
  const [toToken, setToToken] = useState<Token | null>(null)
  const [fromAmount, setFromAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [slippage, setSlippage] = useState('0.5')
  const [showSettings, setShowSettings] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const availableTokens = useMemo(() => {
    return chainId ? getTokensByChain(chainId) : []
  }, [chainId])

  const currentChain = useMemo(() => {
    return supportedChains.find(c => c.id === chainId)
  }, [chainId])

  // Simulate price calculation (in real app, use DEX API)
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value)
    if (value && fromToken && toToken) {
      // Simple 1:1 ratio for demo
      setToAmount(value)
    } else {
      setToAmount('')
    }
  }

  const handleSwapTokens = () => {
    setFromToken(toToken)
    setToToken(fromToken)
    setFromAmount(toAmount)
    setToAmount(fromAmount)
  }

  const handleSwap = async () => {
    if (!isConnected) {
      alert('Please connect your wallet')
      return
    }

    if (!fromToken || !toToken || !fromAmount) {
      alert('Please fill in all fields')
      return
    }

    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert(`Swap successful!\n${fromAmount} ${fromToken.symbol} → ${toAmount} ${toToken.symbol}`)
      setFromAmount('')
      setToAmount('')
    } catch {
      alert('Swap failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-3xl shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Swap</h2>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Slippage Tolerance
            </label>
            <div className="flex gap-2">
              {['0.1', '0.5', '1.0'].map(value => (
                <button
                  key={value}
                  onClick={() => setSlippage(value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    slippage === value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  {value}%
                </button>
              ))}
              <input
                type="number"
                value={slippage}
                onChange={e => setSlippage(e.target.value)}
                placeholder="Custom"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
          </div>
        )}

        {/* Current Chain Info */}
        {currentChain && (
          <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-2xl text-sm text-blue-700">
            Trading on <span className="font-semibold">{currentChain.name}</span>
          </div>
        )}

        {/* From Token */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">From</label>
          <div className="flex gap-3">
            <input
              type="number"
              value={fromAmount}
              onChange={e => handleFromAmountChange(e.target.value)}
              placeholder="0"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 text-lg font-semibold"
            />
            <select
              value={fromToken?.address || ''}
              onChange={e => {
                const token = availableTokens.find(t => t.address === e.target.value)
                setFromToken(token || null)
              }}
              className="px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-semibold bg-white cursor-pointer"
            >
              <option value="">Select token</option>
              {availableTokens.map(token => (
                <option key={token.address} value={token.address}>
                  {token.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleSwapTokens}
            disabled={!fromToken || !toToken}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Swap tokens"
          >
            <ArrowDownUp className="w-6 h-6 text-blue-600" />
          </button>
        </div>

        {/* To Token */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
          <div className="flex gap-3">
            <input
              type="number"
              value={toAmount}
              readOnly
              placeholder="0"
              className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl bg-gray-50 text-lg font-semibold text-gray-600"
            />
            <select
              value={toToken?.address || ''}
              onChange={e => {
                const token = availableTokens.find(t => t.address === e.target.value)
                setToToken(token || null)
              }}
              className="px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-semibold bg-white cursor-pointer"
            >
              <option value="">Select token</option>
              {availableTokens.map(token => (
                <option key={token.address} value={token.address}>
                  {token.symbol}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price Info */}
        {fromToken && toToken && fromAmount && (
          <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Price</span>
              <span className="font-semibold text-gray-900">1 {fromToken.symbol} = 1 {toToken.symbol}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Slippage</span>
              <span className="font-semibold text-gray-900">{slippage}%</span>
            </div>
          </div>
        )}

        {/* Warning if not connected */}
        {!isConnected && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">Connect your wallet to start trading</p>
          </div>
        )}

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={!isConnected || !fromToken || !toToken || !fromAmount || isLoading}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
            isConnected && fromToken && toToken && fromAmount && !isLoading
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isLoading ? 'Swapping...' : 'Swap'}
        </button>
      </div>
    </div>
  )
}
