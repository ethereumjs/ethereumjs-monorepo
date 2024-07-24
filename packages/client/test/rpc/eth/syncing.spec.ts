import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import { INTERNAL_ERROR } from '../../../src/rpc/error-code.js'
import { createClient, createManager, getRpcClient, startRPC } from '../helpers.js'

import type { FullSynchronizer } from '../../../src/sync/index.js'

const method = 'eth_syncing'

describe(method, () => {
  it('should return false when the client is synchronized', async () => {
    const client = await createClient()
    const manager = createManager(client)
    const rpc = getRpcClient(startRPC(manager.getMethods()))

    client.config.synchronized = false
    assert.equal(client.config.synchronized, false, 'not synchronized yet')
    client.config.synchronized = true
    assert.equal(client.config.synchronized, true, 'synchronized')

    const res = await rpc.request(method, [])
    assert.equal(res.result, false, 'should return false')
  })

  it('should return no peer available error', async () => {
    const client = await createClient({ noPeers: true })
    const manager = createManager(client)
    const rpcServer = startRPC(manager.getMethods())
    const rpc = getRpcClient(rpcServer)
    client.config.synchronized = false
    assert.equal(client.config.synchronized, false, 'not synchronized yet')

    const res = await rpc.request(method, [])

    assert.equal(res.error.code, INTERNAL_ERROR)
    assert.ok(res.error.message.includes('no peer available for synchronization'))
  })

  it('should return highest block header unavailable error', async () => {
    const client = await createClient()
    const manager = createManager(client)
    const rpcServer = startRPC(manager.getMethods())
    const rpc = getRpcClient(rpcServer)
    const sync = client.services[0].synchronizer!
    sync.best = td.func<(typeof sync)['best']>()
    td.when(sync.best()).thenResolve({
      latest: () => {
        return
      },
    } as any)

    client.config.synchronized = false
    assert.equal(client.config.synchronized, false, 'not synchronized yet')

    const res = await rpc.request(method, [])

    assert.equal(res.error.code, INTERNAL_ERROR)
    assert.ok(res.error.message.includes('highest block header unavailable'))
  })

  it('should return syncing status object when unsynced', async () => {
    const client = await createClient()
    const manager = createManager(client)
    const rpcServer = startRPC(manager.getMethods())
    const rpc = getRpcClient(rpcServer)
    const sync = client.services[0].synchronizer as FullSynchronizer
    sync.best = td.func<(typeof sync)['best']>()
    td.when(sync.best()).thenResolve({
      latest: () => {
        return {
          number: BigInt(2),
          hash: () => new Uint8Array(0),
        }
      },
    } as any)

    client.config.synchronized = false
    assert.equal(client.config.synchronized, false, 'not synchronized yet')

    const res = await rpc.request(method, [])

    if (
      res.result.startingBlock === '0x0' &&
      res.result.currentBlock === '0x0' &&
      res.result.highestBlock === '0x2'
    ) {
      assert.ok(true, 'should return syncing status object')
    } else {
      assert.fail('should return syncing status object')
    }
  })

  it('should reset td', () => {
    td.reset()
  })
})
