import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIdentifier } from '@/lib/rateLimit'

const COINGECKO_IDS: Record<string, string> = {
  ETH: 'ethereum',
  MATIC: 'matic-network',
  USDC: 'usd-coin',
  USDT: 'tether',
}

export async function GET(request: NextRequest) {
  const id = getClientIdentifier(request.headers)
  const limiter = rateLimit(id, 'prices-history')
  if (!limiter.success) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: limiter.retryAfter },
      { status: 429, headers: { 'Retry-After': String(limiter.retryAfter) } }
    )
  }

  const { searchParams } = new URL(request.url)
  const symbol = (searchParams.get('symbol') ?? 'ETH').toUpperCase()
  const days = Number(searchParams.get('days') ?? '1')
  const clampedDays = Number.isFinite(days) ? Math.min(Math.max(days, 1), 30) : 1
  const coinId = COINGECKO_IDS[symbol]

  if (!coinId) {
    return NextResponse.json({ points: [], symbol })
  }

  const url = `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${clampedDays}&interval=hourly`

  try {
    const res = await fetch(url, { next: { revalidate: 60 } })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !Array.isArray(data.prices)) {
      return NextResponse.json({ points: [], symbol }, { status: 200 })
    }

    const points = data.prices
      .slice(-72)
      .map((p: [number, number]) => ({ t: p[0], p: p[1] }))

    return NextResponse.json({ points, symbol })
  } catch (e) {
    console.error('Price history fetch error:', e)
    return NextResponse.json({ points: [], symbol }, { status: 200 })
  }
}
