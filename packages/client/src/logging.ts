import * as chalk from 'chalk'
import { createLogger, format, transports as wTransports } from 'winston'

import type { Logger as WinstonLogger } from 'winston'

const DailyRotateFile = require('winston-daily-rotate-file')

export type Logger = WinstonLogger
type LoggerArgs = { logFile: string; logLevelFile: 'error' | 'warn' | 'info' | 'debug' } & {
  logRotate?: Boolean
  logMaxFiles?: number
}

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
  if (info.message instanceof Error && info.message.stack !== undefined) {
    return { ...info, message: info.message.stack }
  }
  if (info instanceof Error && info.stack !== undefined) {
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
  return printf(
    (info: {
      level: string
      message: string | undefined
      [key: string]: string | null | undefined
    }) => {
      let level = info.level.toUpperCase()

      if (info.message === undefined) info.message = '(empty message)'

      if (colors) {
        const colorLevel = LevelColors[info.level as keyof typeof LevelColors]
        const color = chalk.keyword(colorLevel).bind(chalk)
        level = color(level)

        const regex = /(\w+)=(.+?)(?:\s|$)/g
        const replaceFn = (_: any, tag: string, char: string) => `${color(tag)}=${char} `
        info.message = info.message.replace(regex, replaceFn)
        if (typeof info.attentionCL === 'string')
          info.attentionCL = info.attentionCL.replace(regex, replaceFn)
        if (typeof info.attentionHF === 'string')
          info.attentionHF = info.attentionHF.replace(regex, replaceFn)
      }

      if (info.attentionCL !== undefined) attentionCL = info.attentionCL
      if (info.attentionHF !== undefined) attentionHF = info.attentionHF
      const CLLog = attentionCL !== null ? `[ ${attentionCL} ] ` : ''
      const HFLog = attentionHF !== null ? `[ ${attentionHF} ] ` : ''

      const msg = `[${info.timestamp}] ${level} ${CLLog}${HFLog}${info.message}`
      return msg
    }
  )
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
function logFileTransport(args: LoggerArgs) {
  let filename = args.logFile
  const opts = {
    level: args.logLevelFile,
    format: formatConfig(),
  }
  if (args.logRotate !== true) {
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
export function getLogger(args: { [key: string]: any } = { logLevel: 'info' }) {
  const transports: any[] = [
    new wTransports.Console({
      level: args.logLevel,
      silent: args.logLevel === 'off',
      format: formatConfig(true),
    }),
  ]
  if (typeof args.logFile === 'string') {
    transports.push(logFileTransport(args as LoggerArgs))
  }
  const logger = createLogger({
    transports,
    format: formatConfig(),
    level: args.logLevel,
  })
  return logger
}
