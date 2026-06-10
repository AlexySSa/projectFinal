import { Router } from 'express'
import { pool } from '../db.js'
import { requireAuth } from '../middleware/auth.js'
import { rangosOcupados } from '../availability.js'

const router = Router()

router.get('/ocupadas/:vehiculoId', async (req, res) => {
  try {
    const rangos = await rangosOcupados(req.params.vehiculoId)
    res.json(rangos)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.get('/', requireAuth, async (req, res) => {
  const [rows] = await pool.query(
    `SELECT r.*, v.titulo AS vehiculo_titulo
     FROM reservas r
     JOIN vehiculos v ON v.id = r.vehiculo_id
     WHERE r.usuario_id = ?
     ORDER BY r.creado_en DESC`,
    [req.user.id]
  )
  res.json(rows)
})

export default router
