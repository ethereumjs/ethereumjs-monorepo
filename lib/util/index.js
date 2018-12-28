'use strict'

/**
 * @module util
 */

exports.parse = require('./parse')
exports.short = (buffer) => buffer.toString('hex').slice(0, 8) + '...'
