import * as tape from 'tape'
import { RPCManager } from '../../lib/rpc'
import {
  createRPCServer,
  createRPCServerListener,
  createWsRPCServerListener,
  MethodConfig,
} from '../../lib/util/rpc'
import Client from '../../lib/client'
import { Config } from '../../lib/config'
import { METHOD_NOT_FOUND } from '../../lib/rpc/error-code'
const request = require('supertest')

tape('[Util/RPC]', (t) => {
  t.test('should return enabled RPC servers', (st) => {
    const config = new Config({ transports: [] })
    const client = new Client({ config })
    const manager = new RPCManager(client, config)
    const { logger } = config
    for (const methodConfig of Object.values(MethodConfig)) {
      for (const rpcDebug of [false, true]) {
        const { server } = createRPCServer(manager, { methodConfig, rpcDebug, logger })
        const httpServer = createRPCServerListener({
          server,
          withEngineMiddleware: { jwtSecret: Buffer.alloc(32) },
        })
        const wsServer = createWsRPCServerListener({
          server,
          withEngineMiddleware: { jwtSecret: Buffer.alloc(32) },
        })
        const req = { id: 1, method: 'eth_getCanonicalHeadBlock', params: [] }
        const resp = { id: 1, result: { test: '0x' + Buffer.alloc(64, 1).toString('hex') } }
        const reqBulk = [req, req]
        const respBulk = [resp, { id: 2, error: { err0: '456' } }]
        // Valid
        server.emit('request', req)
        server.emit('response', req, resp)
        server.emit('response', reqBulk, respBulk)
        // Invalid
        server.emit('response', req, []) // empty
        server.emit('response', [req], respBulk) // mismatch length

        st.ok(httpServer && wsServer, 'should return http and ws servers')
      }
    }
    st.end()
  })
})

tape('[Util/RPC/Engine eth methods]', async (t) => {
  const config = new Config({ transports: [], saveReceipts: true })
  const client = new Client({ config })
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
    t.test(`should have method ${method}`, (st) => {
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
          if (res.body.error && res.body.error.code === METHOD_NOT_FOUND) {
            throw new Error(`should have an error code ${METHOD_NOT_FOUND}`)
          }
        })
        .end((err: any) => {
          st.end(err)
        })
    })
  }
})
