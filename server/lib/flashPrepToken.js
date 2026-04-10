import crypto from 'crypto'

function getSecret() {
  return (
    process.env.FLASH_PREP_SECRET ||
    process.env.CLERK_WEBHOOK_SECRET ||
    process.env.STRIPE_SECRET_KEY ||
    'dev-flash-prep-change-me'
  )
}

export function signFlashPrepPassToken(userId, courseId, lectureId, ttlMs = 20 * 60 * 1000) {
  const exp = Date.now() + ttlMs
  const payload = Buffer.from(
    JSON.stringify({ userId, courseId, lectureId, exp })
  ).toString('base64url')
  const sig = crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

export function verifyFlashPrepPassToken(token, userId, courseId, lectureId) {
  if (!token || typeof token !== 'string') return false
  const dot = token.lastIndexOf('.')
  if (dot <= 0) return false
  const payload = token.slice(0, dot)
  const sig = token.slice(dot + 1)
  const expected = crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url')
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return false
  }
  let data
  try {
    data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'))
  } catch {
    return false
  }
  if (data.exp < Date.now()) return false
  return (
    data.userId === userId &&
    data.courseId === courseId &&
    data.lectureId === lectureId
  )
}
