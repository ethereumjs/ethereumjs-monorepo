'use strict'

const chalk = require('chalk')
const winston = require('winston')
const { createLogger, format, transports } = winston
const { combine, timestamp, label, printf } = format

const levelColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'white'
}

const errorFormat = format(info => {
  if (info.message instanceof Error && info.message.stack) {
    info.message = info.message.stack
  }
  if (info instanceof Error && info.stack) {
    return Object.assign({}, info, { message: info.stack })
  }
  return info
})

function logFormat () {
  return printf(info => {
    const color = chalk[levelColors[info.level]].bind(chalk)
    const level = color(info.level.toUpperCase())
    const re = /(\w+)=(.+?)(?:\s|$)/g
    info.message = info.message.replace(re, (_, tag, char) => `${color(tag)}=${char} `)
    return `${level} [${info.timestamp}] ${info.message}`
  })
}

function getLogger (options = { loglevel: 'info' }) {
  const logger = createLogger({
    format: combine(
      errorFormat(),
      format.splat(),
      label({ label: 'ethereumjs' }),
      timestamp({ format: 'MM-DD|HH:mm:ss' }),
      logFormat()
    ),
    level: options.loglevel,
    transports: [
      new transports.Console()
    ],
    exceptionHandlers: [
      new transports.Console()
    ]
  })
  return logger
}

exports.defaultLogger = getLogger({ loglevel: 'debug' })
exports.getLogger = getLogger
