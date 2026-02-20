import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIdentifier } from '@/lib/rateLimit'
import { swapBuildSchema } from '@/lib/validation'

const ONEINCH_NATIVE = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'

function to1inchTokenAddress(address: string): string {
  if (address === '0x0000000000000000000000000000000000000000') return ONEINCH_NATIVE
  return address
}

export async function GET(request: NextRequest) {
  const id = getClientIdentifier(request.headers)
  const limiter = rateLimit(id, 'swap-build')
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
  const slippage = searchParams.get('slippage')
  const fromAddress = searchParams.get('fromAddress')
  const fromDecimals = searchParams.get('fromDecimals')

  const parsed = swapBuildSchema.safeParse({
    fromTokenAddress: fromTokenAddress ?? '',
    toTokenAddress: toTokenAddress ?? '',
    amount: amount ?? '',
    chainId: chainId ? parseInt(chainId, 10) : 0,
    slippage: slippage ? parseFloat(slippage) : 1,
    fromAddress: fromAddress ?? '',
    fromDecimals: fromDecimals ? parseInt(fromDecimals, 10) : 18,
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
      { error: 'Swap build not configured', hint: 'Set ONEINCH_API_KEY' },
      { status: 503 }
    )
  }

  const { chainId: cid, fromTokenAddress: src, toTokenAddress: dst, amount: amt, fromAddress: addr } = parsed.data
  const fromDecimalsNum = parsed.data.fromDecimals ?? 18
  const amountWei = BigInt(Math.floor(Number(amt) * 10 ** fromDecimalsNum)).toString()
  const slippagePct = Math.min(50, Math.max(0.1, parsed.data.slippage ?? 1))

  const srcAddr = to1inchTokenAddress(src)
  const dstAddr = to1inchTokenAddress(dst)
  const url = `https://api.1inch.dev/swap/v5.2/${cid}/swap?src=${srcAddr}&dst=${dstAddr}&amount=${amountWei}&from=${addr}&slippage=${slippagePct}`

  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 0 },
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return NextResponse.json(
        { error: data.description || data.message || 'Build failed', status: res.status },
        { status: res.status >= 500 ? 503 : res.status }
      )
    }
    return NextResponse.json(data)
  } catch (e) {
    console.error('1inch swap build error:', e)
    return NextResponse.json(
      { error: 'Failed to build swap transaction' },
      { status: 503 }
    )
  }
}
