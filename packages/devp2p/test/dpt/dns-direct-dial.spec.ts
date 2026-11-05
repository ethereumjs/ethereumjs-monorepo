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

  it('bonds up to 4 DNS seeds into DPT when shouldFindNeighbours is enabled and bootstraps stored nodes on listening', async () => {
    const storedId = 'aa'.repeat(64)
    const mockStore = {
      get: () => undefined,
      put: () => {},
      remove: () => {},
      list: () => [
        {
          id: storedId,
          address: '10.0.0.1',
          udpPort: 30303,
          tcpPort: 30303,
          failCount: 0,
        },
      ],
    }
    const dpt = new DPT(genPrivateKey(), {
      common: new Common({ chain: Sepolia, hardfork: 'amsterdam' }),
      endpoint: { address: '127.0.0.1', udpPort: 0, tcpPort: 0 },
      shouldFindNeighbours: true,
      shouldGetDnsPeers: false,
      nodeStore: mockStore,
    })

    const bootstrapSpy = vi.spyOn(dpt, 'bootstrap').mockResolvedValue(undefined)
    dpt['_server'].events.emit('listening')
    assert.strictEqual(bootstrapSpy.mock.calls.length, 1, 'bootstraps stored node on listening')

    const dnsBatch = Array.from({ length: 6 }, (_, i) => ({
      id: new Uint8Array(64).fill(i + 1),
      address: `10.0.1.${i + 1}`,
      tcpPort: 30303,
      udpPort: 30303,
      ethForkId: { forkHash: '0x6c1d9423', nextFork: 0n },
    }))
    dpt._feedDnsDirectoryPeers(dnsBatch)
    assert.strictEqual(bootstrapSpy.mock.calls.length, 1 + 4, 'bonds up to 4 DNS seeds per refresh')

    dpt.destroy()
    bootstrapSpy.mockRestore()
  })
})
