import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAdmin } from '../../_lib/adminAuth.js'
import { deleteComment } from '../../_lib/comments.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ success: false, error: 'Método no permitido' })
  }

  if (!requireAdmin(req, res)) return

  const { id } = req.query
  const deleted = await deleteComment(String(id))
  if (!deleted) {
    return res.status(404).json({ success: false, error: 'Comentario no encontrado' })
  }
  res.json({ success: true })
}
