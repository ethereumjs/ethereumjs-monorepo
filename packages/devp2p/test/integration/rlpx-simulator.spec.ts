import { hexToBytes } from 'ethereum-cryptography/utils.js'
import { assert, describe, it } from 'vitest'

import { DISCONNECT_REASONS } from '../../src/rlpx/peer.js'

import * as util from './util.js'

describe('RLPx simulator tests', () => {
  it('RLPX: add working node', () => {
    const basePort = 40404
    const rlpxs = util.initTwoPeerRLPXSetup(undefined, undefined, undefined, basePort)

    rlpxs[0].on('peer:added', async (peer: any) => {
      assert.equal(
        peer._port,
        basePort + 1,
        'should have added peer on peer:added after successful handshake'
      )
      assert.equal(rlpxs[0].getPeers().length, 1, 'peer list length should be 1')
      assert.equal(rlpxs[0]._getOpenSlots(), 9, 'should have maxPeers - 1 open slots left')
      await util.delay(500)
      util.destroyRLPXs(rlpxs)
    })
  })

  it('RLPX: ban node with missing tcp port', () => {
    const rlpxs = util.initTwoPeerRLPXSetup(undefined, undefined, undefined, 40444)

    rlpxs[0].on('peer:added', async () => {
      const peer = {
        id: hexToBytes('abcd'),
        address: '127.0.0.1',
        udpPort: 30308,
        tcpPort: null,
      }
      assert.notOk(
        rlpxs[0]._dpt!.banlist.has(peer),
        'should not be in ban list before bad peer discovered'
      )
      rlpxs[0]._dpt!.emit('peer:new', peer)
      assert.ok(rlpxs[0]._dpt!.banlist.has(peer), 'should be in ban list after bad peer discovered')
      await util.delay(500)
      util.destroyRLPXs(rlpxs)
    })
  })

  it('RLPX: remove node', () => {
    const rlpxs = util.initTwoPeerRLPXSetup(undefined, undefined, undefined, 40504)

    try {
      rlpxs[0].once('peer:added', (peer: any) => {
        rlpxs[0].disconnect(peer._remoteId)
      })
      rlpxs[0].once('peer:removed', async (peer: any, reason: any) => {
        assert.equal(
          reason,
          DISCONNECT_REASONS.CLIENT_QUITTING,
          'should close with CLIENT_QUITTING disconnect reason'
        )
        assert.equal(rlpxs[0]._getOpenSlots(), 10, 'should have maxPeers open slots left')
        await util.delay(500)
        util.destroyRLPXs(rlpxs)
      })
    } catch (err) {
      assert.fail(`An unexpected error occurred: ${err}`)
    }
  })

  it('RLPX: test peer queue / refill connections', () => {
    const basePort = 60661
    const rlpxs = util.getTestRLPXs(3, 1, basePort)
    const peer = { address: util.localhost, udpPort: basePort + 1, tcpPort: basePort + 1 }
    rlpxs[0]._dpt!.addPeer(peer)
    try {
      rlpxs[0].on('peer:added', async (peer) => {
        if (peer._socket._peername.port === basePort + 1) {
          assert.equal(rlpxs[0]._peersQueue.length, 0, 'peers queue should contain no peers')
          const peer2 = {
            address: util.localhost,
            udpPort: basePort + 2,
            tcpPort: basePort + 2,
          }
          rlpxs[0]._dpt!.addPeer(peer2)
          await util.delay(500)
          assert.equal(rlpxs[0]._peersQueue.length, 1, 'peers queue should contain one peer')
        }
        if (peer._socket._peername.port === basePort + 2) {
          assert.equal(rlpxs[0]._peersQueue.length, 0, 'peers queue should contain no peers')
          util.destroyRLPXs(rlpxs)
        }
      })
    } catch (err) {
      assert.fail(`An unexpected error occurred: ${err}`)
    }
  })
})
