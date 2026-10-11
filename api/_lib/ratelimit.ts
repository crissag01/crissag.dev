import type { VercelRequest } from '@vercel/node'
import { getSupabase } from './supabase'

const WINDOW_MINUTES = 15
const MAX_REQUESTS = 5
// How long old rows are kept before the opportunistic sweep removes them.
const RETENTION_HOURS = 24

function getClientIp(req: VercelRequest): string {
  const forwarded = req.headers['x-forwarded-for']
  const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded
  return ip?.split(',')[0].trim() || 'unknown'
}

/**
 * Sliding-window rate limit shared across the contact form and comment
 * form (mirrors the previous 5 requests / 15 min express-rate-limit
 * config, keyed by IP only — not per-route).
 */
export async function checkRateLimit(req: VercelRequest): Promise<boolean> {
  const supabase = getSupabase()
  const ip = getClientIp(req)
  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000).toISOString()

  const { count, error: countError } = await supabase
    .from('rate_limit_events')
    .select('id', { count: 'exact', head: true })
    .eq('ip', ip)
    .gte('created_at', windowStart)

  if (countError) throw countError

  if ((count ?? 0) >= MAX_REQUESTS) {
    return false
  }

  const { error: insertError } = await supabase
    .from('rate_limit_events')
    .insert({ ip })

  if (insertError) throw insertError

  // Opportunistic cleanup so the table doesn't grow unbounded. Failures
  // here are non-fatal — never block the request over housekeeping.
  const retentionCutoff = new Date(Date.now() - RETENTION_HOURS * 60 * 60 * 1000).toISOString()
  supabase
    .from('rate_limit_events')
    .delete()
    .lt('created_at', retentionCutoff)
    .then(({ error }) => {
      if (error) console.error('Rate limit cleanup failed:', error)
    })

  return true
}
