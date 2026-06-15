import { Router } from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'

const router = Router()

function parseFotos(raw) {
  if (!raw) return []
  try {
    const v = JSON.parse(raw)
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

router.get('/', requireAuth, async (req, res) => {
  if (req.user?.rol === 'admin') return res.status(403).json({ error: 'El admin no usa favoritos' })
  const [rows] = await pool.query(
    `SELECT v.* FROM vehiculos v
     JOIN favoritos f ON f.vehiculo_id = v.id
     WHERE f.usuario_id = ?
     ORDER BY f.creado_en DESC`,
    [req.user.id]
  )
  res.json(
    rows.map((row) => ({
      id: row.id,
      titulo: row.titulo,
      categoria: row.categoria,
      marca: row.marca,
      modelo: row.modelo,
      tarifa: Number(row.tarifa),
      direccion: row.direccion,
      fotos: parseFotos(row.fotos),
    }))
  )
})

router.get('/ids', requireAuth, async (req, res) => {
  if (req.user?.rol === 'admin') return res.status(403).json({ error: 'El admin no usa favoritos' })
  const [rows] = await pool.query('SELECT vehiculo_id FROM favoritos WHERE usuario_id = ?', [req.user.id])
  res.json(rows.map((r) => r.vehiculo_id))
})

router.post('/:id', requireAuth, async (req, res) => {
  if (req.user?.rol === 'admin') return res.status(403).json({ error: 'El admin no usa favoritos' })
  const vehiculoId = Number(req.params.id)
  try {
    const [exists] = await pool.query(
      'SELECT 1 FROM favoritos WHERE usuario_id = ? AND vehiculo_id = ?',
      [req.user.id, vehiculoId]
    )
    if (exists.length) {
      await pool.query('DELETE FROM favoritos WHERE usuario_id = ? AND vehiculo_id = ?', [
        req.user.id, vehiculoId,
      ])
      return res.json({ favorito: false })
    }
    await pool.query('INSERT INTO favoritos (usuario_id, vehiculo_id) VALUES (?, ?)', [
      req.user.id, vehiculoId,
    ])
    res.json({ favorito: true })
  } catch (e) {
    res.status(500).json({ error: 'Error al actualizar favoritos: ' + e.message })
  }
})

export default router
