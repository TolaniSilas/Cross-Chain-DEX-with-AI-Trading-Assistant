'use client'

import { useState, useMemo } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { Settings, AlertCircle, Send } from 'lucide-react'
import { getTokensByChain, type Token } from '@/config/tokens'
import { supportedChains } from '@/config/chains'

export default function BridgeCard() {
  const { isConnected } = useAccount()
  const chainId = useChainId()

  const [fromChainId, setFromChainId] = useState<number | null>(chainId || null)
  const [toChainId, setToChainId] = useState<number | null>(null)
  const [token, setToken] = useState<Token | null>(null)
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [bridgeFee, setBridgeFee] = useState('0.5')
  const [isLoading, setIsLoading] = useState(false)

  const fromChain = useMemo(() => {
    return supportedChains.find(c => c.id === fromChainId)
  }, [fromChainId])

  const toChain = useMemo(() => {
    return supportedChains.find(c => c.id === toChainId)
  }, [toChainId])

  const availableTokens = useMemo(() => {
    return fromChainId ? getTokensByChain(fromChainId) : []
  }, [fromChainId])

  const availableToChains = useMemo(() => {
    return supportedChains.filter(c => c.id !== fromChainId)
  }, [fromChainId])

  const handleBridge = async () => {
    if (!isConnected) {
      alert('Please connect your wallet')
      return
    }

    if (!fromChain || !toChain || !token || !amount || !recipient) {
      alert('Please fill in all fields')
      return
    }

    setIsLoading(true)
    try {
      // Simulate bridge transaction
      await new Promise(resolve => setTimeout(resolve, 3000))
      alert(
        `Bridge initiated!\n\n${amount} ${token.symbol}\n${fromChain.name} → ${toChain.name}\n\nRecipient: ${recipient.slice(0, 6)}...${recipient.slice(-4)}`
      )
      setAmount('')
      setRecipient('')
    } catch {
      alert('Bridge failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-3xl shadow-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Bridge</h2>
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
              Bridge Fee
            </label>
            <div className="flex gap-2">
              {['0.1', '0.5', '1.0'].map(value => (
                <button
                  key={value}
                  onClick={() => setBridgeFee(value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    bridgeFee === value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  {value}%
                </button>
              ))}
            </div>
          </div>
        )}

        {/* From Chain */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">From Chain</label>
          <select
            value={fromChainId || ''}
            onChange={e => {
              setFromChainId(Number(e.target.value))
              setToken(null)
            }}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-semibold bg-white cursor-pointer"
          >
            <option value="">Select chain</option>
            {supportedChains.map(chain => (
              <option key={chain.id} value={chain.id}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>

        {/* To Chain */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">To Chain</label>
          <select
            value={toChainId || ''}
            onChange={e => setToChainId(Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-semibold bg-white cursor-pointer"
            disabled={!fromChainId}
          >
            <option value="">Select destination chain</option>
            {availableToChains.map(chain => (
              <option key={chain.id} value={chain.id}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>

        {/* Token */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Token</label>
          <select
            value={token?.address || ''}
            onChange={e => {
              const selectedToken = availableTokens.find(t => t.address === e.target.value)
              setToken(selectedToken || null)
            }}
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-semibold bg-white cursor-pointer"
            disabled={!fromChainId}
          >
            <option value="">Select token</option>
            {availableTokens.map(t => (
              <option key={t.address} value={t.address}>
                {t.symbol} - {t.name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0"
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 text-lg font-semibold"
          />
        </div>

        {/* Recipient */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">Leave empty to use your wallet address</p>
        </div>

        {/* Bridge Info */}
        {fromChain && toChain && amount && token && (
          <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-600">Route</span>
              <span className="font-semibold text-gray-900">
                {fromChain.name} → {toChain.name}
              </span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-600">Amount</span>
              <span className="font-semibold text-gray-900">{amount} {token.symbol}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Bridge Fee</span>
              <span className="font-semibold text-gray-900">{bridgeFee}%</span>
            </div>
          </div>
        )}

        {/* Warning if not connected */}
        {!isConnected && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">Connect your wallet to start bridging</p>
          </div>
        )}

        {/* Bridge Button */}
        <button
          onClick={handleBridge}
          disabled={!isConnected || !fromChainId || !toChainId || !token || !amount || isLoading}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
            isConnected && fromChainId && toChainId && token && amount && !isLoading
              ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Send className="w-5 h-5" />
          {isLoading ? 'Bridging...' : 'Bridge'}
        </button>
      </div>
    </div>
  )
}
