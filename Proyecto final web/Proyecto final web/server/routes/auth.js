import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { pool } from '../db.js'
import { signToken, requireAuth } from '../middleware/auth.js'
import { sendWelcomeEmail } from '../services/mailer.js'
import { logError } from '../services/logger.js'

const router = Router()

function fechaLegible(d = new Date()) {
  return d.toLocaleDateString('es-SV', { day: '2-digit', month: 'long', year: 'numeric' })
}

function publicUser(u) {
  return { id: u.id, nombre: u.nombre, email: u.email, rol: u.rol, telefono: u.telefono }
}

router.post('/register', async (req, res) => {
  const { nombre, email, password, telefono, rol } = req.body
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Nombre, correo y contraseña son obligatorios' })
  }
  try {
    const [exists] = await pool.query('SELECT id FROM usuarios WHERE email = ?', [email])
    if (exists.length) return res.status(409).json({ error: 'El correo ya está registrado' })

    const hash = await bcrypt.hash(password, 10)
    const validRol = rol === 'arrendador' ? 'arrendador' : 'cliente'
    const [r] = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, telefono, rol) VALUES (?, ?, ?, ?, ?)',
      [nombre, email, hash, telefono || null, validRol]
    )
    const user = { id: r.insertId, nombre, email, rol: validRol, telefono }

    sendWelcomeEmail({ to: email, nombre, email, fecha: fechaLegible() })
      .catch((e) => logError('welcome-email', e, { email }))

    res.status(201).json({ token: signToken(user), user: publicUser(user) })
  } catch (e) {
    res.status(500).json({ error: 'Error al registrar: ' + e.message })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Correo y contraseña requeridos' })
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email])
    if (!rows.length) return res.status(401).json({ error: 'Credenciales incorrectas' })

    const u = rows[0]
    const ok = await bcrypt.compare(password, u.password)
    if (!ok) return res.status(401).json({ error: 'Credenciales incorrectas' })

    res.json({ token: signToken(u), user: publicUser(u) })
  } catch (e) {
    res.status(500).json({ error: 'Error al iniciar sesión: ' + e.message })
  }
})

router.get('/me', requireAuth, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [req.user.id])
  if (!rows.length) return res.status(404).json({ error: 'Usuario no encontrado' })
  res.json({ user: publicUser(rows[0]) })
})

export default router
