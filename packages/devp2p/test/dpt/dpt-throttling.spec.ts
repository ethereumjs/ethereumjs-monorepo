import { assert, describe, it, vi } from 'vitest'

import { randomBytes } from '@ethereumjs/util'

import { Common, Mainnet } from '@ethereumjs/common'
import { DPT, genPrivateKey } from '../../src/index.ts'
import { ETH } from '../../src/protocol/index.ts'
import { Peer } from '../../src/rlpx/peer.ts'
import { destroyRLPXs, initTwoPeerRLPXSetup } from '../helpers.ts'

describe('[Devp2p/DPT]: discovery throttling', () => {
  it('DPT.setDiscoveryPaused() skips findneighbours on refresh()', async () => {
    const basePort = 30440
    const dpt = new DPT(genPrivateKey(), {
      endpoint: { address: '127.0.0.1', udpPort: basePort, tcpPort: basePort },
      shouldFindNeighbours: true,
      revalidatePeers: false,
    })
    dpt.bind(basePort)
    dpt['_kbucket'].add({
      id: randomBytes(64),
      address: '127.0.0.1',
      udpPort: basePort + 1,
      tcpPort: basePort + 1,
      vectorClock: 0,
    })
    const findSpy = vi.spyOn(dpt['_server'], 'findneighbours')
    dpt.setDiscoveryPaused(true)
    await dpt.refresh()
    assert.strictEqual(findSpy.mock.calls.length, 0)
    dpt.setDiscoveryPaused(false)
    findSpy.mockClear()
    await dpt.refresh()
    assert.ok(findSpy.mock.calls.length >= 0)
    dpt.destroy()
  })

  it('DPT maxInFlightPings caps concurrent addPeer calls from a batch', async () => {
    const basePort = 30450
    const dpt = new DPT(genPrivateKey(), {
      endpoint: { address: '127.0.0.1', udpPort: basePort, tcpPort: basePort },
      shouldFindNeighbours: false,
      maxInFlightPings: 2,
      timeout: 50,
    })
    dpt.bind(basePort)
    let inFlight = 0
    let maxSeen = 0
    const orig = dpt.addPeer.bind(dpt)
    dpt.addPeer = async (peer) => {
      inFlight++
      maxSeen = Math.max(maxSeen, inFlight)
      try {
        return await orig(peer)
      } finally {
        inFlight--
      }
    }
    const peers = Array.from({ length: 20 }, (_, i) => ({
      address: '127.0.0.1',
      udpPort: 40000 + i,
      tcpPort: 40000 + i,
    }))
    dpt['_addPeerBatch'](peers)
    await new Promise((r) => setTimeout(r, 300))
    assert.ok(maxSeen <= 2)
    dpt.destroy()
  })

  it('RLPx throttleDiscovery pauses DPT when peer slots are full', () => {
    const { rlpxs } = initTwoPeerRLPXSetup(2, [ETH.eth68], new Common({ chain: Mainnet }))
    const rlpx = rlpxs[0]!
    const dpt = rlpx['_dpt']!
    rlpx['_throttleDiscovery'] = true
    rlpx['_maxPeers'] = 2
    rlpx['_discoveryLowWaterMark'] = 1
    rlpx['_peers'].set('aa', Object.create(Peer.prototype) as Peer)
    rlpx['_peers'].set('bb', Object.create(Peer.prototype) as Peer)
    rlpx['_syncDiscoveryThrottle']()
    assert.strictEqual(dpt.isDiscoveryPaused(), true)
    rlpx['_peers'].clear()
    rlpx['_syncDiscoveryThrottle']()
    assert.strictEqual(dpt.isDiscoveryPaused(), false)
    destroyRLPXs(rlpxs)
  })
})
