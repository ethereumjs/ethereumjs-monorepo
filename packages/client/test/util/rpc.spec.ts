import { bytesToHex } from '@ethereumjs/util'
import { MemoryLevel } from 'memory-level'
import { assert, describe, it } from 'vitest'

import { EthereumClient } from '../../src/client'
import { Config } from '../../src/config'
import { RPCManager } from '../../src/rpc'
import { METHOD_NOT_FOUND } from '../../src/rpc/error-code'
import {
  MethodConfig,
  createRPCServer,
  createRPCServerListener,
  createWsRPCServerListener,
} from '../../src/util/rpc'

const request = require('supertest')

describe('[Util/RPC]', () => {
  it('should return enabled RPC servers', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const client = await EthereumClient.create({ config, metaDB: new MemoryLevel() })
    const manager = new RPCManager(client, config)
    const { logger } = config
    for (const methodConfig of Object.values(MethodConfig)) {
      for (const rpcDebug of ['', 'eth']) {
        const { server } = createRPCServer(manager, { methodConfig, rpcDebug, logger })
        const httpServer = createRPCServerListener({
          server,
          withEngineMiddleware: { jwtSecret: new Uint8Array(32) },
        })
        const wsServer = createWsRPCServerListener({
          server,
          withEngineMiddleware: { jwtSecret: new Uint8Array(32) },
        })
        const req = { id: 1, method: 'eth_getCanonicalHeadBlock', params: [] }
        const resp = {
          id: 1,
          result: { test: bytesToHex(new Uint8Array(64).fill(1)) },
        }
        const reqBulk = [req, req]
        const respBulk = [resp, { id: 2, error: { err0: '456' } }]
        // Valid
        server.emit('request', req)
        server.emit('response', req, resp)
        server.emit('response', reqBulk, respBulk)
        // Invalid
        server.emit('response', req, []) // empty
        server.emit('response', [req], respBulk) // mismatch length

        assert.ok(
          httpServer !== undefined && wsServer !== undefined,
          'should return http and ws servers'
        )
      }
    }
  })
})

describe('[Util/RPC/Engine eth methods]', async () => {
  const config = new Config({
    accountCache: 10000,
    storageCache: 1000,
    saveReceipts: true,
  })
  const client = await EthereumClient.create({ config, metaDB: new MemoryLevel() })
  const manager = new RPCManager(client, config)
  const { server } = createRPCServer(manager, {
    methodConfig: MethodConfig.EngineOnly,
    rpcDebug: false,
  })
  const httpServer = createRPCServerListener({ server })
  const methods = [
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
  for (const method of methods) {
    it(`should have method ${method}`, () => {
      const req = {
        jsonrpc: '2.0',
        method,
        id: 1,
      }

      request(httpServer)
        .post('/')
        .set('Content-Type', 'application/json')
        .send(req)
        .expect((res: any) => {
          if (res.body.error?.code === METHOD_NOT_FOUND) {
            throw new Error(`should have an error code ${METHOD_NOT_FOUND}`)
          }
        })
        .end((err: any) => {
          assert.notOk(err)
        })
    })
  }
})
