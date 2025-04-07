import repl from 'repl'
import process from 'process'

import { createInlineClient } from '../src/util/index.ts'

import { startRPCServers } from './startRPC.ts'
import { generateClientConfig, getArgs } from './utils.ts'

import chalk from 'chalk'
import * as winston from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

import type { Common } from '@ethereumjs/common'
import type { GenesisState } from '@ethereumjs/util'
import { Logger as WinstonLoggerType } from 'winston'
import type { Config } from '../src/config.ts'
import type { EthereumClient } from '../src/index.ts'
import type { ClientOpts, Logger } from '../src/types.ts'

const { createLogger, format, transports: wTransports } = winston

// export type Logger = WinstonLogger
type LoggerArgs = { logFile: string; logLevelFile: 'error' | 'warn' | 'info' | 'debug' } & {
  logRotate?: boolean
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

const LevelColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'white',
} as const

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
      message: unknown
      [key: string]: unknown
    }) => {
      let level = info.level.toUpperCase()

      if (info.message === undefined) info.message = '(empty message)'

      if (colors) {
        const color = chalk[LevelColors[info.level as keyof typeof LevelColors]]
        level = color(level)

        const regex = /(\w+)=(.+?)(?:\s|$)/g
        const replaceFn = (_: any, tag: string, char: string) => `${color(tag)}=${char} `
        info.message = (info.message as string).replace(regex, replaceFn)
        if (typeof info.attentionCL === 'string')
          info.attentionCL = info.attentionCL.replace(regex, replaceFn)
        if (typeof info.attentionHF === 'string')
          info.attentionHF = info.attentionHF.replace(regex, replaceFn)
      }

      if (info.attentionCL !== undefined) attentionCL = info.attentionCL as string
      if (info.attentionHF !== undefined) attentionHF = info.attentionHF as string
      const CLLog = attentionCL !== null ? `[ ${attentionCL} ] ` : ''
      const HFLog = attentionHF !== null ? `[ ${attentionHF} ] ` : ''

      const msg = `[${info.timestamp}] ${level} ${CLLog}${HFLog}${info.message}`
      return msg
    },
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
    logFormat(colors),
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
    const logger = new DailyRotateFile({
      ...opts,
      filename,
      maxFiles: args.logMaxFiles,
    })
    return logger
  }
}

class WinstonLogger implements Logger {
  public logger

  constructor(logger: WinstonLoggerType) {
    this.logger = logger

    // Bind methods for logger instance
    this.info = this.info.bind(this)
    this.warn = this.warn.bind(this)
    this.error = this.error.bind(this)
    this.debug = this.debug.bind(this)
  }
  info(message: string, ...meta: any[]) {
    this.logger?.info(`${message}`, ...meta)
  }

  warn(message: string, ...meta: any[]) {
    this.logger?.warn(`${message}`, ...meta)
  }

  error(message: string, ...meta: any[]) {
    this.logger?.error(`${message}`, ...meta)
  }

  debug(message: string, ...meta: any[]) {
    this.logger?.debug(`${message}`, ...meta)
  }

  isInfoEnabled() {
    return this.logger?.isInfoEnabled()
  }

  configure(args: { [key: string]: any }) {
    this.logger?.configure(args)
  }

  getLevel() {
    return this.logger?.level
  }
}

const setupClient = async (
  config: Config,
  customGenesisState: GenesisState,
  common: Common,
  args: ClientOpts,
) => {
  const client = await createInlineClient(
    config,
    common,
    customGenesisState,
    args.dataDir ?? '',
    true,
  )
  const servers = startRPCServers(client, {
    rpc: true,
    rpcAddr: args.rpcAddr ?? '0.0.0.0',
    rpcPort: args.rpcPort ?? 8545,
    rpcEngine: true,
    rpcEngineAddr: args.rpcEngineAddr ?? '0.0.0.0',
    rpcEnginePort: args.rpcEnginePort ?? 8551,
    ws: false,
    wsPort: args.wsPort ?? 0,
    wsAddr: args.wsAddr ?? '0.0.0.0',
    wsEngineAddr: args.wsEngineAddr ?? '0.0.0.0',
    wsEnginePort: args.wsEnginePort ?? 8552,
    rpcDebug: args.rpcDebug ?? 'eth',
    rpcDebugVerbose: args.rpcDebugVerbose ?? 'false',
    helpRPC: args.helpRPC ?? false,
    jwtSecret: '',
    rpcEngineAuth: false,
    rpcCors: '',
  })

  return { client, executionRPC: servers[0], engineRPC: servers[1] }
}

const activateRPCMethods = async (replServer: repl.REPLServer, allRPCMethods: any) => {
  function defineRPCAction(context: repl.REPLServer, methodName: string, params: string) {
    let parsedParams
    if (params !== undefined && params.length > 0) {
      // only parse params if actually provided
      try {
        parsedParams = JSON.parse(params)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e)
      }
    }
    allRPCMethods[methodName]
      .handler(params === '' ? '[]' : parsedParams)
      /* eslint-disable no-console */
      .then((result: any) => console.log(result))
      .catch((err: any) => console.error(err))
    /* eslint-enable no-console */
    context.displayPrompt()
  }

  // activate all rpc methods (execution and engine) as repl commands
  for (const methodName of Object.keys(allRPCMethods)) {
    replServer.defineCommand(methodName, {
      help: `Execute ${methodName}. Example usage: .${methodName} [params].`, // TODO see if there is a better way to format or self document, here
      action(params) {
        defineRPCAction(this, methodName, params)
      },
    })
  }

  // TODO this assumes hardcoded winston logger is being changed, so check if not winston, don't allow logLevel as a command
  replServer.defineCommand('logLevel', {
    help: `Sets the log level.  Example usage: .logLevel info`,
    action(params) {
      const logger = (replServer.context.client as EthereumClient).config.logger
      if (logger === undefined || !(logger instanceof WinstonLoggerType)) {
        console.log('logLevel is only supported when using Winston logger.')
        this.displayPrompt()
        return
      }
      const level = params
      if (['debug', 'info', 'warn', 'error'].includes(level)) {
        // TODO type this out better so we don't have to cast to type
        for (const transport of logger.transports) {
          transport.level = level
        }
      } else {
        // eslint-disable-next-line no-console
        console.log('Invalid log level. Valid levels are: debug, info, warn, error.')
      }
      this.displayPrompt()
    },
  })
}

const setupRepl = async (args: ClientOpts & { logger: Logger | undefined }) => {
  const { config, customGenesisState, common } = await generateClientConfig(args)
  const { client, executionRPC, engineRPC } = await setupClient(
    config,
    customGenesisState!, // TODO: figure out if this param is mandatory
    common,
    args,
  )
  //@ts-expect-error  the `_methods` function is not documented in the jayson types
  const allRPCMethods = { ...executionRPC._methods, ...engineRPC._methods }

  const replServer = repl.start({
    prompt: 'EthJS > ',
    ignoreUndefined: true,
  })

  replServer.context.client = client
  replServer.on('exit', async () => {
    // eslint-disable-next-line no-console
    console.log('Exiting REPL...')
    await client.stop()
    replServer.close()
    process.exit()
  })

  await activateRPCMethods(replServer, allRPCMethods)

  // TODO define more commands similar to geth admin package to allow basic tasks like knowing when the client is fully synced
}

const args = getArgs()
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

// up the chain to logger instantiation, this file contains the `winston` import
const logger = createLogger({
  transports,
  format: formatConfig(),
  level: args.logLevel,
})
await setupRepl({ ...args, logger: new WinstonLogger(logger) })
