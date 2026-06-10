import { pool } from '../db.js'

function fmtFecha(d = new Date()) {
  const dt = typeof d === 'string' ? new Date(d) : d
  const dd = String(dt.getDate()).padStart(2, '0')
  const mm = String(dt.getMonth() + 1).padStart(2, '0')
  return `${dd}/${mm}/${dt.getFullYear()}`
}

const round2 = (n) => Math.round(Number(n) * 100) / 100

function desglosar(total) {
  const rate = Number(process.env.TAX_RATE) || 0
  const t = round2(total)
  if (rate > 0) {
    const subtotal = round2(t / (1 + rate))
    return { subtotal, impuesto: round2(t - subtotal), total: t }
  }
  return { subtotal: t, impuesto: 0, total: t }
}

function construirDatos({ vehiculoTitulo, inicio, fin, dias, total }) {
  const { subtotal, impuesto, total: tot } = desglosar(total)
  const items = [
    {
      descripcion: `Renta de ${vehiculoTitulo} (${fmtFecha(inicio)} a ${fmtFecha(fin)})`,
      cantidad: Number(dias) || 1,
      precioUnitario: round2(subtotal / (Number(dias) || 1)),
      importe: subtotal,
    },
  ]
  return { items, subtotal, impuesto, total: tot }
}

export async function crearFactura({
  reservaId,
  usuarioId,
  clienteNombre,
  clienteEmail,
  vehiculoTitulo,
  inicio,
  fin,
  dias,
  total,
  metodoPago = 'PayPal',
  estado = 'paid',
  paypalOrderId = null,
  moneda = 'USD',
}) {
  const datos = construirDatos({ vehiculoTitulo, inicio, fin, dias, total })
  const conn = await pool.getConnection()
  try {
    await conn.beginTransaction()

    const provisional = `TMP-${Date.now()}-${Math.floor(Math.random() * 1e6)}`
    const [r] = await conn.query(
      `INSERT INTO facturas
        (numero, reserva_id, usuario_id, nombre_cliente, email_cliente,
         subtotal, impuesto, total, moneda, metodo_pago, estado, paypal_order_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        provisional, reservaId || null, usuarioId || null, clienteNombre || null,
        clienteEmail || null, datos.subtotal, datos.impuesto, datos.total, moneda,
        metodoPago, estado, paypalOrderId,
      ]
    )
    const facturaId = r.insertId
    const numero = `BAHN-${new Date().getFullYear()}-${String(facturaId).padStart(6, '0')}`
    await conn.query('UPDATE facturas SET numero = ? WHERE id = ?', [numero, facturaId])

    for (const it of datos.items) {
      await conn.query(
        `INSERT INTO detalle_factura (factura_id, descripcion, cantidad, precio_unitario, importe)
         VALUES (?, ?, ?, ?, ?)`,
        [facturaId, it.descripcion, it.cantidad, it.precioUnitario, it.importe]
      )
    }

    await conn.commit()

    return {
      id: facturaId,
      numero,
      fecha: fmtFecha(),
      moneda,
      metodoPago,
      estado,
      cliente: { nombre: clienteNombre, email: clienteEmail },
      ...datos,
    }
  } catch (e) {
    await conn.rollback()
    throw e
  } finally {
    conn.release()
  }
}

export async function obtenerFacturaCompleta(id) {
  const [rows] = await pool.query('SELECT * FROM facturas WHERE id = ?', [id])
  if (!rows.length) return null
  const f = rows[0]
  const [items] = await pool.query('SELECT * FROM detalle_factura WHERE factura_id = ?', [id])
  return {
    id: f.id,
    numero: f.numero,
    fecha: fmtFecha(f.creado_en),
    moneda: f.moneda,
    metodoPago: f.metodo_pago,
    estado: f.estado,
    usuarioId: f.usuario_id,
    cliente: { nombre: f.nombre_cliente, email: f.email_cliente },
    subtotal: Number(f.subtotal),
    impuesto: Number(f.impuesto),
    total: Number(f.total),
    items: items.map((it) => ({
      descripcion: it.descripcion,
      cantidad: it.cantidad,
      precioUnitario: Number(it.precio_unitario),
      importe: Number(it.importe),
    })),
  }
}

export async function facturasDeUsuario(usuarioId) {
  const [rows] = await pool.query(
    'SELECT id, numero, total, moneda, metodo_pago, estado, creado_en FROM facturas WHERE usuario_id = ? ORDER BY creado_en DESC',
    [usuarioId]
  )
  return rows.map((f) => ({
    id: f.id,
    numero: f.numero,
    total: Number(f.total),
    moneda: f.moneda,
    metodoPago: f.metodo_pago,
    estado: f.estado,
    fecha: fmtFecha(f.creado_en),
  }))
}

export async function marcarEmailEnviado(id) {
  await pool.query('UPDATE facturas SET email_enviado = 1 WHERE id = ?', [id])
}

export async function facturaPorOrden(orderId) {
  const [rows] = await pool.query('SELECT * FROM facturas WHERE paypal_order_id = ?', [orderId])
  return rows[0] || null
}

export async function actualizarEstadoPorOrden(orderId, estado) {
  await pool.query('UPDATE facturas SET estado = ? WHERE paypal_order_id = ?', [estado, orderId])
}
