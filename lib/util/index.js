'use strict'

const { platform } = require('os')
const packageVersion = require('../../package.json').version

/**
 * @module util
 */

exports.parse = require('./parse')
exports.short = (buffer) => buffer.toString('hex').slice(0, 8) + '...'
exports.getClientVersion = () => {
  const { version } = process
  return `EthereumJS/${packageVersion}/${platform()}/node${version.substring(1)}`
}
