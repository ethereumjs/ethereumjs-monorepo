import chalk from 'chalk'
import { createLogger, format, transports as wTransports, Logger as WinstonLogger } from 'winston'
const DailyRotateFile = require('winston-daily-rotate-file')

export type Logger = WinstonLogger

const { combine, timestamp, label, printf } = format

/**
 * Colors for logger levels
 */
enum LevelColors {
  error = 'red',
  warn = 'yellow',
  info = 'green',
  debug = 'white',
}

/**
 * Adds stack trace to error message if included
 */
const errorFormat = format((info: any) => {
  if (info.message instanceof Error && info.message.stack) {
    return { ...info, message: info.message.stack }
  }
  if (info instanceof Error && info.stack) {
    return { ...info, message: info.stack }
  }
  return info
})

/**
 * Returns the formatted log output optionally with colors enabled
 */
function logFormat(colors = false) {
  return printf((info: any) => {
    let level = info.level.toUpperCase()
    if (!info.message) {
      info.message = '(empty message)'
    }
    if (colors) {
      const colorLevel = LevelColors[info.level as keyof typeof LevelColors]
      const color = chalk.keyword(colorLevel).bind(chalk)
      level = color(level)
      const re = /(\w+)=(.+?)(?:\s|$)/g
      info.message = info.message.replace(
        re,
        (_: any, tag: string, char: string) => `${color(tag)}=${char} `
      )
    }
    return `[${info.timestamp}] ${level} ${info.message}`
  })
}

/**
 * Returns the complete logger format
 */
function formatConfig(colors = false) {
  return combine(
    errorFormat(),
    format.splat(),
    label({ label: 'ethereumjs' }),
    timestamp({ format: 'MM-DD|HH:mm:ss' }),
    logFormat(colors)
  )
}

/**
 * Returns a transport with log file saving (rotates if args.logRotate is true)
 */
function logFileTransport(args: any) {
  let filename = args.logFile === true ? 'ethereumjs.log' : args.logFile
  const opts = {
    level: args.logLevelFile,
    format: formatConfig(),
  }
  if (!args.logRotate) {
    return new wTransports.File({
      ...opts,
      filename,
    })
  } else {
    // Insert %DATE% before the last period
    const lastPeriod = filename.lastIndexOf('.')
    filename = `${filename.substring(0, lastPeriod)}.%DATE%${filename.substring(lastPeriod)}`
    return new DailyRotateFile({
      ...opts,
      filename,
      maxFiles: args.logMaxFiles,
    })
  }
}

/**
 * Returns a formatted {@link Logger}
 */
export function getLogger(args: { [key: string]: any } = { loglevel: 'info' }) {
  const transports: any[] = [
    new wTransports.Console({
      level: args.loglevel,
      silent: args.loglevel === 'off',
      format: formatConfig(true),
    }),
  ]
  if (args.logFile) {
    transports.push(logFileTransport(args))
  }
  const logger = createLogger({
    transports,
    format: formatConfig(),
  })
  return logger
}
