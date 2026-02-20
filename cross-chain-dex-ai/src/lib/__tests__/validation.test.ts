import { describe, it, expect } from 'vitest'
import {
  validateAddress,
  validateAmount,
  swapQuoteSchema,
  bridgeQuoteSchema,
} from '../validation'

describe('validateAddress', () => {
  it('accepts valid 0x40-char hex address', () => {
    expect(validateAddress('0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb')).toMatchObject({ success: true })
    expect(validateAddress('0x0000000000000000000000000000000000000000')).toMatchObject({ success: true })
  })

  it('rejects invalid address', () => {
    expect(validateAddress('0x123')).toMatchObject({ success: false })
    expect(validateAddress('not-an-address')).toMatchObject({ success: false })
    expect(validateAddress('')).toMatchObject({ success: false })
  })
})

describe('validateAmount', () => {
  it('accepts positive number string', () => {
    expect(validateAmount('1')).toMatchObject({ success: true })
    expect(validateAmount('0.5')).toMatchObject({ success: true })
    expect(validateAmount('100.25')).toMatchObject({ success: true })
  })

  it('rejects invalid amount', () => {
    expect(validateAmount('')).toMatchObject({ success: false })
    expect(validateAmount('0')).toMatchObject({ success: false })
    expect(validateAmount('-1')).toMatchObject({ success: false })
    expect(validateAmount('abc')).toMatchObject({ success: false })
  })
})

describe('swapQuoteSchema', () => {
  it('parses valid swap quote input', () => {
    const valid = {
      fromTokenAddress: '0x0000000000000000000000000000000000000000',
      toTokenAddress: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
      amount: '1',
      chainId: 11155111,
      fromDecimals: 18,
      toDecimals: 6,
    }
    expect(swapQuoteSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects invalid swap quote', () => {
    expect(swapQuoteSchema.safeParse({ amount: '-1', chainId: 1 }).success).toBe(false)
    expect(swapQuoteSchema.safeParse({ fromTokenAddress: '0x123', amount: '1', chainId: 1 }).success).toBe(false)
  })
})

describe('bridgeQuoteSchema', () => {
  it('parses valid bridge quote input', () => {
    const valid = {
      fromChainId: 11155111,
      toChainId: 80002,
      fromTokenAddress: '0x0000000000000000000000000000000000000000',
      toTokenAddress: '0x0000000000000000000000000000000000000000',
      amount: '0.5',
    }
    expect(bridgeQuoteSchema.safeParse(valid).success).toBe(true)
  })
})
