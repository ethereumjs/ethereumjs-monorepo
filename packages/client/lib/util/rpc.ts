import { createServer } from 'http'
import { Server as RPCServer, HttpServer } from 'jayson/promise'
import { json as jsonParser } from 'body-parser'
import { decode, TAlgorithm } from 'jwt-simple'
import * as Connect from 'connect'
import cors from 'cors'
import { inspect } from 'util'
import { RPCManager } from '../rpc'
import { Logger } from '../logging'

type IncomingMessage = Connect.IncomingMessage
const algorithm: TAlgorithm = 'HS256'

type CreateRPCServerOpts = {
  methodConfig: MethodConfig
  rpcDebug: boolean
  logger?: Logger
}
type CreateRPCServerReturn = {
  server: RPCServer
  methods: { [key: string]: Function }
  namespaces: string
}
type CreateRPCServerListenerOpts = {
  rpcCors?: string
  server: RPCServer
  withEngineMiddleware?: WithEngineMiddleware
}
type CreateWSServerOpts = CreateRPCServerListenerOpts & { httpServer?: HttpServer }
type WithEngineMiddleware = { jwtSecret: Buffer; unlessFn?: (req: IncomingMessage) => boolean }

export enum MethodConfig {
  WithEngine = 'withengine',
  WithoutEngine = 'withoutengine',
  EngineOnly = 'engineonly',
}

/**
 * Internal util to pretty print params for logging.
 */
export function inspectParams(params: any, shorten?: number) {
  let inspected = inspect(params, {
    colors: true,
    maxStringLength: 100,
  } as any)
  if (shorten) {
    inspected = inspected.replace(/\n/g, '').replace(/ {2}/g, ' ')
    if (inspected.length > shorten) {
      inspected = inspected.slice(0, shorten) + '...'
    }
  }
  return inspected
}

export function createRPCServer(
  manager: RPCManager,
  opts: CreateRPCServerOpts
): CreateRPCServerReturn {
  const { methodConfig, rpcDebug, logger } = opts

  const onRequest = (request: any) => {
    let msg = ''
    if (rpcDebug) {
      msg += `${request.method} called with params:\n${inspectParams(request.params)}`
    } else {
      msg += `${request.method} called with params: ${inspectParams(request.params, 125)}`
    }
    logger?.debug(msg)
  }

  const handleResponse = (request: any, response: any, batchAddOn = '') => {
    let msg = ''
    if (rpcDebug) {
      msg = `${request.method}${batchAddOn} responded with:\n${inspectParams(response)}`
    } else {
      msg = `${request.method}${batchAddOn} responded with: `
      if (response.result) {
        msg += inspectParams(response, 125)
      }
      if (response.error) {
        msg += `error: ${response.error.message}`
      }
    }
    logger?.debug(msg)
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
  const ethMethods = manager.getMethods()

  switch (methodConfig) {
    case MethodConfig.WithEngine:
      methods = { ...ethMethods, ...manager.getMethods(true) }
      break
    case MethodConfig.WithoutEngine:
      methods = { ...ethMethods }
      break
    case MethodConfig.EngineOnly: {
      /**
       * Filter eth methods to be exposed with engine as per kiln spec 2.1
       * From: https://github.com/ethereum/execution-apis/blob/v1.0.0-alpha.8/src/engine/specification.md#underlying-protocol
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
        if (ethMethods[method]) ethEngineSubsetMethods[method] = ethMethods[method]
      }
      methods = { ...ethEngineSubsetMethods, ...manager.getMethods(true) }
      break
    }
  }

  const server = new RPCServer(methods)
  server.on('request', onRequest)
  server.on('response', onBatchResponse)
  const namespaces = [...new Set(Object.keys(methods).map((m) => m.split('_')[0]))].join(',')

  return { server, methods, namespaces }
}

function checkHeaderAuth(req: any, jwtSecret: Buffer): void {
  const header = (req.headers['Authorization'] ?? req.headers['authorization']) as string
  if (!header) throw Error(`Missing auth header`)
  const token = header.trim().split(' ')[1]
  if (!token) throw Error(`Missing jwt token`)
  const claims = decode(token.trim(), jwtSecret as never as string, false, algorithm)
  if (Math.abs(new Date().getTime() - claims.iat * 1000 ?? 0) > 5000) {
    throw Error('Stale jwt token')
  }
}

export function createRPCServerListener(opts: CreateRPCServerListenerOpts): HttpServer {
  const { server, withEngineMiddleware, rpcCors } = opts

  const app = Connect()
  if (rpcCors) app.use(cors({ origin: rpcCors }))
  // GOSSIP_MAX_SIZE_BELLATRIX is proposed to be 10MiB
  app.use(jsonParser({ limit: '11mb' }))

  if (withEngineMiddleware) {
    const { jwtSecret, unlessFn } = withEngineMiddleware
    app.use((req, res, next) => {
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

export function createWsRPCServerListener(opts: CreateWSServerOpts): HttpServer | undefined {
  const { server, withEngineMiddleware, rpcCors } = opts

  // Get the server to hookup upgrade request on
  let httpServer = opts.httpServer
  if (!httpServer) {
    const app = Connect()
    // In case browser pre-flights the upgrade request with an options request
    // more likely in case of wss connection
    if (rpcCors) app.use(cors({ origin: rpcCors }))
    httpServer = createServer(app)
  }

  const wss = server.websocket({ noServer: true })

  httpServer.on('upgrade', (req, socket, head) => {
    if (withEngineMiddleware) {
      const { jwtSecret } = withEngineMiddleware
      try {
        checkHeaderAuth(req, jwtSecret)
      } catch (error) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n')
        socket.destroy()
      }
    }
    ;(wss as any).handleUpgrade(req, socket, head, (ws: any) => {
      ;(wss as any).emit('connection', ws, req)
    })
  })
  // Only return something if a new server was created
  return !opts.httpServer ? httpServer : undefined
}
