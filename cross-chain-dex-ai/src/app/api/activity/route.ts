import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIdentifier } from '@/lib/rateLimit'

// Etherscan API V2 only; no Ethereum mainnet - Sepolia and Polygon Amoy only
const ETHERSCAN_V2_BASE = 'https://api.etherscan.io/v2/api'
const SUPPORTED_CHAIN_IDS = [11155111, 80002] // Sepolia, Polygon Amoy

function isSupportedChain(chainId: number): boolean {
  return SUPPORTED_CHAIN_IDS.includes(chainId)
}

export interface ActivityTx {
  blockNumber: string
  timeStamp: string
  hash: string
  from: string
  to: string
  value: string
  gasUsed: string
  gasPrice: string
  isError: string
  txreceipt_status: string
  functionName?: string
}

export async function GET(request: NextRequest) {
  const id = getClientIdentifier(request.headers)
  const limiter = rateLimit(id, 'activity')
  if (!limiter.success) {
    return NextResponse.json(
      { error: 'Too many requests', retryAfter: limiter.retryAfter },
      { status: 429, headers: { 'Retry-After': String(limiter.retryAfter) } }
    )
  }

  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const chainIdParam = searchParams.get('chainId')
  const chainId = chainIdParam ? parseInt(chainIdParam, 10) : NaN

  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 })
  }
  if (!Number.isInteger(chainId) || chainId <= 0) {
    return NextResponse.json({ error: 'Invalid chainId' }, { status: 400 })
  }

  const apiKey = process.env.ETHERSCAN_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Etherscan API key not configured', result: [] },
      { status: 200 }
    )
  }

  if (!isSupportedChain(chainId)) {
    return NextResponse.json({
      result: [],
      message: 'Unsupported chain for activity',
    })
  }

  const params = new URLSearchParams({
    chainid: String(chainId),
    module: 'account',
    action: 'txlist',
    address,
    startblock: '0',
    endblock: '99999999',
    sort: 'desc',
    apikey: apiKey,
  })

  const url = `${ETHERSCAN_V2_BASE}?${params.toString()}`
  try {
    const res = await fetch(url, { next: { revalidate: 30 } })
    const data = await res.json().catch(() => ({}))
    if (data.status === '0' && data.message !== 'OK') {
      return NextResponse.json({
        result: [],
        message: data.message || 'No transactions found',
      })
    }
    const list = Array.isArray(data.result) ? data.result : []
    return NextResponse.json({ result: list })
  } catch (e) {
    return NextResponse.json(
      { error: 'Failed to fetch activity', result: [] },
      { status: 503 }
    )
  }
}
