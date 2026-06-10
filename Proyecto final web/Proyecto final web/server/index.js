import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { pool } from './db.js'
import authRoutes from './routes/auth.js'
import vehiculosRoutes from './routes/vehiculos.js'
import favoritosRoutes from './routes/favoritos.js'
import reservasRoutes from './routes/reservas.js'
import paypalRoutes from './routes/paypal.js'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json({ limit: '20mb' }))

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1')
    res.json({ ok: true, db: 'conectada' })
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message })
  }
})

app.use('/api/auth', authRoutes)
app.use('/api/vehiculos', vehiculosRoutes)
app.use('/api/favoritos', favoritosRoutes)
app.use('/api/reservas', reservasRoutes)
app.use('/api/paypal', paypalRoutes)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Servidor Bahn escuchando en http://localhost:${PORT}`)
})
