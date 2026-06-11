import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { facturasDeUsuario, obtenerFacturaCompleta } from '../services/invoiceService.js'
import { generarFacturaPdf } from '../services/invoicePdf.js'
import { logError } from '../services/logger.js'

const router = Router()

router.get('/', requireAuth, async (req, res) => {
  try {
    const facturas = await facturasDeUsuario(req.user.id)
    res.json(facturas)
  } catch (e) {
    res.status(500).json({ error: 'Error al obtener facturas: ' + e.message })
  }
})

router.get('/:id/pdf', requireAuth, async (req, res) => {
  try {
    const factura = await obtenerFacturaCompleta(req.params.id)
    if (!factura) return res.status(404).json({ error: 'Factura no encontrada' })
    if (factura.usuarioId !== req.user.id) {
      return res.status(403).json({ error: 'No tienes permiso para ver esta factura' })
    }
    const pdf = await generarFacturaPdf(factura)
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="factura-${factura.numero}.pdf"`)
    res.send(pdf)
  } catch (e) {
    logError('factura-pdf', e, { id: req.params.id })
    res.status(500).json({ error: 'Error al generar el PDF: ' + e.message })
  }
})

export default router
