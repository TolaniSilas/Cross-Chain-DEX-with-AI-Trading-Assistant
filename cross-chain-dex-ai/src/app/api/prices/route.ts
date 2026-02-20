import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIdentifier } from '@/lib/rateLimit'

const COINGECKO_IDS: Record<string, string> = {
  ETH: 'ethereum',
  MATIC: 'polygon-ecosystem-token',
  USDC: 'usd-coin',
  USDT: 'tether',
}

export async function GET(request: NextRequest) {
  const id = getClientIdentifier(request.headers)
  const limiter = rateLimit(id, 'prices')
  if (!limiter.success) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: limiter.retryAfter },
      { status: 429, headers: { 'Retry-After': String(limiter.retryAfter) } }
    )
  }

  const { searchParams } = new URL(request.url)
  const symbols = searchParams.get('symbols')
  const list = symbols ? symbols.split(',').map((s) => s.trim().toUpperCase()) : ['ETH', 'MATIC', 'USDC', 'USDT']

  const ids = [...new Set(list.map((s) => COINGECKO_IDS[s]).filter(Boolean))]
  if (ids.length === 0) {
    return NextResponse.json({ prices: {} })
  }

  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd`
  try {
    const res = await fetch(url, { next: { revalidate: 60 } })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch prices' },
        { status: 503 }
      )
    }
    const prices: Record<string, number> = {}
    for (const sym of list) {
      const id = COINGECKO_IDS[sym]
      if (id && data[id]?.usd) prices[sym] = data[id].usd
      else if (sym === 'USDC' || sym === 'USDT') prices[sym] = 1
    }
    return NextResponse.json({ prices })
  } catch (e) {
    console.error('Prices fetch error:', e)
    const fallback: Record<string, number> = {}
    for (const sym of list) {
      if (sym === 'USDC' || sym === 'USDT') fallback[sym] = 1
      else if (sym === 'ETH') fallback[sym] = 2000
      else if (sym === 'MATIC') fallback[sym] = 0.5
    }
    return NextResponse.json({ prices: fallback })
  }
}
