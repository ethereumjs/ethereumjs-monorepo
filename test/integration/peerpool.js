const tape = require('tape')
const { EthProtocol } = require('../../lib/net/protocol')
const PeerPool = require('../../lib/net/peerpool')
const MockServer = require('./mocks/mockserver.js')
const MockChain = require('./mocks/mockchain.js')
const { defaultLogger } = require('../../lib/logging')
defaultLogger.silent = true

tape('[Integration:PeerPool]', async (t) => {
  async function setup (protocols = []) {
    const server = new MockServer()
    server.addProtocols(protocols)
    await server.start()
    const pool = new PeerPool({ servers: [ server ] })
    await pool.open()
    return [server, pool]
  }

  async function destroy (server, pool) {
    await server.stop()
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
    pool.on('added', peer => t.equal(peer.id, 'peer0', 'added peer'))
    pool.on('removed', peer => t.equal(peer.id, 'peer0', 'removed peer'))
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
    pool.on('added', peer => t.equal(peer.id, 'peer0', 'added peer'))
    pool.on('banned', peer => t.equal(peer.id, 'peer0', 'banned peer'))
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
    const protocols = [ new EthProtocol({ chain }) ]
    const [server, pool] = await setup(protocols)
    pool.on('added', peer => t.equal(peer.id, 'peer0', 'added peer'))
    pool.on('message', (msg, proto, peer) => {
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
