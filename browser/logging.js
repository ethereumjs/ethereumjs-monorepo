'use strict'

const pino = require('pino')

function getLogger(options = { loglevel: 'info' }) {
  return pino({
    level: options.loglevel,
    base: null,
  })
}

exports.defaultLogger = getLogger({ loglevel: 'debug' })
exports.getLogger = getLogger
