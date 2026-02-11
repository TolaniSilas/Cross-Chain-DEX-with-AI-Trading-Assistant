'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import type { Token } from '@/config/tokens'

// Standard ERC20 ABI for balance checking
const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const

interface TokenBalance {
  token: Token
  balance: string
  balanceUsd: string
  isLoading: boolean
  error: string | null
}

interface TokenPrice {
  [tokenAddress: string]: number // Price in USD
}

// Mock token prices - in production, use Coingecko or chainlink
const MOCK_TOKEN_PRICES: TokenPrice = {
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 1.0, // USDC
  '0xdac17f958d2ee523a2206206994597c13d831ec7': 1.0, // USDT
  '0x2260fac5e5542a773aa44fbcff9d822366f42dadb': 30000, // WBTC
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': 2500, // WETH
}

export default function useTokenBalance(token: Token | null, userAddress?: string) {
  const { address } = useAccount()
  const targetAddress = userAddress || address
  const [balance, setBalance] = useState<string>('0')
  const [balanceUsd, setBalanceUsd] = useState<string>('0')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Read balance from contract
  const { data: balanceData, isLoading: isBalanceLoading } = useReadContract({
    address: token?.address as `0x${string}` | undefined,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: targetAddress ? [targetAddress as `0x${string}`] : undefined,
    query: { enabled: !!token && !!targetAddress },
  })

  useEffect(() => {
    if (!token || !balanceData) {
      setBalance('0')
      setBalanceUsd('0')
      return
    }

    setIsLoading(isBalanceLoading)

    try {
      // Format balance with token decimals
      const formatted = formatUnits(balanceData as bigint, token.decimals)
      setBalance(formatted)

      // Calculate USD value
      const tokenPriceLower = token.address.toLowerCase()
      const price =
        MOCK_TOKEN_PRICES[tokenPriceLower] ||
        MOCK_TOKEN_PRICES[token.address] ||
        0

      const usdValue = (Number(formatted) * price).toFixed(2)
      setBalanceUsd(usdValue)
      setError(null)
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to format balance'
      setError(errorMsg)
      console.error('Balance calculation error:', err)
    }
  }, [token, balanceData, isBalanceLoading])

  return { balance, balanceUsd, isLoading, error }
}

export function useMultipleTokenBalances(
  tokens: Token[],
  userAddress?: string
): TokenBalance[] {
  const { address } = useAccount()
  const targetAddress = userAddress || address
  const [balances, setBalances] = useState<TokenBalance[]>([])

  useEffect(() => {
    if (!tokens.length || !targetAddress) {
      setBalances(
        tokens.map(token => ({
          token,
          balance: '0',
          balanceUsd: '0',
          isLoading: false,
          error: null,
        }))
      )
      return
    }

    setBalances(
      tokens.map(token => ({
        token,
        balance: '0',
        balanceUsd: '0',
        isLoading: true,
        error: null,
      }))
    )

    const fetchBalances = async () => {
      const results = await Promise.all(
        tokens.map(async token => {
          try {
            // In production, use wagmi readContract or batch call
            // For now, simulate with mock data
            const mockBalance = (Math.random() * 100).toFixed(2)
            const tokenPriceLower = token.address.toLowerCase()
            const price =
              MOCK_TOKEN_PRICES[tokenPriceLower] ||
              MOCK_TOKEN_PRICES[token.address] ||
              0

            const balanceUsd = (Number(mockBalance) * price).toFixed(2)

            return {
              token,
              balance: mockBalance,
              balanceUsd,
              isLoading: false,
              error: null,
            }
          } catch (err) {
            return {
              token,
              balance: '0',
              balanceUsd: '0',
              isLoading: false,
              error:
                err instanceof Error
                  ? err.message
                  : 'Failed to fetch balance',
            }
          }
        })
      )

      setBalances(results)
    }

    fetchBalances()
  }, [tokens, targetAddress])

  return balances
}