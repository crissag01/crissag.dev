import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import nodemailer from 'nodemailer'
import fetch from 'node-fetch'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Demasiados intentos de contacto. Intenta más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
})

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

const comments = []

async function verifyCloudflareTurnstile(token) {
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: process.env.CLOUDFLARE_TURNSTILE_SECRET,
        response: token,
      })
    })

    const data = await response.json()
    return data.success && data.score > 0.5
  } catch (error) {
    console.error('Error verifying Turnstile token:', error)
    return false
  }
}

app.post('/api/contact', limiter, async (req, res) => {
  try {
    const { name, email, message, turnstileToken } = req.body

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

    const sanitizeInput = (input) => {
      return input.replace(/[<>]/g, '').trim().substring(0, 1000)
    }

    const sanitizedName = sanitizeInput(name)
    const sanitizedEmail = sanitizeInput(email)
    const sanitizedMessage = sanitizeInput(message)

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(sanitizedEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Email inválido'
      })
    }

    const mailOptions = {
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
    }

    await transporter.sendMail(mailOptions)

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
})

app.post('/api/comments', limiter, async (req, res) => {
  try {
    const { name, email, projectId, comment, rating } = req.body

    if (!name || !email || !projectId || !comment || !rating) {
      return res.status(400).json({
        success: false,
        error: 'Faltan campos requeridos'
      })
    }

    const sanitizeInput = (input) => {
      return input.replace(/[<>]/g, '').trim().substring(0, 1000)
    }

    const sanitizedName = sanitizeInput(name)
    const sanitizedComment = sanitizeInput(comment)
    const sanitizedEmail = sanitizeInput(email)

    if (sanitizedName.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Nombre demasiado corto'
      })
    }

    if (sanitizedComment.length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Comentario demasiado corto'
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(sanitizedEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Email inválido'
      })
    }

    if (![1, 2, 3, 4, 5].includes(parseInt(rating))) {
      return res.status(400).json({
        success: false,
        error: 'Calificación inválida'
      })
    }

    const newComment = {
      id: Date.now().toString(),
      name: sanitizedName,
      email: sanitizedEmail,
      projectId: sanitizeInput(projectId),
      comment: sanitizedComment,
      rating: parseInt(rating),
      createdAt: new Date().toISOString(),
      approved: true
    }

    comments.unshift(newComment)

    const notificationEmail = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: process.env.CONTACT_EMAIL,
      subject: `Nuevo comentario en crissag.dev - ${sanitizedName}`,
      html: `
        <h2>Nuevo Comentario</h2>
        <p><strong>Nombre:</strong> ${sanitizedName}</p>
        <p><strong>Email:</strong> ${sanitizedEmail}</p>
        <p><strong>Proyecto:</strong> ${sanitizeInput(projectId)}</p>
        <p><strong>Calificación:</strong> ${'⭐'.repeat(parseInt(rating))}</p>
        <p><strong>Comentario:</strong></p>
        <p>${sanitizedComment.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><small>Revisa tu portafolio para ver si fue publicado.</small></p>
      `
    }

    try {
      await transporter.sendMail(notificationEmail)
    } catch (emailError) {
      console.error('Error sending notification email:', emailError)
    }

    res.json({
      success: true,
      message: 'Comentario enviado correctamente'
    })
  } catch (error) {
    console.error('Comments error:', error)
    res.status(500).json({
      success: false,
      error: 'Error al procesar el comentario'
    })
  }
})

app.get('/api/comments', (req, res) => {
  try {
    const approvedComments = comments.filter(c => c.approved).slice(0, 50)
    res.json({
      success: true,
      comments: approvedComments
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    res.status(500).json({
      success: false,
      error: 'Error al obtener comentarios'
    })
  }
})

app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`)
})
