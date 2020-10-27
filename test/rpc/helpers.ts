import tape from 'tape'
const jayson = require('jayson')
const request = require('supertest')
import Common from '@ethereumjs/common'
import { RPCManager as Manager } from '../../lib/rpc'
import * as Logger from '../../lib/logging'
import { blockChain } from './blockChainStub'
import { Chain } from '../../lib/blockchain/chain'
import Blockchain from '@ethereumjs/blockchain'

const config: any = { loglevel: 'error' }
config.logger = Logger.getLogger(config)

export function startRPC(methods: any, port: number = 3000) {
  const server = jayson.server(methods)
  const httpServer = server.http()
  httpServer.listen(port)
  return httpServer
}

export function closeRPC(server: any) {
  server.close()
}

export function createManager(node: any) {
  return new Manager(node, config)
}

export function createNode(nodeConfig?: any) {
  const chain = new Chain({ blockchain: (<unknown>blockChain({})) as Blockchain })
  chain.opened = true
  const defaultNodeConfig = {
    blockchain: chain,
    opened: true,
    commonChain: new Common({ chain: 'mainnet' }),
    ethProtocolVersions: [63],
  }
  const trueNodeConfig = { ...defaultNodeConfig, ...nodeConfig }
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
    common: trueNodeConfig.commonChain,
    opened: trueNodeConfig.opened,
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
    method: method,
    params: params,
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
