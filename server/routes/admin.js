import { Router } from 'express'
import { requireAdmin } from '../middleware/auth.js'
import { getAdminStats } from '../services/adminStats.js'

const router = Router()

router.get('/stats', requireAdmin, async (req, res) => {
  try {
    const stats = await getAdminStats()
    res.json(stats)
  } catch (error) {
    res.status(500).json({ error: 'Error al cargar estadisticas: ' + error.message })
  }
})

export default router
