import PDFDocument from 'pdfkit'

const NAVY = '#22395a'
const ORANGE = '#e8722d'
const GRAY = '#5a6478'
const LIGHT = '#eef2fd'

function empresa() {
  return {
    nombre: process.env.COMPANY_NAME || 'Bahn S.A. de C.V.',
    direccion: process.env.COMPANY_ADDRESS || 'San Miguel, El Salvador',
    email: process.env.COMPANY_EMAIL || 'facturacion@bahn.com',
    telefono: process.env.COMPANY_PHONE || '+503 0000-0000',
  }
}

function money(n, moneda = 'USD') {
  return `${moneda} ${Number(n).toFixed(2)}`
}

export function generarFacturaPdf(factura) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: 'A4', margin: 50 })
      const chunks = []
      doc.on('data', (c) => chunks.push(c))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      const co = empresa()
      const moneda = factura.moneda || 'USD'
      const pageRight = doc.page.width - 50

      doc.rect(50, 45, doc.page.width - 100, 70).fill(NAVY)
      doc.fillColor('#ffffff').fontSize(28).font('Helvetica-Bold').text('Bahn', 66, 62)
      doc.fontSize(9).font('Helvetica').fillColor('#cdd6e6')
        .text('Renta de vehículos y maquinaria', 66, 94)
      doc.fillColor('#ffffff').fontSize(20).font('Helvetica-Bold')
        .text('FACTURA', 0, 66, { align: 'right', width: pageRight })
      doc.fontSize(10).font('Helvetica').fillColor('#cdd6e6')
        .text(`N.º ${factura.numero}`, 0, 94, { align: 'right', width: pageRight })

      let y = 140
      doc.fillColor(NAVY).fontSize(11).font('Helvetica-Bold').text('Emisor', 50, y)
      doc.fillColor(GRAY).fontSize(10).font('Helvetica')
      doc.text(co.nombre, 50, y + 16)
      doc.text(co.direccion, 50, y + 30)
      doc.text(co.email, 50, y + 44)
      doc.text(co.telefono, 50, y + 58)

      doc.fillColor(NAVY).fontSize(11).font('Helvetica-Bold').text('Cliente', 320, y)
      doc.fillColor(GRAY).fontSize(10).font('Helvetica')
      doc.text(factura.cliente.nombre || '—', 320, y + 16)
      doc.text(factura.cliente.email || '—', 320, y + 30)
      doc.text(`Fecha: ${factura.fecha}`, 320, y + 44)
      doc.text(`Método de pago: ${factura.metodoPago}`, 320, y + 58)

      y = 235
      doc.rect(50, y, doc.page.width - 100, 24).fill(LIGHT)
      doc.fillColor(NAVY).fontSize(10).font('Helvetica-Bold')
      doc.text('Descripción', 60, y + 7)
      doc.text('Cant.', 330, y + 7, { width: 40, align: 'right' })
      doc.text('P. unit.', 390, y + 7, { width: 70, align: 'right' })
      doc.text('Importe', 470, y + 7, { width: 75, align: 'right' })

      y += 30
      doc.font('Helvetica').fillColor('#1c2430')
      for (const it of factura.items) {
        doc.fontSize(10)
        doc.text(it.descripcion, 60, y, { width: 260 })
        doc.text(String(it.cantidad), 330, y, { width: 40, align: 'right' })
        doc.text(money(it.precioUnitario, moneda), 390, y, { width: 70, align: 'right' })
        doc.text(money(it.importe, moneda), 470, y, { width: 75, align: 'right' })
        const h = doc.heightOfString(it.descripcion, { width: 260 })
        y += Math.max(h, 14) + 8
        doc.moveTo(50, y - 4).lineTo(pageRight, y - 4).strokeColor('#e6e9f0').stroke()
      }

      y += 8
      const labelX = 360
      const valX = 470
      const row = (label, value, bold = false, color = '#1c2430') => {
        doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(bold ? 12 : 10).fillColor(color)
        doc.text(label, labelX, y, { width: 100, align: 'right' })
        doc.text(value, valX, y, { width: 75, align: 'right' })
        y += bold ? 22 : 18
      }
      row('Subtotal', money(factura.subtotal, moneda))
      if (Number(factura.impuesto) > 0) row('Impuestos', money(factura.impuesto, moneda))
      doc.moveTo(labelX, y).lineTo(pageRight, y).strokeColor('#cbd3e1').stroke()
      y += 8
      row('TOTAL PAGADO', money(factura.total, moneda), true, ORANGE)

      y += 16
      doc.fontSize(10).font('Helvetica-Bold').fillColor('#138a3f')
        .text(`Estado del pago: ${factura.estado.toUpperCase()}`, 50, y)
      y += 28
      doc.fontSize(13).font('Helvetica-Bold').fillColor(NAVY)
        .text('¡Gracias por tu compra!', 50, y)
      doc.fontSize(9).font('Helvetica').fillColor(GRAY)
        .text('Este documento es una factura generada automáticamente por Bahn.', 50, y + 20)

      doc.end()
    } catch (e) {
      reject(e)
    }
  })
}
