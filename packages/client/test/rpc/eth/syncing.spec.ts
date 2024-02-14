import * as td from 'testdouble'
import { assert, describe, it } from 'vitest'

import { INTERNAL_ERROR } from '../../../src/rpc/error-code.js'
import { createClient, createManager, getRpcClient, startRPC } from '../helpers.js'

import type { FullSynchronizer } from '../../../src/sync'

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
    const synchronizer = client.services[0].synchronizer!
    synchronizer.best = td.func<typeof synchronizer['best']>()
    td.when(synchronizer.best()).thenResolve('peer')

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
    const synchronizer = client.services[0].synchronizer as FullSynchronizer
    synchronizer.best = td.func<typeof synchronizer['best']>()
    synchronizer.latest = td.func<typeof synchronizer['latest']>()
    td.when(synchronizer.best()).thenResolve('peer')
    td.when(synchronizer.latest('peer' as any)).thenResolve({ number: BigInt(2) })

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
