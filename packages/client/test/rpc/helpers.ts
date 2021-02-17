import tape from 'tape'
import { Server as RPCServer, HttpServer } from 'jayson/promise'
const request = require('supertest')
import Common from '@ethereumjs/common'
import { RPCManager as Manager } from '../../lib/rpc'
import * as Logger from '../../lib/logging'
import { blockChain } from './blockChainStub'
import { Chain } from '../../lib/blockchain/chain'
import { RlpxServer } from '../../lib/net/server/rlpxserver'
import Blockchain from '@ethereumjs/blockchain'
import { Config } from '../../lib/config'

const config: any = { loglevel: 'error' }
config.logger = Logger.getLogger(config)

export function startRPC(methods: any, port: number = 3000) {
  const server = new RPCServer(methods)
  const httpServer = server.http()
  httpServer.listen(port)
  return httpServer
}

export function closeRPC(server: HttpServer) {
  server.close()
}

export function createManager(node: any) {
  return new Manager(node, config)
}

export function createNode(nodeConfig?: any) {
  const common = nodeConfig?.commonChain ?? new Common({ chain: 'mainnet' })
  const config = new Config({ transports: [], common })
  const chain = new Chain({
    config,
    blockchain: (<unknown>blockChain({})) as Blockchain,
  })
  chain.opened = true
  const defaultNodeConfig = {
    blockchain: chain,
    opened: true,
    ethProtocolVersions: [63],
  }
  const trueNodeConfig = { ...defaultNodeConfig, ...nodeConfig }
  const servers = [
    new RlpxServer({
      config,
      bootnodes: '10.0.0.1:1234,10.0.0.2:1234',
    }),
  ]
  return {
    services: [
      {
        name: 'eth',
        chain: trueNodeConfig.blockchain,
        pool: { peers: [1, 2, 3] },
        protocols: [
          {
            name: 'eth',
            versions: trueNodeConfig.ethProtocolVersions,
          },
        ],
      },
    ],
    servers,
    opened: trueNodeConfig.opened,
    server: (name: string) => {
      return servers.find((s) => s.name === name)
    },
  }
}

export function baseSetup() {
  const manager = createManager(createNode())
  const server = startRPC(manager.getMethods())
  return server
}

export function params(method: any, params: any[] = []) {
  const req = {
    jsonrpc: '2.0',
    method,
    params,
    id: 1,
  }
  return req
}

export function baseRequest(t: tape.Test, server: any, req: any, expect: any, expectRes: any) {
  request(server)
    .post('/')
    .set('Content-Type', 'application/json')
    .send(req)
    .expect(expect)
    .expect(expectRes)
    .end((err: any) => {
      closeRPC(server)
      t.end(err)
    })
}
