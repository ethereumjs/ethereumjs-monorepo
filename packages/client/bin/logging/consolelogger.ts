import type { Logger } from '../../src/types.ts'

export class ConsoleLogger implements Logger {
  info(message: string, ...meta: any[]) {
    console.info(`[INFO] ${message}`, ...meta)
  }

  warn(message: string, ...meta: any[]) {
    console.warn(`[WARN] ${message}`, ...meta)
  }

  error(message: string, ...meta: any[]) {
    console.error(`[ERROR] ${message}`, ...meta)
  }

  debug(message: string, ...meta: any[]) {
    if (process.env.DEBUG !== undefined) console.debug(`[DEBUG] ${message}`, ...meta)
  }

  isInfoEnabled() {
    return true
  }

  configure(args: { [key: string]: any }) {
    // TODO
  }

  getLevel() {
    // TODO
  }
}

export function getLogger(args: { [key: string]: any } = { logLevel: 'info' }) {
  const logger = new ConsoleLogger()
  return logger as Logger
}
