const pino = require('pino')

export function getLogger(options = { loglevel: 'info' }) {
  return pino({
    level: options.loglevel,
    base: null,
  })
}

export const defaultLogger = getLogger({ loglevel: 'debug' })
