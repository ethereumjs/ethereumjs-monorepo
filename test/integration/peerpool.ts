import tape from 'tape'
import { EthProtocol } from '../../lib/net/protocol'
import { PeerPool } from '../../lib/net/peerpool'
import MockServer from './mocks/mockserver'
import MockChain from './mocks/mockchain'
import { defaultLogger } from '../../lib/logging'
import { Config } from '../../lib/config'
defaultLogger.silent = true

tape('[Integration:PeerPool]', async (t) => {
  async function setup(protocols: any[] = []): Promise<any[]> {
    const server = new MockServer()
    server.addProtocols(protocols)
    await server.start()
    const pool = new PeerPool({
      //@ts-ignore allow Config instantiation with MockServer
      config: new Config({ servers: [server] }),
    })
    await pool.open()
    return [server, pool]
  }

  async function destroy(server: any, pool: any) {
    await server.stop()
    await pool.close()
  }

  t.test('should open', async (t) => {
    const [server, pool] = await setup()
    t.ok(pool.opened, 'opened')
    await destroy(server, pool)
    t.end()
  })

  t.test('should add/remove peer', async (t) => {
    t.plan(3)
    const [server, pool] = await setup()
    pool.on('added', (peer: any) => t.equal(peer.id, 'peer0', 'added peer'))
    pool.on('removed', (peer: any) => t.equal(peer.id, 'peer0', 'removed peer'))
    await server.accept('peer0')
    setTimeout(async () => {
      server.disconnect('peer0')
      await destroy(server, pool)
      t.pass('destroyed')
    }, 100)
  })

  t.test('should ban peer', async (t) => {
    t.plan(3)
    const [server, pool] = await setup()
    pool.on('added', (peer: any) => t.equal(peer.id, 'peer0', 'added peer'))
    pool.on('banned', (peer: any) => t.equal(peer.id, 'peer0', 'banned peer'))
    await server.accept('peer0')
    setTimeout(async () => {
      pool.ban(pool.peers[0])
      await destroy(server, pool)
      t.pass('destroyed')
    }, 100)
  })

  t.test('should handle peer messages', async (t) => {
    t.plan(3)
    const chain = new MockChain()
    await chain.open()
    const protocols = [
      new EthProtocol({
        config: new Config(),
        chain,
      }),
    ]
    const [server, pool] = await setup(protocols)
    pool.on('added', (peer: any) => t.equal(peer.id, 'peer0', 'added peer'))
    pool.on('message', (msg: any, proto: any, peer: any) => {
      t.deepEqual([msg, proto, peer.id], ['msg0', 'proto0', 'peer0'], 'got message')
    })
    await server.accept('peer0')
    setTimeout(async () => {
      pool.peers[0].emit('message', 'msg0', 'proto0')
      await destroy(server, pool)
      t.pass('destroyed')
    }, 100)
  })
})
