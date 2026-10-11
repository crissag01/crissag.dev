import type { VercelRequest, VercelResponse } from '@vercel/node'
import { requireAdmin } from '../../_lib/adminAuth'
import { approveComment } from '../../_lib/comments'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método no permitido' })
  }

  if (!requireAdmin(req, res)) return

  const { id } = req.query
  const comment = await approveComment(String(id))
  if (!comment) {
    return res.status(404).json({ success: false, error: 'Comentario no encontrado' })
  }
  res.json({ success: true, comment })
}
