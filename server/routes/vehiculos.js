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

function mapVehiculo(row) {
  return {
    id: row.id,
    titulo: row.titulo,
    categoria: row.categoria,
    marca: row.marca,
    modelo: row.modelo,
    anio: row.anio,
    km: row.km,
    condicion: row.condicion,
    color: row.color,
    tarifa: Number(row.tarifa),
    descripcion: row.descripcion,
    direccion: row.direccion,
    direccionCompleta: row.direccion_completa,
    placa: row.placa,
    titular: row.titular,
    peso: row.peso,
    fotos: parseFotos(row.fotos),
    owner: row.owner_id,
  }
}

router.get('/', async (req, res) => {
  const { q, categoria } = req.query
  const where = []
  const params = []
  if (categoria) {
    where.push('categoria = ?')
    params.push(categoria)
  }
  if (q) {
    where.push('(titulo LIKE ? OR marca LIKE ? OR modelo LIKE ?)')
    params.push(`%${q}%`, `%${q}%`, `%${q}%`)
  }
  const sql = `SELECT * FROM vehiculos ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY creado_en DESC`
  const [rows] = await pool.query(sql, params)
  res.json(rows.map(mapVehiculo))
})

router.get('/mios', requireAuth, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM vehiculos WHERE owner_id = ? ORDER BY creado_en DESC', [req.user.id])
  res.json(rows.map(mapVehiculo))
})

router.get('/:id', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM vehiculos WHERE id = ?', [req.params.id])
  if (!rows.length) return res.status(404).json({ error: 'Vehículo no encontrado' })
  res.json(mapVehiculo(rows[0]))
})

router.post('/', requireAuth, async (req, res) => {
  const b = req.body
  if (!b.titulo || !b.categoria) {
    return res.status(400).json({ error: 'Título y categoría son obligatorios' })
  }
  try {
    const [r] = await pool.query(
      `INSERT INTO vehiculos
        (titulo, categoria, marca, modelo, anio, km, condicion, color, tarifa, descripcion,
         direccion, direccion_completa, placa, titular, peso, fotos, owner_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        b.titulo, b.categoria, b.marca || null, b.modelo || null,
        b.anio || new Date().getFullYear(), b.km || 0, b.condicion || 'Excelente', b.color || null,
        Number(b.tarifa) || 0, b.descripcion || null, b.direccion || null,
        b.direccionCompleta || b.direccion || null, b.placa || null, b.titular || null,
        b.peso || null, JSON.stringify(Array.isArray(b.fotos) ? b.fotos : []), req.user.id,
      ]
    )
    const [rows] = await pool.query('SELECT * FROM vehiculos WHERE id = ?', [r.insertId])
    res.status(201).json(mapVehiculo(rows[0]))
  } catch (e) {
    res.status(500).json({ error: 'Error al crear el vehículo: ' + e.message })
  }
})

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT owner_id FROM vehiculos WHERE id = ?', [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'Vehículo no encontrado' })
    if (rows[0].owner_id !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta publicación' })
    }
    await pool.query('DELETE FROM vehiculos WHERE id = ?', [req.params.id])
    res.json({ ok: true })
  } catch (e) {
    res.status(500).json({ error: 'Error al eliminar el vehículo: ' + e.message })
  }
})

export default router
