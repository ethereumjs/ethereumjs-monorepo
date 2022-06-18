import * as test from 'tape'
import * as util from './util'
import { DISCONNECT_REASONS } from '../../src/rlpx/peer'

test('RLPX: add working node', (t) => {
  const rlpxs = util.initTwoPeerRLPXSetup()

  rlpxs[0].on('peer:added', async (peer: any) => {
    t.equal(peer._port, 30306, 'should have added peer on peer:added after successful handshake')
    t.equal(rlpxs[0].getPeers().length, 1, 'peer list length should be 1')
    t.equal(rlpxs[0]._getOpenSlots(), 9, 'should have maxPeers - 1 open slots left')
    await util.delay(500)
    util.destroyRLPXs(rlpxs)
    t.end()
  })
})

test('RLPX: ban node with missing tcp port', (t) => {
  const rlpxs = util.initTwoPeerRLPXSetup()

  rlpxs[0].on('peer:added', async () => {
    const peer = {
      id: Buffer.from('abcd', 'hex'),
      address: '127.0.0.1',
      udpPort: 30308,
      tcpPort: null,
    }
    t.notOk(
      rlpxs[0]._dpt!.banlist.has(peer),
      'should not be in ban list before bad peer discovered'
    )
    rlpxs[0]._dpt!.emit('peer:new', peer)
    t.ok(rlpxs[0]._dpt!.banlist.has(peer), 'should be in ban list after bad peer discovered')
    await util.delay(500)
    util.destroyRLPXs(rlpxs)
    t.end()
  })
})

test('RLPX: remove node', (t) => {
  const rlpxs = util.initTwoPeerRLPXSetup()

  try {
    rlpxs[0].once('peer:added', (peer: any) => {
      rlpxs[0].disconnect(peer._remoteId)
    })
    rlpxs[0].once('peer:removed', async (peer: any, reason: any) => {
      t.equal(
        reason,
        DISCONNECT_REASONS.CLIENT_QUITTING,
        'should close with CLIENT_QUITTING disconnect reason'
      )
      t.equal(rlpxs[0]._getOpenSlots(), 10, 'should have maxPeers open slots left')
      await util.delay(500)
      util.destroyRLPXs(rlpxs)
      t.end()
    })
  } catch (err) {
    t.fail(`An unexpected error occurred: ${err}`)
  }
})

test('RLPX: test peer queue / refill connections', (t) => {
  const rlpxs = util.getTestRLPXs(3, 1)

  const peer = { address: util.localhost, udpPort: util.basePort + 1, tcpPort: util.basePort + 1 }
  rlpxs[0]._dpt!.addPeer(peer)
  try {
    rlpxs[0].on('peer:added', async (peer) => {
      if (peer._socket._peername.port === util.basePort + 1) {
        t.equal(rlpxs[0]._peersQueue.length, 0, 'peers queue should contain no peers')
        const peer2 = {
          address: util.localhost,
          udpPort: util.basePort + 2,
          tcpPort: util.basePort + 2,
        }
        rlpxs[0]._dpt!.addPeer(peer2)
        await util.delay(500)
        t.equal(rlpxs[0]._peersQueue.length, 1, 'peers queue should contain one peer')
      }
      if (peer._socket._peername.port === util.basePort + 2) {
        t.equal(rlpxs[0]._peersQueue.length, 0, 'peers queue should contain no peers')
        util.destroyRLPXs(rlpxs)
        t.end()
      }
    })
  } catch (err) {
    t.fail(`An unexpected error occurred: ${err}`)
  }
})
