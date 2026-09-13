import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAdmin } from '../_lib/adminAuth'
import { loadComments } from '../_lib/comments'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Método no permitido' })
  }

  if (!requireAdmin(req, res)) return

  const comments = await loadComments()
  const pending = comments.filter(c => !c.approved)
  res.json({ success: true, comments: pending })
}
