import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const schemaPath = path.join(__dirname, 'schema.sql')

export function resolveDbHost(host) {
  return !host || host === 'localhost' ? '127.0.0.1' : host
}

export function getDbName() {
  return process.env.DB_NAME || 'bahn'
}

function escapeIdentifier(value) {
  return `\`${String(value).replace(/`/g, '``')}\``
}

function getBaseConfig() {
  return {
    host: resolveDbHost(process.env.DB_HOST),
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    connectTimeout: 10000,
  }
}

function loadSchema() {
  return fs.readFileSync(schemaPath, 'utf8')
}

async function ensureUsuariosDuiColumn(conn, dbName) {
  const [duiCol] = await conn.query(
    `SELECT COLUMN_NAME FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'usuarios' AND COLUMN_NAME = 'dui'`,
    [dbName]
  )

  if (!duiCol.length) {
    await conn.query('ALTER TABLE usuarios ADD COLUMN dui VARCHAR(10) AFTER telefono')
    console.log('[db] Columna dui agregada a la tabla usuarios.')
  }
}

async function applySchema(conn, dbName) {
  await conn.query(loadSchema())
  await ensureUsuariosDuiColumn(conn, dbName)
}

export async function createDatabaseConnection() {
  return mysql.createConnection({
    ...getBaseConfig(),
    database: getDbName(),
    multipleStatements: true,
  })
}

export async function ensureDatabaseSchema() {
  const dbName = getDbName()

  try {
    const conn = await createDatabaseConnection()
    try {
      await applySchema(conn, dbName)
    } finally {
      await conn.end()
    }
    return
  } catch (error) {
    if (error.code !== 'ER_BAD_DB_ERROR') throw error
  }

  const conn = await mysql.createConnection({
    ...getBaseConfig(),
    multipleStatements: true,
  })

  try {
    await conn.query(
      `CREATE DATABASE IF NOT EXISTS ${escapeIdentifier(dbName)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
    )
    await conn.query(`USE ${escapeIdentifier(dbName)}`)
    await applySchema(conn, dbName)
  } finally {
    await conn.end()
  }
}
