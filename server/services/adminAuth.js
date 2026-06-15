import bcrypt from 'bcryptjs'

const ADMIN_ID = 'admin-root'
const ADMIN_NAME = process.env.ADMIN_NAME || 'Admin Bahn'
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@bahn.com').trim().toLowerCase()
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

let adminPasswordHash = bcrypt.hashSync(DEFAULT_ADMIN_PASSWORD, 10)

export function getInjectedAdminUser() {
  return {
    id: ADMIN_ID,
    nombre: ADMIN_NAME,
    email: ADMIN_EMAIL,
    rol: 'admin',
    telefono: null,
    dui: null,
  }
}

export function getAdminEmail() {
  return ADMIN_EMAIL
}

export function isAdminEmail(email = '') {
  return String(email).trim().toLowerCase() === ADMIN_EMAIL
}

export function isAdminUser(user) {
  return user?.rol === 'admin' && isAdminEmail(user?.email)
}

export async function authenticateAdmin(email, password) {
  if (!isAdminEmail(email)) return null
  const ok = await bcrypt.compare(password || '', adminPasswordHash)
  return ok ? getInjectedAdminUser() : null
}

export async function resetAdminPassword(newPassword) {
  adminPasswordHash = await bcrypt.hash(newPassword, 10)
  return getInjectedAdminUser()
}
