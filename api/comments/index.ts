import type { VercelRequest, VercelResponse } from '@vercel/node'
import { checkRateLimit } from '../_lib/requestLimiter.js'
import { verifyCloudflareTurnstile } from '../_lib/turnstile.js'
import { sanitizeInput, EMAIL_REGEX } from '../_lib/sanitize.js'
import { transporter } from '../_lib/mailer.js'
import { getApprovedComments, insertComment } from '../_lib/comments.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const approvedComments = await getApprovedComments()
      return res.json({ success: true, comments: approvedComments })
    } catch (error) {
      console.error('Error fetching comments:', error)
      return res.status(500).json({ success: false, error: 'Error al obtener comentarios' })
    }
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Método no permitido' })
  }

  try {
    const allowed = await checkRateLimit(req)
    if (!allowed) {
      return res.status(429).json({
        success: false,
        error: 'Demasiados intentos de contacto. Intenta más tarde.'
      })
    }

    const { name, email, projectId, comment, rating, turnstileToken } = req.body ?? {}

    if (!name || !email || !projectId || !comment || !rating || !turnstileToken) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos'
      })
    }

    const isValidTurnstile = await verifyCloudflareTurnstile(turnstileToken)
    if (!isValidTurnstile) {
      return res.status(400).json({
        success: false,
        error: 'Verificación de seguridad fallida. Intenta de nuevo.'
      })
    }

    const sanitizedName = sanitizeInput(name)
    const sanitizedComment = sanitizeInput(comment)
    const sanitizedEmail = sanitizeInput(email)

    if (sanitizedName.length < 2) {
      return res.status(400).json({ success: false, error: 'Nombre demasiado corto' })
    }

    if (sanitizedComment.length < 10) {
      return res.status(400).json({ success: false, error: 'Comentario demasiado corto' })
    }

    if (!EMAIL_REGEX.test(sanitizedEmail)) {
      return res.status(400).json({ success: false, error: 'Email inválido' })
    }

    if (![1, 2, 3, 4, 5].includes(parseInt(rating))) {
      return res.status(400).json({ success: false, error: 'Calificación inválida' })
    }

    const newComment = await insertComment({
      id: Date.now().toString(),
      name: sanitizedName,
      email: sanitizedEmail,
      projectId: sanitizeInput(projectId),
      comment: sanitizedComment,
      rating: parseInt(rating),
      approved: false
    })

    try {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.CONTACT_EMAIL,
        subject: `Nuevo comentario pendiente de aprobación - ${sanitizedName}`,
        html: `
          <h2>Nuevo Comentario (pendiente de moderación)</h2>
          <p><strong>Nombre:</strong> ${sanitizedName}</p>
          <p><strong>Email:</strong> ${sanitizedEmail}</p>
          <p><strong>Proyecto:</strong> ${newComment.projectId}</p>
          <p><strong>Calificación:</strong> ${'⭐'.repeat(newComment.rating)}</p>
          <p><strong>Comentario:</strong></p>
          <p>${sanitizedComment.replace(/\n/g, '<br>')}</p>
          <hr>
          <p><small>Apruébalo o recházalo desde el panel de moderación antes de que se publique.</small></p>
        `
      })
    } catch (emailError) {
      console.error('Error sending notification email:', emailError)
    }

    res.json({
      success: true,
      message: 'Comentario enviado. Será visible tras ser revisado.'
    })
  } catch (error) {
    console.error('Comments error:', error)
    res.status(500).json({ success: false, error: 'Error al procesar el comentario' })
  }
}
