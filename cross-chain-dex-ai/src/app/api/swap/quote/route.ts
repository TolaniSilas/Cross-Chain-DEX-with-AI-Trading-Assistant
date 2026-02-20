import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIdentifier } from '@/lib/rateLimit'
import { swapQuoteSchema } from '@/lib/validation'

const ONEINCH_NATIVE = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

function to1inchTokenAddress(address: string): string {
  if (address === '0x0000000000000000000000000000000000000000') return ONEINCH_NATIVE
  return address
}

export async function GET(request: NextRequest) {
  const id = getClientIdentifier(request.headers)
  const limiter = rateLimit(id, 'swap-quote')
  if (!limiter.success) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: limiter.retryAfter },
      { status: 429, headers: { 'Retry-After': String(limiter.retryAfter) } }
    )
  }

  const { searchParams } = new URL(request.url)
  const fromTokenAddress = searchParams.get('fromTokenAddress')
  const toTokenAddress = searchParams.get('toTokenAddress')
  const amount = searchParams.get('amount')
  const chainId = searchParams.get('chainId')
  const fromDecimals = searchParams.get('fromDecimals')
  const toDecimals = searchParams.get('toDecimals')

  const parsed = swapQuoteSchema.safeParse({
    fromTokenAddress: fromTokenAddress ?? '',
    toTokenAddress: toTokenAddress ?? '',
    amount: amount ?? '',
    chainId: chainId ? parseInt(chainId, 10) : 0,
    fromDecimals: fromDecimals ? parseInt(fromDecimals, 10) : 18,
    toDecimals: toDecimals ? parseInt(toDecimals, 10) : 18,
  })

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const apiKey = process.env.ONEINCH_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Swap quote not configured', hint: 'Set ONEINCH_API_KEY for real quotes' },
      { status: 503 }
    )
  }

  const { chainId: cid, fromTokenAddress: src, toTokenAddress: dst, amount: amt, fromDecimals: dec } = parsed.data
  const amountWei = BigInt(Math.floor(Number(amt) * 10 ** dec)).toString()

  const srcAddr = to1inchTokenAddress(src)
  const dstAddr = to1inchTokenAddress(dst)
  const url = `https://api.1inch.dev/swap/v5.2/${cid}/quote?src=${srcAddr}&dst=${dstAddr}&amount=${amountWei}`

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 0 },
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return NextResponse.json(
        { error: data.description || data.message || 'Quote failed', status: res.status },
        { status: res.status >= 500 ? 503 : res.status }
      )
    }
    return NextResponse.json(data)
  } catch (e) {
    console.error('1inch quote error:', e)
    return NextResponse.json(
      { error: 'Failed to fetch quote' },
      { status: 503 }
    )
  }
}
