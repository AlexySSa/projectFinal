process.on('uncaughtException', (error) => {
  console.error('[startup][uncaughtException]', error)
})

process.on('unhandledRejection', (reason) => {
  console.error('[startup][unhandledRejection]', reason)
})

import('./server/index.js').catch((error) => {
  console.error('[startup][import-error]', error)
  process.exit(1)
})
