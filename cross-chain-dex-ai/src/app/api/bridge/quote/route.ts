import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIdentifier } from '@/lib/rateLimit'
import { bridgeQuoteSchema } from '@/lib/validation'

const NATIVE_PLACEHOLDER = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

function toSocketTokenAddress(address: string): string {
  if (address === '0x0000000000000000000000000000000000000000') return NATIVE_PLACEHOLDER
  return address
}

export async function GET(request: NextRequest) {
  const id = getClientIdentifier(request.headers)
  const limiter = rateLimit(id, 'bridge-quote')
  if (!limiter.success) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: limiter.retryAfter },
      { status: 429, headers: { 'Retry-After': String(limiter.retryAfter) } }
    )
  }

  const { searchParams } = new URL(request.url)
  const fromChainId = searchParams.get('fromChainId')
  const toChainId = searchParams.get('toChainId')
  const fromTokenAddress = searchParams.get('fromTokenAddress')
  const toTokenAddress = searchParams.get('toTokenAddress')
  const amount = searchParams.get('amount')
  const recipient = searchParams.get('recipient')

  const parsed = bridgeQuoteSchema.safeParse({
    fromChainId: fromChainId ? parseInt(fromChainId, 10) : 0,
    toChainId: toChainId ? parseInt(toChainId, 10) : 0,
    fromTokenAddress: fromTokenAddress ?? '',
    toTokenAddress: toTokenAddress ?? '',
    amount: amount ?? '',
    recipient: recipient || undefined,
  })

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const apiKey = process.env.SOCKET_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Bridge quote not configured', hint: 'Set SOCKET_API_KEY for real quotes' },
      { status: 503 }
    )
  }

  const { fromChainId: from, toChainId: to, fromTokenAddress: fromTok, toTokenAddress: toTok, amount: amt } = parsed.data
  const fromAddr = toSocketTokenAddress(fromTok)
  const toAddr = toSocketTokenAddress(toTok)
  const userAddr = parsed.data.recipient || '0x0000000000000000000000000000000000000001'

  const url = new URL('https://api.socket.tech/v2/quote')
  url.searchParams.set('fromChainId', String(from))
  url.searchParams.set('toChainId', String(to))
  url.searchParams.set('fromTokenAddress', fromAddr)
  url.searchParams.set('toTokenAddress', toAddr)
  url.searchParams.set('fromAmount', amt)
  url.searchParams.set('userAddress', userAddr)

  try {
    const res = await fetch(url.toString(), {
      headers: {
        'API-KEY': apiKey,
        Accept: 'application/json',
      },
      next: { revalidate: 0 },
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return NextResponse.json(
        { error: data.message || data.error || 'Bridge quote failed', status: res.status },
        { status: res.status >= 500 ? 503 : res.status }
      )
    }
    return NextResponse.json(data)
  } catch (e) {
    console.error('Socket quote error:', e)
    return NextResponse.json(
      { error: 'Failed to fetch bridge quote' },
      { status: 503 }
    )
  }
}
