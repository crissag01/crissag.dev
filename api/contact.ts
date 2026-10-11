import type { VercelRequest, VercelResponse } from '@vercel/node'
import { checkRateLimit } from './_lib/requestLimiter.js'
import { verifyCloudflareTurnstile } from './_lib/turnstile.js'
import { sanitizeInput, EMAIL_REGEX } from './_lib/sanitize.js'
import { transporter } from './_lib/mailer.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
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

    const { name, email, message, turnstileToken } = req.body ?? {}

    if (!name || !email || !message || !turnstileToken) {
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
    const sanitizedEmail = sanitizeInput(email)
    const sanitizedMessage = sanitizeInput(message)

    if (!EMAIL_REGEX.test(sanitizedEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Email inválido'
      })
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL,
      replyTo: sanitizedEmail,
      subject: `Nuevo contacto de ${sanitizedName}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${sanitizedName}</p>
        <p><strong>Email:</strong> ${sanitizedEmail}</p>
        <p><strong>Mensaje:</strong></p>
        <p>${sanitizedMessage.replace(/\n/g, '<br>')}</p>
      `
    })

    res.json({
      success: true,
      message: 'Mensaje enviado correctamente. Te contactaremos pronto.'
    })
  } catch (error) {
    console.error('Contact form error:', error)
    res.status(500).json({
      success: false,
      error: 'Error al enviar el mensaje. Intenta más tarde.'
    })
  }
}
