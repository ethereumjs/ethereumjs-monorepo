import { getFileSink } from '@logtape/file'
import type { Logger as LogtapeLoggerType } from '@logtape/logtape'
import {
  ansiColorFormatter,
  configure,
  getConsoleSink,
  getLogger as getLogtapeLogger,
} from '@logtape/logtape'
import type { Logger } from '../../src/types.ts'

const LEVELS: Record<string, number> = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
}

export class LogtapeLogger implements Logger {
  public logger: LogtapeLoggerType
  private logLevel: string

  constructor(logger: LogtapeLoggerType, logLevel: string = 'info') {
    this.logger = logger
    this.logLevel = logLevel

    // Bind methods for logger instance
    this.info = this.info.bind(this)
    this.warn = this.warn.bind(this)
    this.error = this.error.bind(this)
    this.debug = this.debug.bind(this)
  }

  info(message: string, ...meta: any[]) {
    this.logger.info(`${message}`, ...meta)
  }

  warn(message: string, ...meta: any[]) {
    this.logger.warn(`${message}`, ...meta)
  }

  error(message: string, ...meta: any[]) {
    this.logger.error(`${message}`, ...meta)
  }

  debug(message: string, ...meta: any[]) {
    this.logger.debug(`${message}`, ...meta)
  }

  isInfoEnabled() {
    return LEVELS[this.logLevel] >= LEVELS['info']
  }

  configure(args: { [key: string]: any }) {
    console.warn(
      'Dynamic configuration is not supported in LogtapeLogger. Please configure globally.',
    )
  }

  getLevel() {
    return this.logLevel
  }
}

export function getLogger(args: { [key: string]: any } = { logLevel: 'info' }): Logger {
  const sinks: { [key: string]: any } = {
    console: getConsoleSink({ formatter: ansiColorFormatter }),
  }

  if (typeof args.logFile === 'string') {
    sinks.file = getFileSink(args.logFile)
  }

  // TODO we have to keep getLogger synchronous and configure is async
  // Configure the global logtape settings.
  void configure({
    sinks,
    loggers: [
      {
        category: 'ethjs',
        lowestLevel: args.logLevel as any,
        // Use all configured sink names.
        sinks: Object.keys(sinks),
      },
    ],
  })

  const logger = getLogtapeLogger(['ethjs', 'client'])
  return new LogtapeLogger(logger, args.logLevel)
}
