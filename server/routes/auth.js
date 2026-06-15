import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { pool } from '../db.js'
import { signToken, requireAuth } from '../middleware/auth.js'
import { sendWelcomeEmail, sendPasswordResetCodeEmail, mailerConfigured } from '../services/mailer.js'
import { logError } from '../services/logger.js'
import {
  authenticateAdmin,
  getInjectedAdminUser,
  isAdminEmail,
  isAdminUser,
  resetAdminPassword,
} from '../services/adminAuth.js'
import { consumeResetCode, createResetCode, getResetTtlMinutes } from '../services/passwordReset.js'

const router = Router()
const DUI_REGEX = /^\d{8}-\d$/
const RESET_CODE_REGEX = /^\d{6}$/
let usuariosColumnsPromise = null

function fechaLegible(d = new Date()) {
  return d.toLocaleDateString('es-SV', { day: '2-digit', month: 'long', year: 'numeric' })
}

function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase()
}

function publicUser(user) {
  return {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    rol: user.rol,
    telefono: user.telefono || null,
    dui: user.dui || null,
  }
}

async function findRegisteredUser(email) {
  const [rows] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email])
  return rows[0] || null
}

async function getUsuariosColumns() {
  if (!usuariosColumnsPromise) {
    usuariosColumnsPromise = pool.query('SHOW COLUMNS FROM usuarios')
      .then(([rows]) => new Set(rows.map((row) => row.Field)))
      .catch((error) => {
        usuariosColumnsPromise = null
        throw error
      })
  }
  return usuariosColumnsPromise
}

async function usuariosHasColumn(columnName) {
  const columns = await getUsuariosColumns()
  return columns.has(columnName)
}

router.post('/register', async (req, res) => {
  const { nombre, email, password, telefono, dui, rol } = req.body
  const normalizedEmail = normalizeEmail(email)

  if (!nombre || !normalizedEmail || !password) {
    return res.status(400).json({ error: 'Nombre, correo y Contraseña son obligatorios' })
  }
  if (!dui || !DUI_REGEX.test(dui)) {
    return res.status(400).json({ error: 'El DUI debe tener el formato 00000000-0' })
  }
  if (isAdminEmail(normalizedEmail)) {
    return res.status(409).json({ error: 'Correo reservado para administracion' })
  }

  try {
    const existing = await findRegisteredUser(normalizedEmail)
    if (existing) return res.status(409).json({ error: 'El correo ya esta registrado' })

    const hash = await bcrypt.hash(password, 10)
    const validRol = rol === 'arrendador' ? 'arrendador' : 'cliente'
    const storeDui = await usuariosHasColumn('dui')
    const insertSql = storeDui
      ? 'INSERT INTO usuarios (nombre, email, password, telefono, dui, rol) VALUES (?, ?, ?, ?, ?, ?)'
      : 'INSERT INTO usuarios (nombre, email, password, telefono, rol) VALUES (?, ?, ?, ?, ?)'
    const insertParams = storeDui
      ? [nombre, normalizedEmail, hash, telefono || null, dui, validRol]
      : [nombre, normalizedEmail, hash, telefono || null, validRol]
    const [result] = await pool.query(insertSql, insertParams)
    const user = {
      id: result.insertId,
      nombre,
      email: normalizedEmail,
      rol: validRol,
      telefono,
      dui: storeDui ? dui : null,
    }

    sendWelcomeEmail({ to: normalizedEmail, nombre, email: normalizedEmail, fecha: fechaLegible() })
      .catch((error) => logError('welcome-email', error, { email: normalizedEmail }))

    res.status(201).json({ token: signToken(user), user: publicUser(user) })
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar: ' + error.message })
  }
})

router.post('/login', async (req, res) => {
  const normalizedEmail = normalizeEmail(req.body?.email)
  const password = req.body?.password || ''

  if (!normalizedEmail || !password) {
    return res.status(400).json({ error: 'Correo y Contraseña requeridos' })
  }

  try {
    if (isAdminEmail(normalizedEmail)) {
      const admin = await authenticateAdmin(normalizedEmail, password)
      if (!admin) return res.status(401).json({ error: 'Credenciales incorrectas' })
      return res.json({ token: signToken(admin), user: publicUser(admin) })
    }

    const user = await findRegisteredUser(normalizedEmail)
    if (!user) return res.status(401).json({ error: 'Credenciales incorrectas' })

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ error: 'Credenciales incorrectas' })

    res.json({ token: signToken(user), user: publicUser(user) })
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesion: ' + error.message })
  }
})

router.post('/forgot-password', async (req, res) => {
  const email = normalizeEmail(req.body?.email)
  if (!email) return res.status(400).json({ error: 'Debes ingresar un correo valido' })

  try {
    let account = null

    if (isAdminEmail(email)) {
      account = getInjectedAdminUser()
    } else {
      account = await findRegisteredUser(email)
    }

    if (!account) {
      return res.status(404).json({ error: 'No existe una cuenta con ese correo' })
    }

    const code = createResetCode(email)
    const ttlMinutes = getResetTtlMinutes()
    const hasMailer = mailerConfigured()

    if (hasMailer) {
      const sent = await sendPasswordResetCodeEmail({
        to: email,
        nombre: account.nombre,
        codigo: code,
        minutes: ttlMinutes,
      })

      if (!sent) {
        return res.status(500).json({ error: 'No se pudo enviar el codigo de recuperacion' })
      }
    }

    res.json({
      message: hasMailer
        ? 'Codigo enviado. Revisa tu correo.'
        : 'SMTP no configurado. Usa el codigo de prueba mostrado abajo.',
      expiresInMinutes: ttlMinutes,
      debugCode: hasMailer ? undefined : code,
    })
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar codigo: ' + error.message })
  }
})

router.post('/reset-password', async (req, res) => {
  const email = normalizeEmail(req.body?.email)
  const code = String(req.body?.code || '').trim()
  const password = String(req.body?.password || '')

  if (!email) return res.status(400).json({ error: 'Debes ingresar un correo valido' })
  if (!RESET_CODE_REGEX.test(code)) return res.status(400).json({ error: 'El codigo debe tener 6 digitos' })
  if (password.length < 6) {
    return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' })
  }
  if (!consumeResetCode(email, code)) {
    return res.status(400).json({ error: 'Codigo invalido o vencido' })
  }

  try {
    if (isAdminEmail(email)) {
      await resetAdminPassword(password)
      return res.json({ ok: true, message: 'Contraseña actualizada con exito' })
    }

    const user = await findRegisteredUser(email)
    if (!user) return res.status(404).json({ error: 'No existe una cuenta con ese correo' })

    const hash = await bcrypt.hash(password, 10)
    await pool.query('UPDATE usuarios SET password = ? WHERE email = ?', [hash, email])
    res.json({ ok: true, message: 'Contraseña actualizada con exito' })
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar contraseña: ' + error.message })
  }
})

router.get('/me', requireAuth, async (req, res) => {
  if (isAdminUser(req.user)) {
    return res.json({ user: publicUser(getInjectedAdminUser()) })
  }

  const [rows] = await pool.query('SELECT * FROM usuarios WHERE id = ?', [req.user.id])
  if (!rows.length) return res.status(404).json({ error: 'Usuario no encontrado' })
  res.json({ user: publicUser(rows[0]) })
})

export default router
