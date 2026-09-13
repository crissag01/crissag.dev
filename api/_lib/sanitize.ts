export function sanitizeInput(input: string): string {
  return input.replace(/[<>]/g, '').trim().substring(0, 1000)
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
