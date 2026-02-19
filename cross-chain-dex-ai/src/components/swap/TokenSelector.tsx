'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import type { Token } from '@/config/tokens'

interface TokenSelectorProps {
  tokens: Token[]
  selectedToken: Token | null
  onSelect: (token: Token | null) => void
  placeholder?: string
  disabled?: boolean
  'data-testid'?: string
}

export default function TokenSelector({
  tokens,
  selectedToken,
  onSelect,
  placeholder = 'Select token',
  disabled = false,
}: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  const filteredTokens = tokens.filter(
    (t) =>
      t.symbol.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase())
  )

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative min-w-[220px] sm:min-w-[260px]">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen((o) => !o)}
        disabled={disabled}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold bg-white cursor-pointer hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
      >
        <span className="truncate text-gray-900">
          {selectedToken ? (
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                {selectedToken.symbol.slice(0, 2)}
              </span>
              {selectedToken.symbol}
            </span>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or symbol"
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-56 overflow-y-auto py-2">
            <button
              type="button"
              onClick={() => {
                onSelect(null)
                setIsOpen(false)
                setSearch('')
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-500"
            >
              <span className="text-sm font-medium">{placeholder}</span>
            </button>
            {filteredTokens.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No tokens found
              </div>
            ) : (
              filteredTokens.map((token) => (
                <button
                  key={`${token.chainId}-${token.address}`}
                  type="button"
                  onClick={() => {
                    onSelect(token)
                    setIsOpen(false)
                    setSearch('')
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    selectedToken?.address === token.address ? 'bg-blue-50 hover:bg-blue-50' : ''
                  }`}
                >
                  <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                    {token.symbol.slice(0, 2)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">{token.symbol}</div>
                    <div className="text-xs text-gray-500 truncate">{token.name}</div>
                  </div>
                  {selectedToken?.address === token.address && (
                    <span className="text-blue-600 text-sm font-medium">✓</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
