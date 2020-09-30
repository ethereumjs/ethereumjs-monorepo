
/**
 * @module util
 */

exports.parse = require('./parse')
exports.short = (buffer: Buffer) => buffer.toString('hex').slice(0, 8) + '...'

export = exports