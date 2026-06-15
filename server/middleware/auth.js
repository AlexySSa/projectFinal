import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'bahn_secret'

function readToken(req) {
  const header = req.headers.authorization || ''
  const [scheme, token] = header.split(' ')
  if (scheme === 'Bearer' && token) return token
  return null
}

function verifyToken(token) {
  return jwt.verify(token, SECRET)
}

export function requireAuth(req, res, next) {
  const token = readToken(req)
  if (!token) return res.status(401).json({ error: 'No autenticado' })
  try {
    req.user = verifyToken(token)
    next()
  } catch {
    res.status(401).json({ error: 'Sesion invalida' })
  }
}

export function requireAdmin(req, res, next) {
  requireAuth(req, res, () => {
    if (req.user?.rol !== 'admin') {
      return res.status(403).json({ error: 'Solo el admin puede entrar aqui' })
    }
    next()
  })
}

export function optionalAuth(req, res, next) {
  const token = readToken(req)
  if (token) {
    try {
      req.user = verifyToken(token)
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
