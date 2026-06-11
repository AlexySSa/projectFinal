import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

function resolveDbHost(host) {
  return !host || host === 'localhost' ? '127.0.0.1' : host
}

export const pool = mysql.createPool({
  host: resolveDbHost(process.env.DB_HOST),
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bahn',
  connectTimeout: 10000,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})
