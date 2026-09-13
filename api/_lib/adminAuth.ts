import type { VercelRequest, VercelResponse } from '@vercel/node'

export function requireAdmin(req: VercelRequest, res: VercelResponse): boolean {
  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ success: false, error: 'No autorizado' })
    return false
  }
  return true
}
