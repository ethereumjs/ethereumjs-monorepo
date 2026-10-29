import { Common, Mainnet } from '@ethereumjs/common'
import { bytesToUnprefixedHex, randomBytes } from '@ethereumjs/util'
import { afterEach, describe, expect, it } from 'vitest'

import { markChainDirectoryPeer } from '../../src/discovery/directoryPeer.ts'
import { RLPx } from '../../src/index.ts'

import type { PeerInfo } from '../../src/index.ts'

const privateKey = randomBytes(32)

function createRlpx(): RLPx {
  return new RLPx(privateKey, {
    timeout: 1000,
    maxPeers: 1,
    capabilities: [],
    common: new Common({ chain: Mainnet }),
  })
}

function peer(fill: number): PeerInfo {
  return {
    id: new Uint8Array(32).fill(fill),
    address: '1.2.3.4',
    udpPort: 30303,
    tcpPort: 30303,
  }
}

describe('[Devp2p/RLPx]: dial queue', () => {
  const open: RLPx[] = []

  afterEach(() => {
    for (const rlpx of open) rlpx.destroy()
    open.length = 0
  })

  it('holds a bonded peer when the dial queue is full', () => {
    const rlpx = createRlpx()
    open.push(rlpx)
    rlpx['_peers'].set('aa', {} as never)
    while (rlpx['_getOpenQueueSlots']() > 0) {
      rlpx['_peersQueue'].push({ peer: { tcpPort: 30303, address: '127.0.0.1' }, ts: 0 })
    }

    const discovered = peer(7)
    rlpx['_onDiscoveredPeer'](discovered)
    rlpx['_onDiscoveredPeer'](discovered)

    expect(rlpx['_peersDeferred']).toHaveLength(1)
    expect(rlpx['_peersLRU'].has(bytesToUnprefixedHex(discovered.id!))).toBe(false)
  })

  it('moves a held peer onto the dial queue when a slot opens', () => {
    const rlpx = createRlpx()
    open.push(rlpx)
    rlpx['_peers'].set('aa', {} as never)
    const discovered = peer(9)
    rlpx['_peersDeferred'].push(discovered)

    rlpx['_promoteDeferredDials']()

    expect(rlpx['_peersDeferred']).toHaveLength(0)
    expect(rlpx['_peersQueue']).toHaveLength(1)
    expect(rlpx['_peersLRU'].has(bytesToUnprefixedHex(discovered.id!))).toBe(true)
  })

  it('dials a directory peer before a discv4 neighbor', () => {
    const rlpx = createRlpx()
    open.push(rlpx)
    const dialed: PeerInfo[] = []
    rlpx['_connectToPeer'] = (peer: PeerInfo) => {
      dialed.push(peer)
    }
    const directory = markChainDirectoryPeer(peer(4))
    rlpx['_peersQueue'].push({ peer: directory, ts: 0 })
    rlpx['_peersLRU'].set(bytesToUnprefixedHex(directory.id!), true)

    const neighbor = peer(5)
    rlpx['_onDiscoveredPeer'](neighbor)

    expect(dialed).toEqual([directory])
    expect(rlpx['_peersQueue']).toHaveLength(1)
    expect(rlpx['_peersQueue'][0]?.peer.id).toEqual(neighbor.id)
  })
})
