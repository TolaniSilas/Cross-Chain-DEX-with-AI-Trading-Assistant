/**
 * In-memory rate limiter for API routes.
 * For production at scale, use Redis or Upstash.
 */

const store = new Map<string, { count: number; resetAt: number }>()
const WINDOW_MS = 60_000 // 1 minute
const MAX_REQUESTS = 30 // per window per key

function getKey(identifier: string, prefix: string): string {
  return `${prefix}:${identifier}`
}

export function rateLimit(identifier: string, prefix: string = 'api'): { success: true } | { success: false; retryAfter: number } {
  const key = getKey(identifier, prefix)
  const now = Date.now()
  const entry = store.get(key)

  if (!entry) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { success: true }
  }

  if (now >= entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { success: true }
  }

  entry.count += 1
  if (entry.count > MAX_REQUESTS) {
    return { success: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }
  return { success: true }
}

export function getClientIdentifier(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for')
  const realIp = headers.get('x-real-ip')
  if (forwarded) return forwarded.split(',')[0].trim()
  if (realIp) return realIp
  return 'anonymous'
}
