import { describe, it, expect } from 'vitest'
import { rateLimit } from '../rateLimit'

describe('rateLimit', () => {
  it('allows requests under the limit', () => {
    const key = 'test-' + Math.random()
    for (let i = 0; i < 5; i++) {
      const result = rateLimit(key, 'test')
      expect(result.success).toBe(true)
    }
  })

  it('returns success: true for first request', () => {
    const key = 'unique-' + Date.now()
    expect(rateLimit(key, 'test')).toMatchObject({ success: true })
  })
})
