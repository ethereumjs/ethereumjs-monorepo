import { Server as RPCServer } from 'jayson/promise'
import { readFileSync, writeFileSync } from 'fs-extra'
import { RPCManager } from '../lib/rpc'
import EthereumClient from '../lib/client'
import {
  MethodConfig,
  createRPCServer,
  createRPCServerListener,
  createWsRPCServerListener,
} from '../lib/util'
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
  wsEngineAddr: string
  wsEnginePort: number
  rpcDebug: boolean
  helprpc: boolean
  'jwt-secret'?: string
  rpcEngineAuth: boolean
  rpcCors: string
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
    config.logger.debug(`Read a hex encoded jwt secret from path=${jwtFilePath}`)
    jwtSecret = Buffer.from(jwtSecretHex, 'hex')
  } else {
    jwtFilePath = `${config.datadir}/jwtsecret`
    jwtSecret = Buffer.from(Array.from({ length: 32 }, () => Math.round(Math.random() * 255)))
    writeFileSync(jwtFilePath, jwtSecret.toString('hex'))
    config.logger.info(`Wrote a hex encoded random jwt secret to path=${jwtFilePath}`)
  }
  return jwtSecret
}

/**
 * Starts and returns enabled RPCServers
 */
export function startRPCServers(client: EthereumClient, args: RPCArgs) {
  const { config } = client
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
    wsEngineAddr,
    wsEnginePort,
    'jwt-secret': jwtSecretPath,
    rpcEngineAuth,
    rpcCors,
    rpcDebug,
  } = args
  const manager = new RPCManager(client, config)
  const { logger } = config
  const jwtSecret =
    rpcEngine && rpcEngineAuth ? parseJwtSecret(config, jwtSecretPath) : Buffer.from([])
  let withEngineMethods = false

  if (rpc || ws) {
    let rpcHttpServer
    withEngineMethods = rpcEngine && rpcEnginePort === rpcport && rpcEngineAddr === rpcaddr

    const { server, namespaces, methods } = createRPCServer(manager, {
      methodConfig: withEngineMethods ? MethodConfig.WithEngine : MethodConfig.WithoutEngine,
      rpcDebug,
      logger,
    })
    servers.push(server)

    if (rpc) {
      rpcHttpServer = createRPCServerListener({
        rpcCors,
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
      logger.info(
        `Started JSON RPC Server address=http://${rpcaddr}:${rpcport} namespaces=${namespaces}${
          withEngineMethods ? ' rpcEngineAuth=' + rpcEngineAuth.toString() : ''
        }`
      )
      logger.debug(
        `Methods available at address=http://${rpcaddr}:${rpcport} namespaces=${namespaces} methods=${Object.keys(
          methods
        ).join(',')}`
      )
    }
    if (ws) {
      const opts: any = {
        rpcCors,
        server,
        withEngineMiddleware: withEngineMethods && rpcEngineAuth ? { jwtSecret } : undefined,
      }
      if (rpcaddr === wsAddr && rpcport === wsPort) {
        // We want to load the websocket upgrade request to the same server
        opts.httpServer = rpcHttpServer
      }

      const rpcWsServer = createWsRPCServerListener(opts)
      if (rpcWsServer) rpcWsServer.listen(wsPort)
      logger.info(
        `Started JSON RPC Server address=ws://${wsAddr}:${wsPort} namespaces=${namespaces}${
          withEngineMethods ? ` rpcEngineAuth=${rpcEngineAuth}` : ''
        }`
      )
      logger.debug(
        `Methods available at address=ws://${wsAddr}:${wsPort} namespaces=${namespaces} methods=${Object.keys(
          methods
        ).join(',')}`
      )
    }
  }

  if (rpcEngine && !(rpc && rpcport === rpcEnginePort && rpcaddr === rpcEngineAddr)) {
    const { server, namespaces, methods } = createRPCServer(manager, {
      methodConfig: MethodConfig.EngineOnly,
      rpcDebug,
      logger,
    })
    servers.push(server)
    const rpcHttpServer = createRPCServerListener({
      rpcCors,
      server,
      withEngineMiddleware: rpcEngineAuth
        ? {
            jwtSecret,
          }
        : undefined,
    })
    rpcHttpServer.listen(rpcEnginePort)
    logger.info(
      `Started JSON RPC server address=http://${rpcEngineAddr}:${rpcEnginePort} namespaces=${namespaces} rpcEngineAuth=${rpcEngineAuth}`
    )
    logger.debug(
      `Methods available at address=http://${rpcEngineAddr}:${rpcEnginePort} namespaces=${namespaces} methods=${Object.keys(
        methods
      ).join(',')}`
    )

    if (ws) {
      const opts: any = {
        rpcCors,
        server,
        withEngineMiddleware: rpcEngineAuth ? { jwtSecret } : undefined,
      }

      if (rpcEngineAddr === wsEngineAddr && rpcEnginePort === wsEnginePort) {
        // We want to load the websocket upgrade request to the same server
        opts.httpServer = rpcHttpServer
      }

      const rpcWsServer = createWsRPCServerListener(opts)
      if (rpcWsServer) rpcWsServer.listen(wsEnginePort)
      logger.info(
        `Started JSON RPC Server address=ws://${wsEngineAddr}:${wsEnginePort} namespaces=${namespaces} rpcEngineAuth=${rpcEngineAuth}`
      )
      logger.debug(
        `Methods available at address=ws://${wsEngineAddr}:${wsEnginePort} namespaces=${namespaces} methods=${Object.keys(
          methods
        ).join(',')}`
      )
    }
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
