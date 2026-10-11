export async function verifyCloudflareTurnstile(token: string): Promise<boolean> {
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

    const data = await response.json() as { success: boolean; score?: number }
    return data.success && (data.score === undefined || data.score > 0.5)
  } catch (error) {
    console.error('Error verifying Turnstile token:', error)
    return false
  }
}
