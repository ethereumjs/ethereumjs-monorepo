import * as td from 'testdouble'
import { assert, describe } from 'vitest'

import { INTERNAL_ERROR } from '../../../src/rpc/error-code'
import { baseRequest, createClient, createManager, params, startRPC } from '../helpers'
import { checkError } from '../util'

import type { FullSynchronizer } from '../../../src/sync'

const method = 'eth_syncing'

describe(`${method}: should return false when the client is synchronized`, async () => {
  const client = createClient()
  const manager = createManager(client)
  const server = startRPC(manager.getMethods())

  client.config.synchronized = false
  assert.equal(client.config.synchronized, false, 'not synchronized yet')
  client.config.synchronized = true
  assert.equal(client.config.synchronized, true, 'synchronized')

  const req = params(method, [])
  const expectRes = (res: any) => {
    const msg = 'should return false'
    assert.equal(res.body.result, false, msg)
  }
  await baseRequest(server, req, 200, expectRes)
})

describe(`${method}: should return no peer available error`, async () => {
  const client = createClient({ noPeers: true })
  const manager = createManager(client)
  const rpcServer = startRPC(manager.getMethods())

  client.config.synchronized = false
  assert.equal(client.config.synchronized, false, 'not synchronized yet')

  const req = params(method, [])

  const expectRes = checkError(INTERNAL_ERROR, 'no peer available for synchronization')
  await baseRequest(rpcServer, req, 200, expectRes)
})

describe(`${method}: should return highest block header unavailable error`, async () => {
  const client = createClient()
  const manager = createManager(client)
  const rpcServer = startRPC(manager.getMethods())

  const synchronizer = client.services[0].synchronizer!
  synchronizer.best = td.func<typeof synchronizer['best']>()
  td.when(synchronizer.best()).thenResolve('peer')

  client.config.synchronized = false
  assert.equal(client.config.synchronized, false, 'not synchronized yet')

  const req = params(method, [])

  const expectRes = checkError(INTERNAL_ERROR, 'highest block header unavailable')
  await baseRequest(rpcServer, req, 200, expectRes)
})

describe(`${method}: should return syncing status object when unsynced`, async () => {
  const client = createClient()
  const manager = createManager(client)
  const rpcServer = startRPC(manager.getMethods())

  const synchronizer = client.services[0].synchronizer as FullSynchronizer
  synchronizer.best = td.func<typeof synchronizer['best']>()
  synchronizer.latest = td.func<typeof synchronizer['latest']>()
  td.when(synchronizer.best()).thenResolve('peer')
  td.when(synchronizer.latest('peer' as any)).thenResolve({ number: BigInt(2) })

  client.config.synchronized = false
  assert.equal(client.config.synchronized, false, 'not synchronized yet')

  const req = params(method, [])
  const expectRes = (res: any) => {
    const msg = 'should return syncing status object'
    if (
      res.body.result.startingBlock === '0x0' &&
      res.body.result.currentBlock === '0x0' &&
      res.body.result.highestBlock === '0x2'
    ) {
      assert.ok(true, msg)
    } else {
      assert.fail(msg)
    }
  }

  await baseRequest(rpcServer, req, 200, expectRes)
})

describe('should reset td', () => {
  td.reset()
})
