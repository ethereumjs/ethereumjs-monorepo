import { assert, describe, it } from 'vitest'

import { testData } from '../testdata.ts'

import * as util from './util.ts'

describe('DPT simulator tests', () => {
  it('DPT: new working node', () => {
    const dpts = util.initTwoPeerDPTSetup(41622)

    dpts[0].events.on('peer:new', async (peer) => {
      assert.equal(peer.address, '127.0.0.1', 'should have added peer on peer:new')
      await util.delay(500)
      util.destroyDPTs(dpts)
    })
  })

  it('DPT: working node added', () => {
    const dpts = util.initTwoPeerDPTSetup(42622)

    dpts[0].events.on('peer:added', async () => {
      assert.equal(dpts[0].getPeers().length, 1, 'should have added peer to k-bucket on peer:added')
      await util.delay(500)
      util.destroyDPTs(dpts)
    })
  })

  it('DPT: remove node', () => {
    const dpts = util.initTwoPeerDPTSetup(42632)

    try {
      dpts[0].events.on('peer:added', async (peer) => {
        await util.delay(400)
        dpts[0].removePeer(peer)
      })
      dpts[0].events.on('peer:removed', async () => {
        assert.equal(
          dpts[0].getPeers().length,
          0,
          'should have removed peer from k-bucket on peer:removed',
        )
        await util.delay(500)
        util.destroyDPTs(dpts)
      })
    } catch (err) {
      assert.fail(`An unexpected error occurred: ${err}`)
    }
  })

  it('DPT: ban node', () => {
    const dpts = util.initTwoPeerDPTSetup(42642)

    try {
      dpts[0].events.once('peer:added', async (peer) => {
        await util.delay(400)
        dpts[0].banPeer(peer)
      })
      dpts[0].events.once('peer:removed', async (peer) => {
        assert.equal(dpts[0]['_banlist'].has(peer), true, 'ban-list should contain peer')
        assert.equal(
          dpts[0].getPeers().length,
          0,
          'should have removed peer from k-bucket on peer:removed',
        )
        await util.delay(500)
        util.destroyDPTs(dpts)
      })
    } catch (err) {
      assert.fail(`An unexpected error occurred: ${err}`)
    }
  })

  it('DPT: k-bucket ping', () => {
    const dpts = util.initTwoPeerDPTSetup(42732)

    try {
      dpts[0].events.once('peer:added', async (peer) => {
        dpts[0]._onKBucketPing([peer], peer)
        await util.delay(400)
        assert.equal(dpts[0].getPeers().length, 1, 'should still have one peer in k-bucket')
        await util.delay(400)
        util.destroyDPTs(dpts)
      })
    } catch (err) {
      assert.fail(`An unexpected error occurred: ${err}`)
    }
  })

  it('DPT: add non-available node', async () => {
    const dpts = util.getTestDPTs(1, 48712)
    const peer = { address: util.localhost, udpPort: 19218 }

    await dpts[0].addPeer(peer).catch(async (e: Error) => {
      assert.equal(e.message, 'Timeout error: ping 127.0.0.1:19218', 'should throw Timeout error')
      await util.delay(400)
      util.destroyDPTs(dpts)
    })
  })

  it('DPT: simulate bootstrap', async () => {
    const numDPTs = 6
    const basePort = 31251
    const dpts = util.getTestDPTs(numDPTs, basePort)
    for (const dpt of dpts) {
      dpt['_shouldFindNeighbours'] = true // turn on findNeighbors for bootstrap test
    }
    await util.delay(250)
    await dpts[0].addPeer({ address: util.localhost, udpPort: basePort + 1 })
    await util.delay(100)

    for (const dpt of dpts.slice(2)) {
      await dpt.bootstrap({ address: util.localhost, udpPort: basePort + 1 })
    }

    for (const dpt of dpts) {
      for (let i = 0; i < 10; i++) {
        void dpt.refresh()
      }
      await util.delay(400)
    }

    await util.delay(500)

    for (const dpt of dpts) {
      assert.equal(dpt.getPeers().length, numDPTs, 'Peers should be distributed to all DPTs')
    }
    await util.delay(1000)

    util.destroyDPTs(dpts)
  }, 60000)

  it('DPT: simulate acquiring peers via DNS', async () => {
    const dpts = util.getTestDPTsWithDns(1, 18519)

    const mockDns = {
      resolve: () => {
        return [[testData.dns.enr]]
      },
    }
    dpts[0]._addPeerBatch = () => {
      dpts[0].destroy()
      assert.isTrue(true, 'got peer from DNS')
    }
    dpts[0]['_dns'].__setNativeDNSModuleResolve(mockDns)
    await dpts[0].refresh()
  })
})
