'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { Copy, ExternalLink, Wallet as WalletIcon, Lightbulb } from 'lucide-react'
import { supportedChains } from '@/config/chains'
import { getTokensByChain, type Token } from '@/config/tokens'

export default function WalletCard() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const [copiedAddress, setCopiedAddress] = useState(false)

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

  if (!isConnected || !address) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-3xl shadow-lg p-12 text-center">
          <WalletIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Wallet Connected</h2>
          <p className="text-gray-600">
            Connect your wallet using the button in the header to view your portfolio
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-3xl shadow-lg p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <WalletIcon className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Portfolio</h2>
        </div>

        {/* Wallet Info */}
        <div className="mb-6 p-4 bg-linear-to-r from-blue-50 to-blue-100/50 border border-blue-200 rounded-2xl">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm text-gray-600 mb-1">Wallet Address</p>
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono text-gray-900 bg-white/50 px-3 py-2 rounded-lg">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </code>
                <button
                  onClick={handleCopyAddress}
                  className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                  aria-label="Copy address"
                >
                  <Copy className="w-5 h-5 text-gray-600" />
                </button>
                <a
                  href={currentChain?.blockExplorers?.default ? `${currentChain.blockExplorers.default.url}/address/${address}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                  aria-label="View on explorer"
                >
                  <ExternalLink className="w-5 h-5 text-gray-600" />
                </a>
              </div>
              {copiedAddress && <p className="text-xs text-green-600 mt-1">✓ Copied!</p>}
            </div>

            <div>
              <p className="text-sm text-gray-600">Current Network</p>
              <p className="text-lg font-semibold text-gray-900">
                {currentChain?.name || 'Unknown Chain'}
              </p>
            </div>
          </div>
        </div>

        {/* Assets Section */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Assets on {currentChain?.name}</h3>

          {chainTokens.length > 0 ? (
            <div className="space-y-3">
              {chainTokens.map((token: Token) => (
                <AssetRow
                  key={`${token.chainId}-${token.address}`}
                  token={token}
                  chainId={chainId}
                  address={address}
                  blockExplorer={currentChain?.blockExplorers?.default}
                />
              ))}
            </div>
          ) : (
            <div className="p-6 text-center bg-gray-50 rounded-2xl border border-gray-200">
              <p className="text-gray-600">No tokens available on this chain</p>
            </div>
          )}
        </div>

        {/* Network Switch Info */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl flex gap-3">
          <Lightbulb className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Tip:</span> Switch networks in your wallet to see assets on different chains
          </p>
        </div>
      </div>
    </div>
  )
}

interface AssetRowProps {
  token: Token
  chainId: number
  address: string
  blockExplorer?: { name: string; url: string }
}

function AssetRow({ token, blockExplorer }: AssetRowProps) {
  const [balance, setBalance] = useState('0.00')

  // Initialize balance on mount
  useEffect(() => {
    const randomValue = Math.random() * 100
    const timeout = setTimeout(() => {
      setBalance(randomValue.toFixed(2))
    }, 800)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-2xl hover:bg-gray-100 transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold text-blue-600">{token.symbol[0]}</span>
          </div>
          <div>
            <p className="font-semibold text-gray-900">{token.symbol}</p>
            <p className="text-xs text-gray-600">{token.name}</p>
          </div>
        </div>
      </div>

      <div className="text-right">
        <div className="flex items-center gap-2">
          <div>
            <p className="font-semibold text-gray-900">{balance}</p>
            <p className="text-xs text-gray-600">${(Number(balance) * 1.2).toFixed(2)} USD</p>
          </div>
          {blockExplorer && (
            <a
              href={`${blockExplorer.url}/token/${token.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-white rounded-lg transition-colors ml-2"
              aria-label="View on explorer"
            >
              <ExternalLink className="w-4 h-4 text-gray-500" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
