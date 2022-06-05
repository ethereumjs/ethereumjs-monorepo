import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pino = require('pino')

export function getLogger(options = { loglevel: 'info' }) {
  return pino({
    level: options.loglevel,
    base: null,
  })
}

export const defaultLogger = getLogger({ loglevel: 'debug' })
