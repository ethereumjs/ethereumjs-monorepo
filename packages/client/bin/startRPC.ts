import { RPCManager } from '../src/rpc/index.ts'
import * as modules from '../src/rpc/modules/index.ts'
import {
  createRPCServer,
  createRPCServerListener,
  createWsRPCServerListener,
} from '../src/util/index.ts'

import type { Server } from 'jayson/promise/index.js'
import type { EthereumClient } from '../src/client.ts'
import type { RpcConfig } from '../src/rpc/config.ts'

export type RPCArgs = {
  rpc: boolean
  rpcAddr: string
  rpcPort: number
  ws: boolean
  wsPort: number
  wsAddr: string
  rpcEngine: boolean
  rpcEngineAddr: string
  rpcEnginePort: number
  wsEngineAddr: string
  wsEnginePort: number
  rpcDebug: string
  rpcDebugVerbose: string
  helpRPC: boolean
  jwtSecret?: string
  rpcEngineAuth: boolean
  rpcCors: string
}

/**
 * Starts and returns enabled RPCServers
 */
export function startRPCServers(client: EthereumClient, rpcConfigs: RpcConfig[]): Server[] {
  const { config } = client
  const servers: Server[] = []

  const manager = new RPCManager(client, config)

  const serverGroups: Map<string, { rpcConfig: RpcConfig; server: any }> = new Map()

  for (const rpcConfig of rpcConfigs) {
    // unique key for each server: eth-rpc (http & ws), engine-rpc (http & ws)
    // used to create a single rpc server for each transport type
    const key = `${rpcConfig.type}-${rpcConfig.methodConfig}`

    let serverEntry = serverGroups.get(key)

    if (!serverEntry) {
      const { server, namespaces, methods } = createRPCServer(manager, {
        methodConfig: rpcConfig.methodConfig,
        rpcDebug: rpcConfig.debug,
        rpcDebugVerbose: rpcConfig.debugVerbose,
        logger: config.logger,
      })

      servers.push(server)
      serverGroups.set(key, { rpcConfig, server })
      serverEntry = { rpcConfig, server }

      config.logger?.info(
        `Created RPCServer for type=${rpcConfig.type} methodConfig=${rpcConfig.methodConfig} namespaces=${namespaces} methods=${Object.keys(
          methods,
        ).join(',')}`,
      )
    }

    const { server } = serverEntry
    // middleware for engine auth
    const middleware =
      rpcConfig.engineAuth && rpcConfig.jwtSecret
        ? {
            jwtSecret: rpcConfig.jwtSecret,
            unlessFn: (req: any) =>
              Array.isArray(req.body)
                ? req.body.some((r: any) => r.method.includes('engine_')) === false
                : req.body.method.includes('engine_') === false,
          }
        : undefined

    if (rpcConfig.transport === 'http') {
      const httpServer = createRPCServerListener({
        RPCCors: rpcConfig.cors,
        server,
        withEngineMiddleware: middleware,
      })
      httpServer.listen(rpcConfig.port, rpcConfig.address)

      config.logger?.info(
        `Started JSON RPC Server address=http://${rpcConfig.address}:${rpcConfig.port} type=${rpcConfig.type} ${
          rpcConfig.engineAuth ? 'engineAuth=true' : ''
        }`,
      )
    }

    if (rpcConfig.transport === 'ws') {
      const wsOpts: any = {
        RPCCors: rpcConfig.cors,
        server,
        withEngineMiddleware: middleware,
      }

      // Attach to existing HTTP server for upgrades if same port/address
      const httpKey = `${rpcConfig.type}-${rpcConfig.methodConfig}`
      if (rpcConfig.address === rpcConfig.address && serverGroups.has(httpKey)) {
        wsOpts.httpServer = serverGroups.get(httpKey)?.server
      }

      const wsServer = createWsRPCServerListener(wsOpts)
      if (wsServer) {
        wsServer.listen(rpcConfig.port)
        config.logger?.info(
          `Started JSON RPC WS Server address=ws://${rpcConfig.address}:${rpcConfig.port} namespaces=${rpcConfig.type} ${
            rpcConfig.engineAuth ? 'engineAuth=true' : ''
          }`,
        )
      }
    }
  }

  return servers
}

/**
 * Output RPC help and exit
 */
export function helpRPC() {
  /* eslint-disable no-console */
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
  /* eslint-enable no-console */
  process.exit()
}
