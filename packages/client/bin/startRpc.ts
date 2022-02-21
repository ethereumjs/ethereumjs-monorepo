import { Server as RPCServer } from 'jayson/promise'
import { json as jsonParser } from 'body-parser'
import Express, { Application, Request, Response, NextFunction } from 'express'
import jwt from 'express-jwt'
import {readFileSync, writeFileSync } from 'fs-extra'

import { RPCManager } from '../lib/rpc'
import EthereumClient from '../lib/client'
import { inspectParams } from '../lib/util'
import * as modules from '../lib/rpc/modules'

type RPCArgs = {
  rpc: boolean
  rpcaddr: string
  rpcport: number
  ws: boolean
  wsPort: number
  wsAddr: string
  rpcEngine: boolean
  rpcEngineAddr: string
  rpcEnginePort: number
  rpcDebug: boolean
  helprpc: boolean
  'jwt-secret'?: string
}

function createRPCServerListener({
  rpcport,
  server,
  withEngineMiddleware,
}: {
  rpcport: number
  server: RPCServer
  withEngineMiddleware?: { jwtEngineSecret: Buffer }
}): Application {
  const app = Express()
  app.use(Express.json())
  if (withEngineMiddleware) {
    app.use(
      jwt({ secret: withEngineMiddleware.jwtEngineSecret, algorithms: ['HS256'] }).unless(function (
        req: Request
      ) {
        const { method } = req.body
        return !method.includes('engine_')
      })
    )
    app.use(function (req: Request, res: Response, next: NextFunction) {
      /** user object which is the parsed jwt claims is injected by jwt middleware */
      const { user } = req as unknown as { user: { iat: number } | undefined }
      if (user && Math.abs(new Date().getTime() - user.iat * 1000 ?? 0) > 5000) {
        return res.sendStatus(401)
      }
      return next()
    })
  }
  app.use(server.middleware())
  app.listen(rpcport)
  return app
}

function readJwtSecretFromHexFile(jwtFilePath?: string):Buffer {
  if(!jwtFilePath) throw Error("jwtFilePath empty");
  const jwtSecretContents = readFileSync(jwtFilePath, "utf-8").trim();
  const hexPattern = new RegExp(/^(0x|0X)?(?<jwtSecret>[a-fA-F0-9]+)$/, "g");
  const jwtSecretHex = hexPattern.exec(jwtSecretContents)?.groups?.jwtSecret;
  if (!jwtSecretHex || jwtSecretHex.length != 64) {
    throw Error("Need a valid 256 bit hex encoded secret");
  }
  return Buffer.from(jwtSecretHex,"hex");
}

/**
 * Starts and returns enabled RPCServers
 */
export function startRPCServers(client: EthereumClient, args: RPCArgs) {
  const config = client.config
  const onRequest = (request: any) => {
    let msg = ''
    if (args.rpcDebug) {
      msg += `${request.method} called with params:\n${inspectParams(request.params)}`
    } else {
      msg += `${request.method} called with params: ${inspectParams(request.params, 125)}`
    }
    config.logger.debug(msg)
  }

  const handleResponse = (request: any, response: any, batchAddOn = '') => {
    let msg = ''
    if (args.rpcDebug) {
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
    config.logger.debug(msg)
  }

  const onBatchResponse = (request: any, response: any) => {
    // Batch request
    if (request.length !== undefined) {
      if (response.length === undefined || response.length !== request.length) {
        config.logger.debug('Invalid batch request received.')
        return
      }
      for (let i = 0; i < request.length; i++) {
        handleResponse(request[i], response[i], ' (batch request)')
      }
    } else {
      handleResponse(request, response)
    }
  }

  const servers: RPCServer[] = []
  const {
    rpc,
    rpcaddr,
    rpcport,
    ws,
    wsPort,
    wsAddr,
    rpcEngine,
    rpcEngineAddr,
    rpcEnginePort,
    'jwt-secret': jwtEngineSecretPath,
  } = args
  const manager = new RPCManager(client, config)

  if (rpc || ws) {
    const withEngineMethods = rpcEngine && rpcEnginePort === rpcport && rpcEngineAddr === rpcaddr
    const methods = withEngineMethods
      ? { ...manager.getMethods(), ...manager.getMethods(true) }
      : { ...manager.getMethods() }
    const server = new RPCServer(methods)
    server.on('request', onRequest)
    server.on('response', onBatchResponse)
    const namespaces = [...new Set(Object.keys(methods).map((m) => m.split('_')[0]))].join(',')
    if (rpc) {
      createRPCServerListener({
        rpcport,
        server,
        withEngineMiddleware: withEngineMethods ? { jwtEngineSecret: readJwtSecretFromHexFile(jwtEngineSecretPath) } : undefined,
      })
      config.logger.info(
        `Started JSON RPC Server address=http://${rpcaddr}:${rpcport} namespaces=${namespaces}`
      )
    }
    if (ws) {
      const opts: any = { port: wsPort }
      if (rpcaddr === wsAddr && rpcport === wsPort) {
        // If http and ws are listening on the same port,
        // pass in the existing server to prevent a listening error
        delete opts.port
        opts.server = server
      }
      server.websocket(opts)
      config.logger.info(
        `Started JSON RPC Server address=ws://${wsAddr}:${wsPort} namespaces=${namespaces}`
      )
    }
    servers.push(server)
  }

  if (rpcEngine) {
    if (rpc && rpcport === rpcEnginePort && rpcaddr === rpcEngineAddr) {
      return servers
    }
    const server = new RPCServer(manager.getMethods(true))
    server.on('request', onRequest)
    server.on('response', onBatchResponse)

    createRPCServerListener({ rpcport, server, withEngineMiddleware: { jwtEngineSecret: readJwtSecretFromHexFile(jwtEngineSecretPath) } })
    config.logger.info(
      `Started JSON RPC server address=http://${rpcEngineAddr}:${rpcEnginePort} namespaces=engine`
    )

    servers.push(server)
  }

  return servers
}

/**
 * Output RPC help and exit
 */
export function helprpc() {
  console.log('-'.repeat(27))
  console.log('JSON-RPC: Supported Methods')
  console.log('-'.repeat(27))
  console.log()
  for (const modName of modules.list) {
    console.log(`${modName}:`)
    const methods = RPCManager.getMethodNames((modules as any)[modName])
    for (const methodName of methods) {
      console.log(`-> ${modName.toLowerCase()}_${methodName}`)
    }
    console.log()
  }
  console.log()
  process.exit()
}
