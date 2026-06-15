import bcrypt from 'bcryptjs'
import { createDatabaseConnection, ensureDatabaseSchema } from './dbSetup.js'

async function main() {
  console.log('Creando base de datos y tablas...')
  await ensureDatabaseSchema()

  const conn = await createDatabaseConnection()

  try {
    const [columnRows] = await conn.query('SHOW COLUMNS FROM usuarios')
    const hasDuiColumn = columnRows.some((row) => row.Field === 'dui')
    const demoEmail = 'demo@bahn.com'
    const [existing] = await conn.query('SELECT id FROM usuarios WHERE email = ?', [demoEmail])
    let ownerId

    if (existing.length) {
      ownerId = existing[0].id
      if (hasDuiColumn) {
        await conn.query('UPDATE usuarios SET dui = ? WHERE id = ? AND (dui IS NULL OR dui = "")', ['00000000-0', ownerId])
      }
      console.log('Usuario demo ya existe.')
    } else {
      const hash = await bcrypt.hash('demo1234', 10)
      const insertSql = hasDuiColumn
        ? 'INSERT INTO usuarios (nombre, email, password, telefono, dui, rol) VALUES (?, ?, ?, ?, ?, ?)'
        : 'INSERT INTO usuarios (nombre, email, password, telefono, rol) VALUES (?, ?, ?, ?, ?)'
      const insertParams = hasDuiColumn
        ? ['Alexy Sanchez', demoEmail, hash, '0000-0000', '00000000-0', 'arrendador']
        : ['Alexy Sanchez', demoEmail, hash, '0000-0000', 'arrendador']
      const [r] = await conn.query(insertSql, insertParams)
      ownerId = r.insertId
      console.log('Usuario demo creado:  demo@bahn.com  /  demo1234  (arrendador)')
    }

    const [veh] = await conn.query('SELECT id FROM vehiculos WHERE titulo = ?', ['Yamaha-R7 2025'])
    if (veh.length) {
      console.log('VehÃ­culo de prueba ya existe.')
    } else {
      await conn.query(
        `INSERT INTO vehiculos
          (titulo, categoria, marca, modelo, anio, km, condicion, color, tarifa, descripcion,
           direccion, direccion_completa, placa, titular, peso, fotos, owner_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          'Yamaha-R7 2025', 'Motocicletas', 'Yamaha', 'R7', 2023, 8000, 'Excelente', 'Negro', 25,
          'Yamaha R7 en perfectas condiciones, corre lona y lista para usar, todos los mantenimientos al dÃ­a, no te dejarÃ¡ botado.',
          'San Miguel, San Miguel', 'Col. La Pradera, San Miguel Centro, San Miguel, El Salvador',
          'P 859 623', 'Alexy Ariel Sanchez Suriano', 'Liviano',
          JSON.stringify(['/img/yamaha-1.jpg', '/img/yamaha-2.jpg', '/img/yamaha-3.jpg']),
          ownerId,
        ]
      )
      console.log('VehÃ­culo de prueba (Yamaha-R7 2025) creado.')
    }
  } finally {
    await conn.end()
  }

  console.log('Listo. Base de datos inicializada.')
}

main().catch((e) => {
  console.error('Error inicializando la base de datos:', e.message)
  process.exit(1)
})
