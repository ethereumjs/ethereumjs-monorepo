import chalk from 'chalk'
import { createLogger, format, transports as wTransports, Logger as WinstonLogger } from 'winston'
const DailyRotateFile = require('winston-daily-rotate-file')

export type Logger = WinstonLogger

const levelColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'white',
}

const { combine, timestamp, label, printf } = format

const errorFormat = format((info: any) => {
  if (info.message instanceof Error && info.message.stack) {
    info.message = info.message.stack
  }
  if (info instanceof Error && info.stack) {
    return Object.assign({}, info, { message: info.stack })
  }
  return info
})

function logFormat(colors = true) {
  return printf((info: any) => {
    let level = info.level.toUpperCase()
    if (colors) {
      // @ts-ignore: implicitly has an 'any' TODO
      const color = chalk[levelColors[info.level]].bind(chalk)
      level = color(info.level.toUpperCase())
      const re = /(\w+)=(.+?)(?:\s|$)/g
      info.message = info.message.replace(
        re,
        (_: any, tag: string, char: string) => `${color(tag)}=${char} `
      )
    }
    return `${level} [${info.timestamp}] ${info.message}`
  })
}

function formatConfig(colors = true) {
  return combine(
    errorFormat(),
    format.splat(),
    label({ label: 'ethereumjs' }),
    timestamp({ format: 'MM-DD|HH:mm:ss' }),
    logFormat(colors)
  )
}

export function getLogger(args: { [key: string]: any } = { loglevel: 'info' }) {
  const transports: any[] = [
    new wTransports.Console({
      level: args.loglevel,
      silent: args.loglevel === 'off',
      format: formatConfig(),
    }),
  ]
  let filename = args.logFile === true ? 'ethereumjs.log' : args.logFile
  if (filename) {
    const opts = {
      level: args.logLevelFile,
      format: formatConfig(false),
    }
    if (args.logRotate) {
      // Insert %DATE% before the last period
      const lastPeriod = filename.lastIndexOf('.')
      filename = `${filename.substring(0, lastPeriod)}.%DATE%${filename.substring(lastPeriod)}`
      transports.push(
        new DailyRotateFile({
          ...opts,
          filename,
          maxFiles: args.logMaxFiles,
        })
      )
    } else {
      transports.push(
        new wTransports.File({
          ...opts,
          filename,
        })
      )
    }
  }

  const logger = createLogger({ format: formatConfig(), transports })
  if (filename) {
    logger.debug(`Writing log file=${filename}`)
  }
  return logger
}
