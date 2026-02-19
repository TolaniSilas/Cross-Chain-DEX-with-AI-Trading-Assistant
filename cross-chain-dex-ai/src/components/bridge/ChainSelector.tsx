'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import type { Chain } from 'wagmi/chains'

interface ChainSelectorProps {
  chains: Chain[]
  selectedChainId: number | null
  onSelect: (chainId: number | null) => void
  placeholder?: string
  disabled?: boolean
}

export default function ChainSelector({
  chains,
  selectedChainId,
  onSelect,
  placeholder = 'Select chain',
  disabled = false,
}: ChainSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selectedChain = chains.find((c) => c.id === selectedChainId)

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
    <div ref={containerRef} className="relative w-full min-w-[220px] sm:min-w-[260px]">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen((o) => !o)}
        disabled={disabled}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-semibold bg-white cursor-pointer hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left"
      >
        <span className="truncate text-gray-900">
          {selectedChain ? (
            <span className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                {selectedChain.nativeCurrency.symbol.slice(0, 2)}
              </span>
              {selectedChain.name}
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
          <div className="max-h-64 overflow-y-auto py-2">
            <button
              type="button"
              onClick={() => {
                onSelect(null)
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors text-gray-500"
            >
              <span className="text-sm font-medium">{placeholder}</span>
            </button>
            {chains.map((chain) => (
              <button
                key={chain.id}
                type="button"
                onClick={() => {
                  onSelect(chain.id)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                  selectedChainId === chain.id ? 'bg-blue-50 hover:bg-blue-50' : ''
                }`}
              >
                <span className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 shrink-0">
                  {chain.nativeCurrency.symbol.slice(0, 2)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{chain.name}</div>
                  <div className="text-xs text-gray-500 truncate">{chain.nativeCurrency.name}</div>
                </div>
                {selectedChainId === chain.id && (
                  <span className="text-blue-600 text-sm font-medium">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
