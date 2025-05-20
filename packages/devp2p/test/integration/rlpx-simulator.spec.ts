import { hexToBytes } from '@ethereumjs/util'
import { assert, describe, it } from 'vitest'

import { DISCONNECT_REASON } from '../../src/types.ts'

import * as util from './util.ts'

describe('RLPx simulator tests', () => {
  it('RLPX: add working node', async () => {
    const basePort = 40404
    const { rlpxs, peer } = util.initTwoPeerRLPXSetup(undefined, undefined, undefined, basePort + 1)
    rlpxs[0]['_dpt']!.addPeer(peer).catch(() => {
      throw new Error('Peering failed')
    })
    await new Promise((resolve) => {
      rlpxs[0].events.on('peer:added', async (peer) => {
        assert.strictEqual(
          peer['_port'],
          basePort + 1,
          'should have added peer on peer:added after successful handshake',
        )
        assert.strictEqual(rlpxs[0].getPeers().length, 1, 'peer list length should be 1')
        assert.strictEqual(rlpxs[0]._getOpenSlots(), 9, 'should have maxPeers - 1 open slots left')
        await util.delay(500)
        util.destroyRLPXs(rlpxs)
        resolve(undefined)
      })
    })
  })
  it('RLPX: ban node with missing tcp port', async () => {
    const { rlpxs, peer } = util.initTwoPeerRLPXSetup(undefined, undefined, undefined, 40444)
    rlpxs[0]['_dpt']!.addPeer(peer).catch(() => {
      throw new Error('Peering failed')
    })
    await new Promise((resolve) => {
      rlpxs[0].events.on('peer:added', async () => {
        const peer = {
          id: hexToBytes('0xabcd'),
          address: '127.0.0.1',
          udpPort: 30308,
          tcpPort: null,
        }
        assert.isFalse(
          rlpxs[0]['_dpt']!['_banlist'].has(peer),
          'should not be in ban list before bad peer discovered',
        )
        rlpxs[0]['_dpt']!.events.emit('peer:new', peer)
        assert.isTrue(
          rlpxs[0]['_dpt']!['_banlist'].has(peer),
          'should be in ban list after bad peer discovered',
        )
        await util.delay(500)
        util.destroyRLPXs(rlpxs)
        resolve(undefined)
      })
    })
  })
  it('RLPX: test peer queue / refill connections', async () => {
    const basePort = 60661
    const rlpxs = util.getTestRLPXs(3, 1, basePort)
    const peer = { address: util.localhost, udpPort: basePort + 1, tcpPort: basePort + 1 }
    void rlpxs[0]['_dpt']!.addPeer(peer)
    await new Promise((resolve) => {
      rlpxs[0].events.on('peer:added', async (peer) => {
        if ((peer['_socket'] as any)._peername.port === basePort + 1) {
          assert.strictEqual(
            rlpxs[0]['_peersQueue'].length,
            0,
            'peers queue should contain no peers',
          )
          const peer2 = {
            address: util.localhost,
            udpPort: basePort + 2,
            tcpPort: basePort + 2,
          }
          void rlpxs[0]['_dpt']!.addPeer(peer2)
          await util.delay(500)
          assert.strictEqual(
            rlpxs[0]['_peersQueue'].length,
            1,
            'peers queue should contain one peer',
          )
        }
        if ((peer['_socket'] as any)._peername.port === basePort + 2) {
          assert.strictEqual(
            rlpxs[0]['_peersQueue'].length,
            0,
            'peers queue should contain no peers',
          )
          util.destroyRLPXs(rlpxs)
          resolve(undefined)
        }
      })
    })
  }, 30000)
  it('RLPX: remove node', async () => {
    const { rlpxs, peer } = util.initTwoPeerRLPXSetup(undefined, undefined, undefined, 40504)
    // biome-ignore format: the linter doesn't like when you format this
    rlpxs[0]['_dpt']!.addPeer(peer)
      .then((peer1) => {
        rlpxs[0].disconnect(peer1['id']!)
      })
      .catch((e) => {
        throw new Error(`Peering failed: ${e}: ${e.stack}`)
      })
    await new Promise((resolve) => {
      rlpxs[0].events.once('peer:removed', async (_, reason: any) => {
        assert.strictEqual(
          reason,
          DISCONNECT_REASON.CLIENT_QUITTING,
          'should close with CLIENT_QUITTING disconnect reason',
        )
        assert.strictEqual(rlpxs[0]._getOpenSlots(), 10, 'should have maxPeers open slots left')
        await util.delay(500)
        util.destroyRLPXs(rlpxs)
      })
      resolve(undefined)
    })
  })
})
