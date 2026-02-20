'use client'

import { useState, useEffect } from 'react'

const SYMBOLS = ['ETH', 'MATIC', 'USDC', 'USDT']

export function useTokenPrices(): Record<string, number> {
  const [prices, setPrices] = useState<Record<string, number>>({})

  useEffect(() => {
    let cancelled = false
    const fetchPrices = async () => {
      try {
        const res = await fetch(`/api/prices?symbols=${SYMBOLS.join(',')}`)
        const data = await res.json()
        if (!cancelled) setPrices(data.prices ?? {})
      } catch {
        if (!cancelled) {
          setPrices({
            ETH: 2000,
            MATIC: 0.5,
            USDC: 1,
            USDT: 1,
          })
        }
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 30_000)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return prices
}
