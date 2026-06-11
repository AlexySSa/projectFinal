import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'bahn_secret'

function readToken(req) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')
  if (scheme === 'Bearer' && token) return token
  return null
}

export function requireAuth(req, res, next) {
  const token = readToken(req)
  if (!token) return res.status(401).json({ error: 'No autenticado' })
  try {
    req.user = jwt.verify(token, SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Sesión inválida' })
  }
}

export function optionalAuth(req, res, next) {
  const token = readToken(req)
  if (token) {
    try {
      req.user = jwt.verify(token, SECRET)
    } catch {
      req.user = null
    }
  }
  next()
}

export function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, rol: user.rol, nombre: user.nombre }, SECRET, {
    expiresIn: '7d',
  })
}
