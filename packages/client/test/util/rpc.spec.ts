import { bytesToHex } from '@ethereumjs/util'
import { MemoryLevel } from 'memory-level'
import { assert, describe, it } from 'vitest'

import { EthereumClient } from '../../src/client.ts'
import { Config } from '../../src/config.ts'
import { METHOD_NOT_FOUND } from '../../src/rpc/error-code.ts'
import { RPCManager } from '../../src/rpc/index.ts'
import {
  MethodConfig,
  createRPCServer,
  createRPCServerListener,
  createWsRPCServerListener,
} from '../../src/util/rpc.ts'
import { getRPCClient, setupChain } from '../rpc/helpers.ts'
import { powData } from '../testdata/geth-genesis/pow.ts'

describe('[Util/RPC]', () => {
  it('should return enabled RPC servers', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const client = await EthereumClient.create({ config, metaDB: new MemoryLevel() })
    const manager = new RPCManager(client, config)
    const { logger } = config
    for (const methodConfig of Object.values(MethodConfig)) {
      for (const rpcDebug of ['', 'eth']) {
        const { server } = createRPCServer(manager, {
          methodConfig,
          rpcDebug,
          logger,
          rpcDebugVerbose: '',
        })
        const httpServer = createRPCServerListener({
          server,
          withEngineMiddleware: { jwtSecret: new Uint8Array(32) },
          maxPayload: Config.RPC_ETH_MAXPAYLOAD_DEFAULT,
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

        assert.isTrue(
          httpServer !== undefined && wsServer !== undefined,
          'should return http and ws servers',
        )
      }
    }
  })
  it('should not throw if rpcDebugVerbose string is undefined', async () => {
    const config = new Config({ accountCache: 10000, storageCache: 1000 })
    const client = await EthereumClient.create({ config, metaDB: new MemoryLevel() })
    const manager = new RPCManager(client, config)
    const { logger } = config
    const methodConfig = Object.values(MethodConfig)[0]
    const { server } = createRPCServer(manager, {
      methodConfig,
      rpcDebug: 'eth',
      logger,
      rpcDebugVerbose: undefined as any,
    })
    const httpServer = createRPCServerListener({
      server,
      withEngineMiddleware: { jwtSecret: new Uint8Array(32) },
      maxPayload: Config.RPC_ENGINE_MAXPAYLOAD_DEFAULT,
    })
    const wsServer = createWsRPCServerListener({
      server,
      withEngineMiddleware: { jwtSecret: new Uint8Array(32) },
    })
    assert.isTrue(
      httpServer !== undefined && wsServer !== undefined,
      'should return http and ws servers',
    )
  })
  it('should reject oversized RPC payloads', async () => {
    const config = new Config({
      accountCache: 10000,
      storageCache: 1000,
      rpcEthMaxPayload: '1kb',
      rpcEngineMaxPayload: '10mb',
    })
    const client = await EthereumClient.create({ config, metaDB: new MemoryLevel() })

    const manager = new RPCManager(client, config)
    const { logger } = config
    const methodConfig = Object.values(MethodConfig)[0]
    const { server } = createRPCServer(manager, {
      methodConfig,
      rpcDebug: 'eth',
      logger,
      rpcDebugVerbose: undefined as any,
    })

    const ethHttpServer = createRPCServerListener({
      server,
      withEngineMiddleware: undefined,
      maxPayload: config.rpcEthMaxPayload,
    })

    const engineHttpServer = createRPCServerListener({
      server,
      withEngineMiddleware: undefined,
      maxPayload: config.rpcEngineMaxPayload,
    })

    const ethPort = 8545
    const enginePort = 8551

    ethHttpServer.listen(ethPort)
    engineHttpServer.listen(enginePort)

    const oversizedEthPayload = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'eth_getBlockByNumber',
      params: ['latest', true],
      data: 'eth'.repeat(2500),
    })

    const oversizedEnginePayload = JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'engine_newPayloadV2',
      params: [
        {
          baseFeePerGas: '0x',
          blockHash: '0x',
          blockNumber: '0x',
          extraData: '0x'.repeat(2500),
          feeRecipient: '0x',
          gasLimit: '0x',
          gasUsed: '0x',
          logsBloom: '0x',
          parentHash: '0x',
          prevRandao: '0x',
          receiptsRoot: '0x',
          stateRoot: '0x',
          timestamp: '0x',
          transactions: [],
        },
      ],
    })

    const resEth = await fetch(`http://localhost:${ethPort}`, {
      method: 'POST',
      body: oversizedEthPayload,
      headers: { 'Content-Type': 'application/json' },
    })

    const resEngine = await fetch(`http://localhost:${enginePort}`, {
      method: 'POST',
      body: oversizedEnginePayload,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    assert.strictEqual(
      resEth.status,
      413,
      'ETH server should reject oversized payload with 413 status',
    )
    assert.strictEqual(resEngine.status, 200, 'ENGINE server should accept oversized payload')
  })
})

describe('[Util/RPC/Engine eth methods]', async () => {
  const { server } = await setupChain(powData, 'pow')
  const rpc = getRPCClient(server)
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
    it(`should have method ${method}`, async () => {
      const res = await rpc.request(method, [])
      assert.notEqual(res.error?.code, METHOD_NOT_FOUND, `should have ${method}`)
    })
  }
})
