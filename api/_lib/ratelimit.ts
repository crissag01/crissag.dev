import { Ratelimit } from '@upstash/ratelimit'
import type { VercelRequest } from '@vercel/node'
import { getRedis } from './redis'

let limiter: Ratelimit | null = null

function getLimiter(): Ratelimit {
  if (!limiter) {
    limiter = new Ratelimit({
      redis: getRedis(),
      limiter: Ratelimit.slidingWindow(5, '15 m'),
      prefix: 'ratelimit:contact-form'
    })
  }
  return limiter
}

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for']
  const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded
  return ip?.split(',')[0].trim() || 'unknown'
}

export async function checkRateLimit(req: VercelRequest): Promise<boolean> {
  const { success } = await getLimiter().limit(getClientIp(req))
  return success
}
