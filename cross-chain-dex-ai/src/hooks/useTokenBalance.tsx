'use client'

import { useEffect, useState, useMemo } from 'react'
import { useAccount, useReadContract, useReadContracts, useBalance } from 'wagmi'
import { formatUnits } from 'viem'
import type { Token } from '@/config/tokens'
import { useTokenPrices } from './useTokenPrices'

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

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

function isNative(token: Token): boolean {
  return token.address.toLowerCase() === ZERO_ADDRESS
}

export interface TokenBalance {
  token: Token
  balance: string
  balanceUsd: string
  isLoading: boolean
  error: string | null
}

export default function useTokenBalance(
  token: Token | null,
  userAddress?: string,
  priceOverride?: number
) {
  const { address } = useAccount()
  const targetAddress = userAddress || address
  const [balanceUsd, setBalanceUsd] = useState<string>('0')

  const isNativeToken = token && isNative(token)
  const nativeBalance = useBalance({
    address: targetAddress as `0x${string}` | undefined,
    query: {
      enabled: !!targetAddress && !!isNativeToken,
      refetchInterval: 15_000,
    },
  })
  const erc20Balance = useReadContract({
    address: token && !isNative(token) ? (token.address as `0x${string}`) : undefined,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: targetAddress ? [targetAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!token && !!targetAddress && !isNativeToken,
      refetchInterval: 15_000,
    },
  })

  const balanceData = isNativeToken ? nativeBalance.data : erc20Balance.data
  const isLoading = isNativeToken ? nativeBalance.isLoading : erc20Balance.isLoading
  const error = isNativeToken ? nativeBalance.error : erc20Balance.error

  const balance = useMemo(() => {
    if (!token || balanceData === undefined) return '0'
    if (isNativeToken && balanceData) {
      const b = balanceData as { value?: bigint; formatted?: string }
      return b.formatted ?? (b.value != null ? formatUnits(b.value, token.decimals) : '0')
    }
    if (!isNativeToken && balanceData !== undefined) {
      return formatUnits(balanceData as bigint, token.decimals)
    }
    return '0'
  }, [token, balanceData, isNativeToken])

  const price = priceOverride ?? 0
  useEffect(() => {
    const num = Number(balance)
    const usd = (Number.isNaN(num) ? 0 : num * price).toFixed(2)
    setBalanceUsd(usd)
  }, [balance, price])

  return {
    balance,
    balanceUsd,
    isLoading: !!token && isLoading,
    error: error ? (error as Error).message : null,
  }
}

export function useMultipleTokenBalances(
  tokens: Token[],
  userAddress?: string
): TokenBalance[] {
  const { address } = useAccount()
  const targetAddress = userAddress || address
  const prices = useTokenPrices()

  const nativeToken = useMemo(() => tokens.find(isNative), [tokens])
  const erc20Tokens = useMemo(() => tokens.filter((t) => !isNative(t)), [tokens])

  const nativeBalance = useBalance({
    address: targetAddress as `0x${string}` | undefined,
    query: {
      enabled: !!targetAddress && !!nativeToken,
      refetchInterval: 15_000,
    },
  })

  const contracts = useMemo(
    () =>
      erc20Tokens.map((t) => ({
        address: t.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf' as const,
        args: [targetAddress as `0x${string}`] as const,
      })),
    [erc20Tokens, targetAddress]
  )

  const { data: contractsData } = useReadContracts({
    contracts,
    query: {
      enabled: contracts.length > 0 && !!targetAddress,
      refetchInterval: 15_000,
    },
  })

  return useMemo(() => {
    const result: TokenBalance[] = []
    let erc20Index = 0
    for (const token of tokens) {
      if (isNative(token)) {
        const data = nativeBalance.data
        const b = data as { value?: bigint; formatted?: string } | undefined
        const balance =
          nativeBalance.isLoading || !data
            ? '0'
            : b?.formatted ?? (b?.value != null ? formatUnits(b.value, token.decimals) : '0')
        const price = prices[token.symbol] ?? 0
        const balanceUsd = (Number(balance) * price).toFixed(2)
        result.push({
          token,
          balance,
          balanceUsd,
          isLoading: nativeBalance.isLoading,
          error: nativeBalance.error ? (nativeBalance.error as Error).message : null,
        })
      } else {
        const contractResult = contractsData?.[erc20Index]
        const raw = contractResult?.result
        const balance =
          contractResult?.status === 'success' && raw !== undefined
            ? formatUnits(raw as bigint, token.decimals)
            : '0'
        const isLoading = contractResult?.status === 'pending'
        const price = prices[token.symbol] ?? 0
        const balanceUsd = (Number(balance) * price).toFixed(2)
        result.push({
          token,
          balance,
          balanceUsd,
          isLoading,
          error: contractResult?.status === 'error' ? 'Failed to fetch' : null,
        })
        erc20Index++
      }
    }
    return result
  }, [tokens, nativeBalance, contractsData, prices])
}
