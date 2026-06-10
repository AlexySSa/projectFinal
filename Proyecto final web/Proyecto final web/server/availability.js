import { pool } from './db.js'

export async function hayConflicto(vehiculoId, inicio, fin) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS n FROM reservas
     WHERE vehiculo_id = ? AND estado = 'confirmada'
       AND inicio < ? AND ? < fin`,
    [vehiculoId, fin, inicio]
  )
  return rows[0].n > 0
}

export async function rangosOcupados(vehiculoId) {
  const [rows] = await pool.query(
    `SELECT inicio, fin FROM reservas
     WHERE vehiculo_id = ? AND estado = 'confirmada'
     ORDER BY inicio`,
    [vehiculoId]
  )
  return rows
}
