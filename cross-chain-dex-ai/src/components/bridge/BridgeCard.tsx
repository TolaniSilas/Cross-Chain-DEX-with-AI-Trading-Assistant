'use client'

import { useState, useMemo, useEffect } from 'react'
import { useAccount, useChainId, useWalletClient } from 'wagmi'
import { Settings, AlertCircle, Send } from 'lucide-react'
import { getTokensByChain, getTokenBySymbolAndChain, type Token } from '@/config/tokens'
import { supportedChains } from '@/config/chains'
import ChainSelector from './ChainSelector'
import TokenSelector from '@/components/swap/TokenSelector'
import { useToast } from '@/hooks/ToastContext'
import { validateAmount, validateAddress } from '@/lib/validation'

export default function BridgeCard() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { data: walletClient } = useWalletClient()
  const { addToast } = useToast()

  const [fromChainId, setFromChainId] = useState<number | null>(chainId || null)
  const [toChainId, setToChainId] = useState<number | null>(null)
  const [token, setToken] = useState<Token | null>(null)
  const [amount, setAmount] = useState('')
  const [recipient, setRecipient] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [bridgeFee, setBridgeFee] = useState('0.5')
  const [isLoading, setIsLoading] = useState(false)
  const [amountError, setAmountError] = useState<string | null>(null)
  const [recipientError, setRecipientError] = useState<string | null>(null)
  const [quoteInfo, setQuoteInfo] = useState<{ toAmount?: string; fee?: string } | null>(null)

  const fromChain = useMemo(() => supportedChains.find(c => c.id === fromChainId), [fromChainId])
  const toChain = useMemo(() => supportedChains.find(c => c.id === toChainId), [toChainId])
  const availableTokens = useMemo(() => (fromChainId ? getTokensByChain(fromChainId) : []), [fromChainId])
  const availableToChains = useMemo(() => supportedChains.filter(c => c.id !== fromChainId), [fromChainId])

  const toToken = useMemo(() => {
    if (!token || !toChainId) return null
    return getTokenBySymbolAndChain(token.symbol, toChainId) ?? null
  }, [token, toChainId])

  useEffect(() => {
    if (!fromChainId || !toChainId || !token || !amount) {
      setQuoteInfo(null)
      return
    }
    const amountRes = validateAmount(amount)
    if (!amountRes.success) {
      setQuoteInfo(null)
      return
    }
    const rec = recipient.trim() || address
    if (rec && !validateAddress(rec).success) {
      setQuoteInfo(null)
      return
    }
    let cancelled = false
    const params = new URLSearchParams({
      fromChainId: String(fromChainId),
      toChainId: String(toChainId),
      fromTokenAddress: token.address,
      toTokenAddress: toToken?.address ?? token.address,
      amount,
      ...(rec ? { recipient: rec } : {}),
    })
    fetch(`/api/bridge/quote?${params}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return
        if (data.error) {
          setQuoteInfo(null)
          return
        }
        const result = data.result ?? data
        const toAmt = result.toAmount ?? result.outputAmount
        const fee = result.fee ?? result.protocolFees
        setQuoteInfo({
          toAmount: toAmt != null ? String(toAmt) : undefined,
          fee: fee != null ? String(fee) : undefined,
        })
      })
      .catch(() => setQuoteInfo(null))
    return () => { cancelled = true }
  }, [fromChainId, toChainId, token, toToken, amount, recipient, address])

  const handleAmountChange = (value: string) => {
    setAmount(value)
    const res = validateAmount(value)
    setAmountError(res.success ? null : res.error)
  }

  const handleRecipientChange = (value: string) => {
    setRecipient(value)
    if (!value.trim()) {
      setRecipientError(null)
      return
    }
    const res = validateAddress(value)
    setRecipientError(res.success ? null : res.error)
  }

  const handleBridge = async () => {
    if (!isConnected || !address) {
      addToast({ type: 'warning', title: 'Please connect your wallet' })
      return
    }
    if (!fromChain || !toChain || !token || !amount) {
      addToast({ type: 'warning', title: 'Please fill in all fields' })
      return
    }
    const amountRes = validateAmount(amount)
    if (!amountRes.success) {
      addToast({ type: 'error', title: amountRes.error })
      return
    }
    const rec = recipient.trim() || address
    const addrRes = validateAddress(rec)
    if (!addrRes.success) {
      addToast({ type: 'error', title: addrRes.error })
      return
    }

    const toTok = getTokenBySymbolAndChain(token.symbol, toChain.id)
    if (!toTok) {
      addToast({ type: 'error', title: 'Destination token not found' })
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/bridge/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromChainId: fromChain.id,
          toChainId: toChain.id,
          fromTokenAddress: token.address,
          toTokenAddress: toTok.address,
          amount,
          recipient: addrRes.data,
          fromAddress: address,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        addToast({
          type: 'error',
          title: data.error || 'Bridge build failed',
          message: data.hint,
        })
        return
      }
      const result = data.result ?? data
      const tx = result.tx ?? result.transaction ?? result.userTxs?.[0]?.tx
      if (!tx?.data || !tx?.to) {
        addToast({
          type: 'error',
          title: 'Invalid bridge response',
          message: 'No transaction to sign',
        })
        return
      }
      if (!walletClient) {
        addToast({ type: 'error', title: 'Wallet not ready' })
        return
      }
      const hash = await walletClient.sendTransaction({
        to: tx.to as `0x${string}`,
        data: tx.data as `0x${string}`,
        value: BigInt(tx.value ?? 0),
        gas: tx.gas ? BigInt(tx.gas) : undefined,
      })
      addToast({
        type: 'success',
        title: 'Bridge initiated',
        message: `Tx: ${hash.slice(0, 10)}...`,
      })
      setAmount('')
      setRecipient('')
      setQuoteInfo(null)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Bridge failed'
      addToast({ type: 'error', title: 'Bridge failed', message: msg })
    } finally {
      setIsLoading(false)
    }
  }

  const recipientDisplay = recipient.trim() || address || ''
  const canSubmit =
    isConnected &&
    fromChainId &&
    toChainId &&
    token &&
    amount &&
    !amountError &&
    (recipientDisplay ? !recipientError : true) &&
    !isLoading

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-3xl shadow-lg p-8">
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

        {showSettings && (
          <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Bridge Fee</label>
            <div className="flex gap-2">
              {['0.1', '0.5', '1.0'].map(value => (
                <button
                  key={value}
                  onClick={() => setBridgeFee(value)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    bridgeFee === value ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'
                  }`}
                >
                  {value}%
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">From Chain</label>
          <ChainSelector
            chains={supportedChains}
            selectedChainId={fromChainId}
            onSelect={id => { setFromChainId(id); setToken(null) }}
            placeholder="Select chain"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">To Chain</label>
          <ChainSelector
            chains={availableToChains}
            selectedChainId={toChainId}
            onSelect={setToChainId}
            placeholder="Select destination chain"
            disabled={!fromChainId}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Token</label>
          <TokenSelector
            tokens={availableTokens}
            selectedToken={token}
            onSelect={setToken}
            placeholder="Select token"
            disabled={!fromChainId}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={e => handleAmountChange(e.target.value)}
            placeholder="0"
            className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-semibold ${
              amountError ? 'border-red-300 bg-red-50/50' : 'border-gray-200'
            }`}
          />
          {amountError && <p className="mt-1 text-xs text-red-600">{amountError}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={e => handleRecipientChange(e.target.value)}
            placeholder={address ? `${address.slice(0, 8)}...` : '0x...'}
            className={`w-full px-4 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm ${
              recipientError ? 'border-red-300 bg-red-50/50' : 'border-gray-200 focus:border-transparent'
            }`}
          />
          {recipientError && <p className="mt-1 text-xs text-red-600">{recipientError}</p>}
          <p className="text-xs text-gray-500 mt-1">Leave empty to use your wallet address</p>
        </div>

        {fromChain && toChain && amount && token && (
          <div className="mb-6 p-4 bg-gray-50 rounded-2xl">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-600">Route</span>
              <span className="font-semibold text-gray-900">{fromChain.name} → {toChain.name}</span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-gray-600">Amount</span>
              <span className="font-semibold text-gray-900">{amount} {token.symbol}</span>
            </div>
            {quoteInfo?.toAmount != null && (
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-600">Receive (est.)</span>
                <span className="font-semibold text-gray-900">{quoteInfo.toAmount} {toToken?.symbol ?? token.symbol}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Bridge Fee</span>
              <span className="font-semibold text-gray-900">{bridgeFee}%</span>
            </div>
          </div>
        )}

        {!isConnected && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-2xl flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">Connect your wallet to start bridging</p>
          </div>
        )}

        <button
          onClick={handleBridge}
          disabled={!canSubmit}
          className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
            canSubmit ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Send className="w-5 h-5" />
          {isLoading ? 'Bridging...' : 'Bridge'}
        </button>
      </div>
    </div>
  )
}
