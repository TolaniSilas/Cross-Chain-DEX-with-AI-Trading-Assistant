import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIdentifier } from '@/lib/rateLimit'
import { bridgeBuildSchema } from '@/lib/validation'

const NATIVE_PLACEHOLDER = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

function toSocketTokenAddress(address: string): string {
  if (address === '0x0000000000000000000000000000000000000000') return NATIVE_PLACEHOLDER
  return address
}

export async function POST(request: NextRequest) {
  const id = getClientIdentifier(request.headers)
  const limiter = rateLimit(id, 'bridge-build')
  if (!limiter.success) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: limiter.retryAfter },
      { status: 429, headers: { 'Retry-After': String(limiter.retryAfter) } }
    )
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = bridgeBuildSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const apiKey = process.env.SOCKET_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Bridge build not configured', hint: 'Set SOCKET_API_KEY' },
      { status: 503 }
    )
  }

  const { fromChainId, toChainId, fromTokenAddress, toTokenAddress, amount, recipient, fromAddress } = parsed.data
  const fromTok = toSocketTokenAddress(fromTokenAddress)
  const toTok = toSocketTokenAddress(toTokenAddress)

  const quoteUrl = new URL('https://api.socket.tech/v2/quote')
  quoteUrl.searchParams.set('fromChainId', String(fromChainId))
  quoteUrl.searchParams.set('toChainId', String(toChainId))
  quoteUrl.searchParams.set('fromTokenAddress', fromTok)
  quoteUrl.searchParams.set('toTokenAddress', toTok)
  quoteUrl.searchParams.set('fromAmount', amount)
  quoteUrl.searchParams.set('userAddress', fromAddress)

  try {
    const quoteRes = await fetch(quoteUrl.toString(), {
      headers: { 'API-KEY': apiKey, Accept: 'application/json' },
      next: { revalidate: 0 },
    })
    const quoteData = await quoteRes.json().catch(() => ({}))
    if (!quoteRes.ok) {
      return NextResponse.json(
        { error: quoteData.message || quoteData.error || 'Bridge quote failed' },
        { status: quoteRes.status >= 500 ? 503 : quoteRes.status }
      )
    }

    const route = quoteData.result?.routes?.[0] || quoteData.routes?.[0]
    if (!route) {
      return NextResponse.json(
        { error: 'No bridge route found' },
        { status: 404 }
      )
    }

    const buildUrl = 'https://api.socket.tech/v2/build'
    const buildRes = await fetch(buildUrl, {
      method: 'POST',
      headers: {
        'API-KEY': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        route: route,
        userAddress: fromAddress,
        recipient: recipient || fromAddress,
      }),
      next: { revalidate: 0 },
    })
    const buildData = await buildRes.json().catch(() => ({}))
    if (!buildRes.ok) {
      return NextResponse.json(
        { error: buildData.message || buildData.error || 'Bridge build failed' },
        { status: buildRes.status >= 500 ? 503 : buildRes.status }
      )
    }
    return NextResponse.json(buildData)
  } catch (e) {
    console.error('Socket build error:', e)
    return NextResponse.json(
      { error: 'Failed to build bridge transaction' },
      { status: 503 }
    )
  }
}
