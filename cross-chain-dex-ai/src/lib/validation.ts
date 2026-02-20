import { z } from 'zod'

const addressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address')

const amountSchema = z
  .string()
  .min(1, 'Amount is required')
  .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, 'Amount must be a positive number')

const chainIdSchema = z.number().int().positive()

export const swapQuoteSchema = z.object({
  fromTokenAddress: addressSchema,
  toTokenAddress: addressSchema,
  amount: amountSchema,
  chainId: chainIdSchema,
  fromDecimals: z.number().int().min(0).max(18),
  toDecimals: z.number().int().min(0).max(18),
})

export const swapBuildSchema = z.object({
  fromTokenAddress: addressSchema,
  toTokenAddress: addressSchema,
  amount: amountSchema,
  chainId: chainIdSchema,
  slippage: z.number().min(0.1).max(50).optional(),
  fromAddress: addressSchema,
  fromDecimals: z.number().int().min(0).max(18).optional(),
})

export const bridgeQuoteSchema = z.object({
  fromChainId: chainIdSchema,
  toChainId: chainIdSchema,
  fromTokenAddress: addressSchema,
  toTokenAddress: addressSchema,
  amount: amountSchema,
  recipient: addressSchema.optional(),
})

export const bridgeBuildSchema = z.object({
  fromChainId: chainIdSchema,
  toChainId: chainIdSchema,
  fromTokenAddress: addressSchema,
  toTokenAddress: addressSchema,
  amount: amountSchema,
  recipient: addressSchema,
  fromAddress: addressSchema,
})

export type SwapQuoteInput = z.infer<typeof swapQuoteSchema>
export type SwapBuildInput = z.infer<typeof swapBuildSchema>
export type BridgeQuoteInput = z.infer<typeof bridgeQuoteSchema>
export type BridgeBuildInput = z.infer<typeof bridgeBuildSchema>

export function validateAddress(value: string): { success: true; data: string } | { success: false; error: string } {
  const result = addressSchema.safeParse(value)
  if (result.success) return { success: true, data: result.data }
  return { success: false, error: result.error.errors[0]?.message ?? 'Invalid address' }
}

export function validateAmount(value: string): { success: true; data: string } | { success: false; error: string } {
  const result = amountSchema.safeParse(value)
  if (result.success) return { success: true, data: result.data }
  return { success: false, error: result.error.errors[0]?.message ?? 'Invalid amount' }
}
