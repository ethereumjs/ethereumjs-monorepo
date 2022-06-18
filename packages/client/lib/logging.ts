import * as chalk from 'chalk'
import { createLogger, format, transports as wTransports, Logger as WinstonLogger } from 'winston'
const DailyRotateFile = require('winston-daily-rotate-file')

export type Logger = WinstonLogger

const { combine, timestamp, label, printf } = format

/**
 * Attention API
 *
 * If set string will be displayed on all log messages
 */
let attentionHF: string | null = null
let attentionCL: string | null = null

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
 *
 * Optional info parameters:
 * `attentionCL`: pass in string to `info.attentionCL` to set and permanently
 * display and `null` to deactivate
 * `attentionHF`: pass in string to `info.attentionHF` to set and permanently
 * display and `null` to deactivate
 *
 */
function logFormat(colors = false) {
  return printf((info: any) => {
    let level = info.level.toUpperCase()

    if (!info.message) info.message = '(empty message)'

    if (colors) {
      const colorLevel = LevelColors[info.level as keyof typeof LevelColors]
      const color = chalk.keyword(colorLevel).bind(chalk)
      level = color(level)

      const regex = /(\w+)=(.+?)(?:\s|$)/g
      const replaceFn = (_: any, tag: string, char: string) => `${color(tag)}=${char} `
      info.message = info.message.replace(regex, replaceFn)
      if (info.attentionCL) info.attentionCL = info.attentionCL.replace(regex, replaceFn)
      if (info.attentionHF) info.attentionHF = info.attentionHF.replace(regex, replaceFn)
    }

    if (info.attentionCL !== undefined) attentionCL = info.attentionCL
    if (info.attentionHF !== undefined) attentionHF = info.attentionHF
    const CLLog = attentionCL !== null ? `[ ${attentionCL} ] ` : ''
    const HFLog = attentionHF !== null ? `[ ${attentionHF} ] ` : ''

    const msg = `[${info.timestamp}] ${level} ${CLLog}${HFLog}${info.message}`
    return msg
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
