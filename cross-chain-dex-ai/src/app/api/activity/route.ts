import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIdentifier } from '@/lib/rateLimit'

// Etherscan API V2: txlist for the connected ETH wallet address (Ethereum mainnet, chainid=1).
// Single history for the wallet, not per-chain (Sepolia/Polygon).
const ETHERSCAN_V2_BASE = 'https://api.etherscan.io/v2/api'
const ETHEREUM_CHAIN_ID = 1

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

  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 })
  }

  const apiKey = process.env.ETHERSCAN_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Etherscan API key not configured', result: [] },
      { status: 200 }
    )
  }

  // GET request format: chainid=1 (Ethereum), module=account, action=txlist, address, apikey
  const params = new URLSearchParams({
    chainid: String(ETHEREUM_CHAIN_ID),
    module: 'account',
    action: 'txlist',
    address,
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
