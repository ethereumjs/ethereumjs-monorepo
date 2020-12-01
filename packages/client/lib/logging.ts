import chalk from 'chalk'
import { createLogger, format, transports, Logger as WinstonLogger } from 'winston'

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

function logFormat() {
  return printf((info: any) => {
    // @ts-ignore: implicitly has an 'any' TODO
    const color = chalk[levelColors[info.level]].bind(chalk)
    const level = color(info.level.toUpperCase())
    const re = /(\w+)=(.+?)(?:\s|$)/g
    info.message = info.message.replace(
      re,
      (_: any, tag: string, char: string) => `${color(tag)}=${char} `
    )
    return `${level} [${info.timestamp}] ${info.message}`
  })
}

export function getLogger(options = { loglevel: 'info' }) {
  const loggerOptions: any = {
    format: combine(
      errorFormat(),
      format.splat(),
      label({ label: 'ethereumjs' }),
      timestamp({ format: 'MM-DD|HH:mm:ss' }),
      logFormat()
    ),
    level: options.loglevel,
    silent: options.loglevel === 'off',
    transports: [new transports.Console()],
  }

  const logger = createLogger(loggerOptions)
  return logger
}
