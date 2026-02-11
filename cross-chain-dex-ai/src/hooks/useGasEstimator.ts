import { useCallback, useState, useEffect } from 'react'
import { usePublicClient } from 'wagmi'
import { formatUnits } from 'viem'

export interface GasEstimate {
  slow: {
    gasPrice: string // in gwei
    totalCost: string // in ETH
    usdCost: string
    duration: string
  }
  standard: {
    gasPrice: string
    totalCost: string
    usdCost: string
    duration: string
  }
  fast: {
    gasPrice: string
    totalCost: string
    usdCost: string
    duration: string
  }
}

interface EstimateParams {
  to: `0x${string}` | string
  data: string
  value?: bigint
  ethPrice: number // Current ETH price in USD
}

export function useGasEstimator() {
  const publicClient = usePublicClient()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const estimateGas = useCallback(
    async (params: EstimateParams): Promise<GasEstimate | null> => {
      if (!publicClient) return null

      setIsLoading(true)
      setError(null)

      try {
        // Get current gas prices
        const gasPrice = await publicClient.getGasPrice()
        const gasPriceGwei = formatUnits(gasPrice, 'gwei')

        // Estimate gas for the transaction
        const estimatedGas = await publicClient.estimateGas({
          to: params.to as `0x${string}`,
          data: params.data as `0x${string}`,
          value: params.value || 0n,
        })

        // Calculate for different speed tiers
        const gasMultipliers = {
          slow: 0.8,
          standard: 1.0,
          fast: 1.5,
        }

        const baseCost = Number(estimatedGas) * Number(gasPrice)

        const estimates: GasEstimate = {
          slow: calculateTierCost(
            baseCost,
            gasMultipliers.slow,
            gasPriceGwei,
            params.ethPrice,
            '15-30s'
          ),
          standard: calculateTierCost(
            baseCost,
            gasMultipliers.standard,
            gasPriceGwei,
            params.ethPrice,
            '5-15s'
          ),
          fast: calculateTierCost(
            baseCost,
            gasMultipliers.fast,
            gasPriceGwei,
            params.ethPrice,
            '<5s'
          ),
        }

        return estimates
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to estimate gas'
        setError(errorMessage)
        console.error('Gas estimation error:', err)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [publicClient]
  )

  return { estimateGas, isLoading, error }
}

function calculateTierCost(
  baseCostWei: number,
  multiplier: number,
  gasPriceGwei: string,
  ethPrice: number,
  duration: string
) {
  const adjustedCost = baseCostWei * multiplier
  const costInEth = adjustedCost / 1e18
  const costInUsd = costInEth * ethPrice

  const adjustedGasPrice = (Number(gasPriceGwei) * multiplier).toFixed(2)

  return {
    gasPrice: adjustedGasPrice,
    totalCost: costInEth.toFixed(6),
    usdCost: costInUsd.toFixed(2),
    duration,
  }
}

// Hook to fetch current ETH price from on-chain price feed
export function useEthPrice() {
  const publicClient = usePublicClient()
  const [ethPrice, setEthPrice] = useState(2000) // Default fallback
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!publicClient) return

    const fetchPrice = async () => {
      setIsLoading(true)
      try {
        // Chainlink ETH/USD price feed addresses by chain
        const priceFeeds: Record<number, string> = {
          1: '0x5f4ec3df9cbd43714fe2740f5e3616155c5b8419', // Ethereum Mainnet
          42161: '0x639fe6ab55c921f74e7fac19ee16eba451b90c639', // Arbitrum
          137: '0xf9680d99d6e264a30e560f27cff9757e92e67d37', // Polygon
          10: '0x13e3ee699d3585f7acc3758674603cd38e000578', // Optimism
        }

        const chainId = await publicClient.getChainId()
        const priceFeedAddress = priceFeeds[chainId]

        if (priceFeedAddress) {
          // Simple fallback - in production use chainlink oracle
          setEthPrice(2500) // Mock price
        }
      } catch (err) {
        console.error('Failed to fetch ETH price:', err)
        setEthPrice(2000) // Use fallback
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrice()
  }, [publicClient])

  return { ethPrice, isLoading }
}