import { Server as RPCServer } from 'jayson/promise'
import { readFileSync, writeFileSync } from 'fs-extra'
import { RPCManager } from '../lib/rpc'
import EthereumClient from '../lib/client'
import { inspectParams, createRPCServerListener, createWsRPCServerListener } from '../lib/util'
import * as modules from '../lib/rpc/modules'
import { Config } from '../lib/config'

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
  rpcEngineAuth: boolean
}

/**
 * Returns a jwt secret from a provided file path, otherwise saves a randomly generated one to datadir
 */
function parseJwtSecret(config: Config, jwtFilePath?: string): Buffer {
  let jwtSecret
  if (jwtFilePath) {
    const jwtSecretContents = readFileSync(jwtFilePath, 'utf-8').trim()
    const hexPattern = new RegExp(/^(0x|0X)?(?<jwtSecret>[a-fA-F0-9]+)$/, 'g')
    const jwtSecretHex = hexPattern.exec(jwtSecretContents)?.groups?.jwtSecret
    if (!jwtSecretHex || jwtSecretHex.length != 64) {
      throw Error('Need a valid 256 bit hex encoded secret')
    }
    config.logger.debug(`Read a hex encoded secret, path=${jwtFilePath}`)
    jwtSecret = Buffer.from(jwtSecretHex, 'hex')
  } else {
    jwtFilePath = `${config.datadir}/jwtsecret`
    jwtSecret = Buffer.from(Array.from({ length: 32 }, () => Math.round(Math.random() * 255)))
    writeFileSync(jwtFilePath, jwtSecret.toString('hex'))
    config.logger.info(`A hex encoded random jwt secret written, path=${jwtFilePath}`)
  }
  return jwtSecret
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
    'jwt-secret': jwtSecretPath,
    rpcEngineAuth,
  } = args
  const manager = new RPCManager(client, config)
  const jwtSecret = parseJwtSecret(config, jwtSecretPath)

  if (rpc || ws) {
    const withEngineMethods = rpcEngine && rpcEnginePort === rpcport && rpcEngineAddr === rpcaddr
    const methods = withEngineMethods
      ? { ...manager.getMethods(), ...manager.getMethods(true) }
      : { ...manager.getMethods() }
    const server = new RPCServer(methods)
    server.on('request', onRequest)
    server.on('response', onBatchResponse)
    const namespaces = [...new Set(Object.keys(methods).map((m) => m.split('_')[0]))].join(',')
    let rpcHttpServer

    if (rpc) {
      rpcHttpServer = createRPCServerListener({
        server,
        withEngineMiddleware:
          withEngineMethods && rpcEngineAuth
            ? {
                jwtSecret,
                unlessFn: (req: any) =>
                  Array.isArray(req.body)
                    ? !req.body.some((r: any) => r.method.includes('engine_'))
                    : !req.body.method.includes('engine_'),
              }
            : undefined,
      })
      rpcHttpServer.listen(rpcport)
      config.logger.info(
        `Started JSON RPC Server address=http://${rpcaddr}:${rpcport} namespaces=${namespaces}`
      )
    }
    if (ws) {
      const opts: any = {
        server,
        withEngineMiddleware: withEngineMethods && rpcEngineAuth ? { jwtSecret } : undefined,
      }
      if (rpcaddr === wsAddr && rpcport === wsPort) {
        // We want to loadon the websocket upgrade request to the same server
        Object.assign(opts, { httpServer: rpcHttpServer })
      }

      const rpcWsServer = createWsRPCServerListener(opts)
      if (rpcWsServer) rpcWsServer.listen(wsPort)
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

    createRPCServerListener({
      server,
      withEngineMiddleware: rpcEngineAuth
        ? {
            jwtSecret,
          }
        : undefined,
    }).listen(rpcport)
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
