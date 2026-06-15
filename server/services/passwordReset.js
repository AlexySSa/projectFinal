const RESET_TTL_MINUTES = Number(process.env.RESET_CODE_TTL_MINUTES) || 10
const resetCodes = new Map()

function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase()
}

function cleanupExpired(now = Date.now()) {
  for (const [email, data] of resetCodes.entries()) {
    if (!data || data.expiresAt <= now) resetCodes.delete(email)
  }
}

export function getResetTtlMinutes() {
  return RESET_TTL_MINUTES
}

export function createResetCode(email) {
  cleanupExpired()
  const code = String(Math.floor(100000 + Math.random() * 900000))
  resetCodes.set(normalizeEmail(email), {
    code,
    expiresAt: Date.now() + RESET_TTL_MINUTES * 60 * 1000,
  })
  return code
}

export function verifyResetCode(email, code) {
  cleanupExpired()
  const entry = resetCodes.get(normalizeEmail(email))
  return Boolean(entry && entry.code === String(code).trim() && entry.expiresAt > Date.now())
}

export function consumeResetCode(email, code) {
  const ok = verifyResetCode(email, code)
  if (ok) resetCodes.delete(normalizeEmail(email))
  return ok
}
