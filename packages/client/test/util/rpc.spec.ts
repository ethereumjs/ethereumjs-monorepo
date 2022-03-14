import tape from 'tape'
import { RPCManager } from '../../lib/rpc'
import {
  createRPCServer,
  createRPCServerListener,
  createWsRPCServerListener,
  MethodConfig,
} from '../../lib/util/rpc'
import Client from '../../lib/client'
import { Config } from '../../lib/config'

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
        const req = { id: 1, method: 'eth_getLatestBlock', params: [] }
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
