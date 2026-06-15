import { Router } from 'express'
import { pool } from '../db.js'
import { optionalAuth } from '../middleware/auth.js'
import {
  paypalConfigured,
  createOrder,
  captureOrder,
  webhookConfigured,
  verifyWebhookSignature,
} from '../paypalClient.js'
import { hayConflicto } from '../availability.js'
import {
  crearFactura,
  facturaPorOrden,
  actualizarEstadoPorOrden,
  marcarEmailEnviado,
} from '../services/invoiceService.js'
import { generarFacturaPdf } from '../services/invoicePdf.js'
import { sendInvoiceEmail } from '../services/mailer.js'
import { logError } from '../services/logger.js'

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

async function facturarYNotificar({ reserva, orderId, usuario, reservaId }) {
  try {
    const existente = await facturaPorOrden(orderId)
    if (existente) return { facturaId: existente.id, numero: existente.numero }

    const [veh] = await pool.query('SELECT titulo FROM vehiculos WHERE id = ?', [reserva.vehiculoId])
    const vehiculoTitulo = veh[0]?.titulo || 'Vehículo'
    const clienteNombre = reserva.nombre || usuario?.nombre || 'Cliente'
    const clienteEmail = usuario?.email || null

    const factura = await crearFactura({
      reservaId,
      usuarioId: usuario?.id || null,
      clienteNombre,
      clienteEmail,
      vehiculoTitulo,
      inicio: reserva.inicio,
      fin: reserva.fin,
      dias: reserva.dias,
      total: reserva.total,
      metodoPago: 'PayPal',
      estado: 'paid',
      paypalOrderId: orderId,
    })

    try {
      const pdf = await generarFacturaPdf(factura)
      if (clienteEmail) {
        const enviado = await sendInvoiceEmail({
          to: clienteEmail,
          datos: {
            nombre: clienteNombre,
            numero: factura.numero,
            fecha: factura.fecha,
            descripcion: factura.items[0]?.descripcion || 'Renta de vehículo',
            total: factura.total.toFixed(2),
            metodoPago: factura.metodoPago,
            moneda: factura.moneda,
          },
          pdfBuffer: pdf,
        })
        if (enviado) await marcarEmailEnviado(factura.id)
      }
    } catch (e) {
      logError('invoice-pdf-email', e, { numero: factura.numero })
    }

    return { facturaId: factura.id, numero: factura.numero }
  } catch (e) {
    logError('facturar', e, { orderId })
    return null
  }
}

router.get('/config', (req, res) => {
  res.json({ configured: paypalConfigured() })
})

router.post('/create-order', optionalAuth, async (req, res) => {
  const { total, reserva } = req.body
  try {
    if (req.user?.rol === 'admin') {
      return res.status(403).json({ error: 'El admin no puede realizar reservas' })
    }
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
    if (req.user?.rol === 'admin') {
      return res.status(403).json({ error: 'El admin no puede realizar reservas' })
    }
    if (await hayConflicto(reserva.vehiculoId, reserva.inicio, reserva.fin)) {
      return res.status(409).json({ error: FECHAS_OCUPADAS })
    }

    let estado = 'confirmada'
    let captura = { status: 'COMPLETED', simulated: true }

    if (paypalConfigured()) {
      captura = await captureOrder(orderId)
      estado = captura.status === 'COMPLETED' ? 'confirmada' : 'pendiente'
    }

    const reservaId = await guardarReserva(reserva, orderId, estado, req.user?.id || null)

    let factura = null
    if (estado === 'confirmada') {
      factura = await facturarYNotificar({ reserva, orderId, usuario: req.user, reservaId })
    }

    res.json({
      status: captura.status,
      simulated: captura.simulated || false,
      reservaId,
      facturaId: factura?.facturaId || null,
      numeroFactura: factura?.numero || null,
    })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/webhook', async (req, res) => {
  const event = req.body
  try {
    if (!webhookConfigured()) {
      logError('webhook', 'PAYPAL_WEBHOOK_ID no configurado: evento ignorado', { type: event?.event_type })
      return res.sendStatus(200)
    }

    const valido = await verifyWebhookSignature(req.headers, event)
    if (!valido) {
      logError('webhook', 'Firma de webhook inválida', { type: event?.event_type })
      return res.sendStatus(400)
    }

    const orderId =
      event?.resource?.supplementary_data?.related_ids?.order_id ||
      event?.resource?.id

    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        if (orderId) await actualizarEstadoPorOrden(orderId, 'paid')
        break
      case 'PAYMENT.CAPTURE.REFUNDED':
        if (orderId) await actualizarEstadoPorOrden(orderId, 'refunded')
        break
      case 'PAYMENT.CAPTURE.DENIED':
        if (orderId) await actualizarEstadoPorOrden(orderId, 'failed')
        break
      default:
        break
    }
    res.sendStatus(200)
  } catch (e) {
    logError('webhook', e, { type: event?.event_type })
    res.sendStatus(500)
  }
})

export default router
