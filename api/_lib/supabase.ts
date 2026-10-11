import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

/**
 * Server-only client using the service_role key, which bypasses RLS.
 * Never import this from frontend code — the key must stay out of the
 * client bundle (hence no VITE_ prefix on SUPABASE_SERVICE_ROLE_KEY).
 */
export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false }
    })
  }
  return client
}
