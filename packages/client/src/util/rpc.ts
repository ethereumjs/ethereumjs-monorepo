import { createServer } from 'http'
import { inspect } from 'util'
import bodyParser from 'body-parser'
import Connect from 'connect'
import cors from 'cors'
import jayson from 'jayson/promise/index.js'

import { jwt } from '../ext/jwt-simple.ts'

import type { IncomingMessage } from 'connect'
import type { TAlgorithm } from '../ext/jwt-simple.ts'
import type { Logger } from '../logging.ts'
import type { RPCManager } from '../rpc/index.ts'
const { json: JSONParser } = bodyParser
const { decode } = jwt

const algorithm: TAlgorithm = 'HS256'

type CreateRPCServerOpts = {
  methodConfig: MethodConfig
  rpcDebug: string
  rpcDebugVerbose: string
  logger?: Logger
}
type CreateRPCServerReturn = {
  server: jayson.Server
  methods: { [key: string]: Function }
  namespaces: string
}
type CreateRPCServerListenerOpts = {
  RPCCors?: string
  server: any
  withEngineMiddleware?: WithEngineMiddleware
}
type CreateWSServerOpts = CreateRPCServerListenerOpts & { httpServer?: jayson.HttpServer }
type WithEngineMiddleware = { jwtSecret: Uint8Array; unlessFn?: (req: IncomingMessage) => boolean }

export type MethodConfig = (typeof MethodConfig)[keyof typeof MethodConfig]

export const MethodConfig = {
  WithEngine: 'withengine',
  WithoutEngine: 'withoutengine',
  EngineOnly: 'engineonly',
} as const

/** Allowed drift for jwt token issuance is 60 seconds */
const ALLOWED_DRIFT = 60_000

/**
 * Check if the `method` matches the comma-separated filter string
 * @param method - Method to check the filter on
 * @param filterStringCSV - Comma-separated list of filters to use
 * @returns
 */
function checkFilter(method: string, filterStringCSV: string) {
  if (!filterStringCSV || filterStringCSV === '') {
    return false
  }
  if (filterStringCSV === 'all') {
    return true
  }
  const filters = filterStringCSV.split(',')
  for (const filter of filters) {
    if (method.includes(filter) === true) {
      return true
    }
  }
  return false
}

/**
 * Internal util to pretty print params for logging.
 */
export function inspectParams(params: any, shorten?: number) {
  let inspected = inspect(params, {
    colors: true,
    maxStringLength: 100,
  })
  if (typeof shorten === 'number') {
    inspected = inspected.replace(/\n/g, '').replace(/ {2}/g, ' ')
    if (inspected.length > shorten) {
      inspected = inspected.slice(0, shorten) + '...'
    }
  }
  return inspected
}

export function createRPCServer(
  manager: RPCManager,
  opts: CreateRPCServerOpts,
): CreateRPCServerReturn {
  const { methodConfig, rpcDebug, rpcDebugVerbose, logger } = opts
  const onRequest = (request: any) => {
    if (checkFilter(request.method, rpcDebugVerbose)) {
      logger?.info(`${request.method} called with params:\n${inspectParams(request.params)}`)
    } else if (checkFilter(request.method, rpcDebug)) {
      logger?.info(`${request.method} called with params: ${inspectParams(request.params, 125)}`)
    }
  }

  const handleResponse = (request: any, response: any, batchAddOn = '') => {
    if (checkFilter(request.method, rpcDebugVerbose)) {
      logger?.info(`${request.method}${batchAddOn} responded with:\n${inspectParams(response)}`)
    } else if (checkFilter(request.method, rpcDebug)) {
      logger?.info(
        `${request.method}${batchAddOn} responded with:\n${inspectParams(response, 125)}`,
      )
    }
  }

  const onBatchResponse = (request: any, response: any) => {
    // Batch request
    if (request.length !== undefined) {
      if (response.length === undefined || response.length !== request.length) {
        logger?.debug('Invalid batch request received.')
        return
      }
      for (let i = 0; i < request.length; i++) {
        handleResponse(request[i], response[i], ' (batch request)')
      }
    } else {
      handleResponse(request, response)
    }
  }

  let methods
  const ethMethods = manager.getMethods(false, rpcDebug !== 'false' && rpcDebug !== '')

  switch (methodConfig) {
    case MethodConfig.WithEngine:
      methods = {
        ...ethMethods,
        ...manager.getMethods(true, rpcDebug !== 'false' && rpcDebug !== ''),
      }
      break
    case MethodConfig.WithoutEngine:
      methods = { ...ethMethods }
      break
    case MethodConfig.EngineOnly: {
      /**
       * Filter eth methods which should be strictly exposed if only the engine is started:
       * https://github.com/ethereum/execution-apis/blob/6d2c035e4caafef7224cbb5fac7993b820bb61ce/src/engine/common.md#underlying-protocol
       * (Feb 3 2023)
       */
      const ethMethodsToBeIncluded = [
        'eth_blockNumber',
        'eth_call',
        'eth_chainId',
        'eth_getCode',
        'eth_getBlockByHash',
        'eth_getBlockByNumber',
        'eth_getLogs',
        'eth_sendRawTransaction',
        'eth_syncing',
      ]
      const ethEngineSubsetMethods: { [key: string]: Function } = {}
      for (const method of ethMethodsToBeIncluded) {
        if (ethMethods[method] !== undefined) ethEngineSubsetMethods[method] = ethMethods[method]
      }
      methods = { ...ethEngineSubsetMethods, ...manager.getMethods(true) }
      break
    }
  }

  const server = new jayson.Server(methods)
  server.on('request', onRequest)
  server.on('response', onBatchResponse)
  const namespaces = [...new Set(Object.keys(methods).map((m) => m.split('_')[0]))].join(',')

  return { server, methods, namespaces }
}

function checkHeaderAuth(req: any, jwtSecret: Uint8Array): void {
  const header = (req.headers['Authorization'] ?? req.headers['authorization']) as string
  if (!header) throw Error(`Missing auth header`)
  const token = header.trim().split(' ')[1]
  if (!token) throw Error(`Missing jwt token`)
  const claims = decode(token.trim(), jwtSecret as never as string, false, algorithm)
  const drift = Math.abs(new Date().getTime() - claims.iat * 1000) ?? 0
  if (drift > ALLOWED_DRIFT) {
    throw Error(`Stale jwt token drift=${drift}, allowed=${ALLOWED_DRIFT}`)
  }
}

export function createRPCServerListener(opts: CreateRPCServerListenerOpts): jayson.HttpServer {
  const { server, withEngineMiddleware, RPCCors } = opts

  const app = Connect()
  if (typeof RPCCors === 'string') app.use(cors({ origin: RPCCors }))
  // GOSSIP_MAX_SIZE_BELLATRIX is proposed to be 10MiB
  app.use(JSONParser({ limit: '11mb' }))

  if (withEngineMiddleware) {
    const { jwtSecret, unlessFn } = withEngineMiddleware
    app.use((req: any, res: any, next: any) => {
      try {
        if (unlessFn && unlessFn(req)) return next()
        checkHeaderAuth(req, jwtSecret)
        return next()
      } catch (error) {
        if (error instanceof Error) {
          res.writeHead(401)
          res.end(`Unauthorized: ${error}`)
          return
        }
        next(error)
      }
    })
  }
  app.use(server.middleware())
  const httpServer = createServer(app)
  return httpServer
}

export function createWsRPCServerListener(opts: CreateWSServerOpts): jayson.HttpServer | undefined {
  const { server, withEngineMiddleware, RPCCors } = opts

  // Get the server to hookup upgrade request on
  let httpServer = opts.httpServer
  if (!httpServer) {
    const app = Connect()
    // In case browser pre-flights the upgrade request with an options request
    // more likely in case of wss connection
    if (typeof RPCCors === 'string') app.use(cors({ origin: RPCCors }))
    httpServer = createServer(app)
  }
  const wss = server.websocket({ noServer: true })

  httpServer.on('upgrade', (req, socket, head) => {
    if (withEngineMiddleware) {
      const { jwtSecret } = withEngineMiddleware
      try {
        checkHeaderAuth(req, jwtSecret)
      } catch {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
        socket.destroy()
      }
    }
    wss.handleUpgrade(req, socket, head, (ws: any) => {
      wss.emit('connection', ws, req)
    })
  })
  // Only return something if a new server was created
  return !opts.httpServer ? httpServer : undefined
}
