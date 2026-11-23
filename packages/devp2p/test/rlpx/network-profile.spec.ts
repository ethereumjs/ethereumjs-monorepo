import { assert, describe, it, vi } from 'vitest'

import { randomBytes } from '@ethereumjs/util'

import { Common, Mainnet } from '@ethereumjs/common'
import { DPT, genPrivateKey } from '../../src/index.ts'
import { ETH, SNAP } from '../../src/protocol/index.ts'
import { RLPx } from '../../src/rlpx/rlpx.ts'
import { destroyRLPXs, initTwoPeerRLPXSetup } from '../helpers.ts'

describe('[Devp2p/RLPx]: network profile', () => {
  it('applyNetworkProfile() drops snap1 from wire capability list', () => {
    const { rlpxs } = initTwoPeerRLPXSetup(
      2,
      [ETH.eth68, SNAP.snap],
      new Common({ chain: Mainnet }),
    )
    const rlpx = rlpxs[0]!
    assert.ok(rlpx.getWireCapabilityNames().includes('snap1'))
    rlpx.applyNetworkProfile({
      capabilities: ['eth68'],
      maxPeers: 10,
      discoveryMode: 'off',
      ethyDiscoveryTag: false,
    })
    assert.strictEqual(rlpx.getWireCapabilityNames().includes('snap1'), false)
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
