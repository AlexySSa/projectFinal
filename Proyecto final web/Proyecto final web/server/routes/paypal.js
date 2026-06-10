import { Router } from 'express'
import { pool } from '../db.js'
import { optionalAuth } from '../middleware/auth.js'
import { paypalConfigured, createOrder, captureOrder } from '../paypalClient.js'
import { hayConflicto } from '../availability.js'

const FECHAS_OCUPADAS = 'Esas fechas ya están reservadas para este vehículo. Elige otro rango.'

const router = Router()

async function guardarReserva(reserva, orderId, estado, usuarioId) {
  const [r] = await pool.query(
    `INSERT INTO reservas
      (vehiculo_id, usuario_id, inicio, fin, dias, total, nombre, metodo, estado, paypal_order_id)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'PayPal', ?, ?)`,
    [
      reserva.vehiculoId, usuarioId || null, reserva.inicio, reserva.fin,
      reserva.dias, reserva.total, reserva.nombre || null, estado, orderId,
    ]
  )
  return r.insertId
}

router.get('/config', (req, res) => {
  res.json({ configured: paypalConfigured() })
})

router.post('/create-order', optionalAuth, async (req, res) => {
  const { total, reserva } = req.body
  try {
    if (reserva && reserva.vehiculoId) {
      if (await hayConflicto(reserva.vehiculoId, reserva.inicio, reserva.fin)) {
        return res.status(409).json({ error: FECHAS_OCUPADAS })
      }
    }
    if (!paypalConfigured()) {
      return res.json({ id: 'SIM-' + Date.now(), simulated: true })
    }
    const order = await createOrder(total)
    res.json({ id: order.id })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/capture/:orderId', optionalAuth, async (req, res) => {
  const { orderId } = req.params
  const { reserva } = req.body
  if (!reserva || !reserva.vehiculoId) {
    return res.status(400).json({ error: 'Faltan datos de la reserva' })
  }
  try {
    if (await hayConflicto(reserva.vehiculoId, reserva.inicio, reserva.fin)) {
      return res.status(409).json({ error: FECHAS_OCUPADAS })
    }

    let estado = 'confirmada'
    let captura = { status: 'COMPLETED', simulated: true }

    if (paypalConfigured()) {
      captura = await captureOrder(orderId)
      estado = captura.status === 'COMPLETED' ? 'confirmada' : 'pendiente'
    }

    const reservaId = await guardarReserva(reserva, orderId, estado, req.user?.id)
    res.json({ status: captura.status, simulated: captura.simulated || false, reservaId })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
