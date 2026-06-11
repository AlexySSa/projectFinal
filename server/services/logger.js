import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOG_DIR = path.join(__dirname, '..', 'logs')
const ERROR_LOG = path.join(LOG_DIR, 'errors.log')

function ensureDir() {
  try {
    if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true })
  } catch {
  }
}

export function logError(scope, error, extra = {}) {
  const msg = error?.message || String(error)
  const line = JSON.stringify({
    ts: new Date().toISOString(),
    scope,
    error: msg,
    ...extra,
  })
  console.error(`[${scope}]`, msg, extra)
  try {
    ensureDir()
    fs.appendFileSync(ERROR_LOG, line + '\n')
  } catch {
  }
}
