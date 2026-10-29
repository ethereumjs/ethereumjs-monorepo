import { Common, Sepolia } from '@ethereumjs/common'
import { assert, describe, it, vi } from 'vitest'

import { DPT } from '../../src/dpt/dpt.ts'
import { genPrivateKey } from '../../src/util.ts'

describe('[Devp2p/DPT]: DNS direct dial', () => {
  it('_feedDnsDirectoryPeers() emits peer:new and skips addPeer for complete ENR peers', async () => {
    const dpt = new DPT(genPrivateKey(), {
      common: new Common({ chain: Sepolia, hardfork: 'amsterdam' }),
      endpoint: { address: '127.0.0.1', udpPort: 0, tcpPort: 0 },
      shouldFindNeighbours: false,
      shouldGetDnsPeers: false,
    })

    const addPeerSpy = vi.spyOn(dpt, 'addPeer')
    const seen: unknown[] = []
    dpt.events.on('peer:new', (p) => seen.push(p))

    const id = new Uint8Array(64).fill(0xab)
    dpt._feedDnsDirectoryPeers([
      {
        id,
        address: '1.2.3.4',
        tcpPort: 30303,
        udpPort: 30303,
        ethForkId: { forkHash: '0x6c1d9423', nextFork: 0n },
      },
    ])

    assert.strictEqual(seen.length, 1)

    dpt._feedDnsDirectoryPeers([
      {
        id: new Uint8Array(64).fill(0xcd),
        address: '5.6.7.8',
        tcpPort: 30303,
      },
    ])
    assert.strictEqual(seen.length, 1, 'ENR without eth is skipped when common is set')
    assert.strictEqual(addPeerSpy.mock.calls.length, 0)

    dpt._feedDnsDirectoryPeers([
      {
        id,
        address: '1.2.3.4',
        tcpPort: 30303,
        ethForkId: { forkHash: '0xdeadbeef', nextFork: 0n },
      },
    ])
    assert.strictEqual(seen.length, 1)

    dpt.destroy()
    addPeerSpy.mockRestore()
  })
})
