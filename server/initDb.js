import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mysql from 'mysql2/promise'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function main() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8')

  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  })

  console.log('Creando base de datos y tablas...')
  await conn.query(schema)
  await conn.query(`USE ${process.env.DB_NAME || 'bahn'}`)

  const demoEmail = 'demo@bahn.com'
  const [existing] = await conn.query('SELECT id FROM usuarios WHERE email = ?', [demoEmail])
  let ownerId
  if (existing.length) {
    ownerId = existing[0].id
    console.log('Usuario demo ya existe.')
  } else {
    const hash = await bcrypt.hash('demo1234', 10)
    const [r] = await conn.query(
      'INSERT INTO usuarios (nombre, email, password, telefono, rol) VALUES (?, ?, ?, ?, ?)',
      ['Alexy Sanchez', demoEmail, hash, '0000-0000', 'arrendador']
    )
    ownerId = r.insertId
    console.log('Usuario demo creado:  demo@bahn.com  /  demo1234  (arrendador)')
  }

  const [veh] = await conn.query('SELECT id FROM vehiculos WHERE titulo = ?', ['Yamaha-R7 2025'])
  if (veh.length) {
    console.log('Vehículo de prueba ya existe.')
  } else {
    await conn.query(
      `INSERT INTO vehiculos
        (titulo, categoria, marca, modelo, anio, km, condicion, color, tarifa, descripcion,
         direccion, direccion_completa, placa, titular, peso, fotos, owner_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'Yamaha-R7 2025', 'Motocicletas', 'Yamaha', 'R7', 2023, 8000, 'Excelente', 'Negro', 25,
        'Yamaha R7 en perfectas condiciones, corre lona y lista para usar, todos los mantenimientos al día, no te dejará botado.',
        'San Miguel, San Miguel', 'Col. La Pradera, San Miguel Centro, San Miguel, El Salvador',
        'P 859 623', 'Alexy Ariel Sanchez Suriano', 'Liviano',
        JSON.stringify(['/img/yamaha-1.jpg', '/img/yamaha-2.jpg', '/img/yamaha-3.jpg']),
        ownerId,
      ]
    )
    console.log('Vehículo de prueba (Yamaha-R7 2025) creado.')
  }

  await conn.end()
  console.log('Listo. Base de datos inicializada.')
}

main().catch((e) => {
  console.error('Error inicializando la base de datos:', e.message)
  process.exit(1)
})
