import { Blockchain } from '@ethereumjs/blockchain'
import * as tape from 'tape'

import { Config } from '../../src/config'
import { PeerPool } from '../../src/net/peerpool'
import { EthProtocol } from '../../src/net/protocol'
import { Event } from '../../src/types'

import { MockChain } from './mocks/mockchain'
import { MockServer } from './mocks/mockserver'
import { wait } from './util'

tape('[Integration:PeerPool]', async (t) => {
  async function setup(protocols: EthProtocol[] = []): Promise<[MockServer, PeerPool]> {
    const serverConfig = new Config({ accountCache: 10000, storageCache: 1000 })
    const server = new MockServer({ config: serverConfig }) as any
    server.addProtocols(protocols)
    const config = new Config({ servers: [server], accountCache: 10000, storageCache: 1000 })
    await server.start()
    const pool = new PeerPool({ config })
    await pool.open()
    return [server, pool]
  }

  async function destroy(server: MockServer, pool: PeerPool) {
    await pool.stop()
    await server.stop()
  }

  t.test('should open', async (t) => {
    const [server, pool] = await setup()
    t.ok((pool as any).opened, 'opened')
    await destroy(server, pool)
  })

  t.test('should add/remove peer', async (t) => {
    const [server, pool] = await setup()
    pool.config.events.on(Event.POOL_PEER_ADDED, (peer: any) =>
      t.equal(peer.id, 'peer0', 'added peer')
    )
    pool.config.events.on(Event.POOL_PEER_REMOVED, (peer: any) =>
      t.equal(peer.id, 'peer0', 'removed peer')
    )
    pool.add(await server.accept('peer0'))
    await wait(100)
    server.disconnect('peer0')
    await destroy(server, pool)
    t.pass('destroyed')
  })

  t.test('should ban peer', async (t) => {
    const [server, pool] = await setup()
    pool.config.events.on(Event.POOL_PEER_ADDED, (peer: any) =>
      t.equal(peer.id, 'peer0', 'added peer')
    )
    pool.config.events.on(Event.POOL_PEER_BANNED, (peer: any) =>
      t.equal(peer.id, 'peer0', 'banned peer')
    )
    pool.add(await server.accept('peer0'))
    await wait(100)
    pool.ban(pool.peers[0])
    await destroy(server, pool)
    t.pass('destroyed')
  })

  t.test('should handle peer messages', async (t) => {
    const config = new Config({ transports: [], accountCache: 10000, storageCache: 1000 })
    const blockchain = await Blockchain.create({
      validateBlocks: false,
      validateConsensus: false,
    })
    const chain = new MockChain({ config, blockchain })
    await chain.open()
    const protocols = [
      new EthProtocol({
        config,
        chain,
      }),
    ]
    const [server, pool] = await setup(protocols)
    config.events.on(Event.POOL_PEER_ADDED, (peer: any) => t.equal(peer.id, 'peer0', 'added peer'))
    config.events.on(Event.PROTOCOL_MESSAGE, (msg: any, proto: any, peer: any) => {
      t.deepEqual([msg, proto, peer.id], ['msg0', 'proto0', 'peer0'], 'got message')
    })
    pool.add(await server.accept('peer0'))
    await wait(100)
    config.events.emit(Event.PROTOCOL_MESSAGE, 'msg0', 'proto0', pool.peers[0])
    await destroy(server, pool)
    t.pass('destroyed')
  })
})
