import { assert, describe, it, vi } from 'vitest'

import { randomBytes } from '@ethereumjs/util'

import { Common, Mainnet } from '@ethereumjs/common'
import { DPT, genPrivateKey } from '../../src/index.ts'
import { ETH, ETHY, SNAP } from '../../src/protocol/index.ts'
import { Peer } from '../../src/rlpx/peer.ts'
import { destroyRLPXs, initTwoPeerRLPXSetup } from '../helpers.ts'

function fakePeer(idByte: number, protocols: string[], onDisconnect: () => void): Peer {
  const peer = Object.create(Peer.prototype) as Peer
  const id = new Uint8Array(64).fill(idByte)
  ;(peer as any).getId = () => id
  ;(peer as any).getProtocols = () => protocols.map((name) => ({ constructor: { name } }))
  ;(peer as any).disconnect = () => {
    onDisconnect()
  }
  return peer
}

describe('[Devp2p/RLPx]: network profile', () => {
  it('applyNetworkProfile() drops snap1 from wire capability list and wakes DPT without throttle', () => {
    const { rlpxs } = initTwoPeerRLPXSetup(
      2,
      [ETH.eth68, SNAP.snap],
      new Common({ chain: Mainnet }),
    )
    const rlpx = rlpxs[0]!
    const dpt = rlpx['_dpt']!
    rlpx['_throttleDiscovery'] = false
    assert.ok(rlpx.getWireCapabilityNames().includes('snap1'))
    rlpx.applyNetworkProfile({
      capabilities: ['eth68'],
      maxPeers: 10,
      discoveryMode: 'off',
      ethyDiscoveryTag: false,
    })
    assert.strictEqual(rlpx.getWireCapabilityNames().includes('snap1'), false)
    assert.strictEqual(dpt.getDiscoveryMode(), 'off')
    rlpx.applyNetworkProfile({
      capabilities: ['eth68'],
      maxPeers: 10,
      discoveryMode: 'active',
      ethyDiscoveryTag: false,
    })
    assert.strictEqual(dpt.getDiscoveryMode(), 'active')
    destroyRLPXs(rlpxs)
  })

  it('_trimSurplusPeers preserves minEthyPeers and last ETH peer by decrementing counts', () => {
    const { rlpxs } = initTwoPeerRLPXSetup(
      2,
      [ETH.eth68, ETHY.ethy0],
      new Common({ chain: Mainnet }),
    )
    const rlpx = rlpxs[0]!
    const dropped: number[] = []
    rlpx['_peers'].set(
      '01',
      fakePeer(1, ['ETH', 'ETHY'], () => dropped.push(1)),
    )
    rlpx['_peers'].set(
      '02',
      fakePeer(2, ['ETH', 'ETHY'], () => dropped.push(2)),
    )
    rlpx['_peers'].set(
      '03',
      fakePeer(3, ['ETH', 'ETHY'], () => dropped.push(3)),
    )
    rlpx['_peers'].set(
      '04',
      fakePeer(4, ['ETH', 'SNAP'], () => dropped.push(4)),
    )
    rlpx.applyNetworkProfile({
      capabilities: ['eth68', 'ethy0'],
      maxPeers: 2,
      minEthyPeers: 2,
      discoveryMode: 'off',
      ethyDiscoveryTag: true,
    })
    // Peer 4 (snap while snap1 off) + exactly 1 ethy peer dropped; 2 ethy peers preserved.
    assert.strictEqual(dropped.length, 2)
    assert.ok(dropped.includes(4))
    destroyRLPXs(rlpxs)
  })

  it('DPT setDiscoveryMode("off") skips revalidation on refresh()', async () => {
    const basePort = 30441
    const dpt = new DPT(genPrivateKey(), {
      endpoint: { address: '127.0.0.1', udpPort: basePort, tcpPort: basePort },
      shouldFindNeighbours: true,
      revalidatePeers: true,
    })
    dpt.bind(basePort)
    dpt['_kbucket'].add({
      id: randomBytes(64),
      address: '127.0.0.1',
      udpPort: basePort + 1,
      tcpPort: basePort + 1,
      vectorClock: 0,
    })
    const revalSpy = vi.spyOn(dpt as any, '_revalidateOnePeer')
    dpt.setDiscoveryMode('off')
    await dpt.refresh()
    assert.strictEqual(revalSpy.mock.calls.length, 0)
    dpt.destroy()
  })
})
