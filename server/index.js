import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool } from './db.js'
import { ensureDatabaseSchema } from './dbSetup.js'
import authRoutes from './routes/auth.js'
import vehiculosRoutes from './routes/vehiculos.js'
import favoritosRoutes from './routes/favoritos.js'
import reservasRoutes from './routes/reservas.js'
import paypalRoutes from './routes/paypal.js'
import facturasRoutes from './routes/facturas.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.join(__dirname, '..', 'dist')
const hasDist = fs.existsSync(distDir)

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
app.use('/api/facturas', facturasRoutes)

console.log(`[startup] distDir=${distDir} exists=${hasDist}`)

if (hasDist) {
  app.use(express.static(distDir))

  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
  })
} else {
  console.warn(`[startup] Build output not found at ${distDir}`)
  app.get('/', (req, res) => {
    res
      .status(200)
      .type('text/plain')
      .send('Bahn backend running, but the frontend build was not found.')
  })
}

const PORT = process.env.PORT || 4000

async function startServer() {
  try {
    await ensureDatabaseSchema()
    app.listen(PORT, () => {
      console.log(`Servidor Bahn escuchando en el puerto ${PORT}`)
    })
  } catch (error) {
    console.error('[startup][db-setup-error]', error)
    process.exit(1)
  }
}

startServer()
