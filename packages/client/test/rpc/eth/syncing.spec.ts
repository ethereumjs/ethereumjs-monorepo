import tape from 'tape-catch'
import td from 'testdouble'
import { baseRequest, createManager, createClient, params, startRPC } from '../helpers'
import { BN } from 'ethereumjs-util'

const method = 'eth_syncing'

tape(`${method}: should return false when the client is synchronized`, async (t) => {
  const client = createClient()
  const manager = createManager(client)
  const server = startRPC(manager.getMethods())

  t.equals(client.synchronized, false, 'not synchronized yet')
  client.synchronized = true
  t.equals(client.synchronized, true, 'synchronized')

  const req = params(method, [])
  const expectRes = (res: any) => {
    const msg = 'should return false'
    if (res.body.result === false) {
      t.pass(msg)
    } else {
      throw new Error(msg)
    }
  }
  baseRequest(t, server, req, 200, expectRes)
})

tape(`${method}: should return no peer available error`, async (t) => {
  const client = createClient({ noPeers: true })
  const manager = createManager(client)
  const rpcServer = startRPC(manager.getMethods())

  t.equals(client.synchronized, false, 'not synchronized yet')

  const req = params(method, [])
  const expectRes = (res: any) => {
    const msg = 'should return no peer available error'
    if (res.body.result.message === 'no peer available for synchronization') {
      t.pass(msg)
    } else {
      throw new Error(msg)
    }
  }

  baseRequest(t, rpcServer, req, 200, expectRes)
})

tape(`${method}: should return highest block header unavailable error`, async (t) => {
  const client = createClient()
  const manager = createManager(client)
  const rpcServer = startRPC(manager.getMethods())

  const synchronizer = client.services[0].synchronizer
  synchronizer.best = td.func<typeof synchronizer['best']>()
  td.when(synchronizer.best()).thenReturn('peer')

  t.equals(client.synchronized, false, 'not synchronized yet')

  const req = params(method, [])
  const expectRes = (res: any) => {
    const msg = 'should return highest block header unavailable error'
    if (res.body.result.message === 'highest block header unavailable') {
      t.pass(msg)
    } else {
      throw new Error(msg)
    }
  }

  baseRequest(t, rpcServer, req, 200, expectRes)
})

tape(`${method}: should return syncing status object when unsynced`, async (t) => {
  const client = createClient()
  const manager = createManager(client)
  const rpcServer = startRPC(manager.getMethods())

  const synchronizer = client.services[0].synchronizer
  synchronizer.best = td.func<typeof synchronizer['best']>()
  synchronizer.latest = td.func<typeof synchronizer['latest']>()
  td.when(synchronizer.best()).thenReturn('peer')
  td.when(synchronizer.latest('peer' as any)).thenResolve({ number: new BN(2) })

  t.equals(client.synchronized, false, 'not synchronized yet')

  const req = params(method, [])
  const expectRes = (res: any) => {
    const msg = 'should return syncing status object'
    if (
      res.body.result.startingBlock === '0x0' &&
      res.body.result.currentBlock === '0x0' &&
      res.body.result.highestBlock === '0x2'
    ) {
      t.pass(msg)
    } else {
      throw new Error(msg)
    }
  }

  baseRequest(t, rpcServer, req, 200, expectRes)
})

tape('should reset td', (t) => {
  td.reset()
  t.end()
})
