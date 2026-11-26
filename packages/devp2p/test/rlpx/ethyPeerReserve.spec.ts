import { Common, Mainnet } from '@ethereumjs/common'
import { randomBytes } from '@ethereumjs/util'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Peer } from '../../src/rlpx/peer.ts'
import { RLPx } from '../../src/rlpx/rlpx.ts'
import { DISCONNECT_REASON } from '../../src/types.ts'

class ETH {}
class SNAP {}
class ETHY {
  private readonly _mask: number
  constructor(mask = 0xffff) {
    this._mask = mask
  }
  peerStatus() {
    return { bucketsBitmask: this._mask }
  }
}
class OTHER {}

function fakePeer(protoNames: Array<'ETH' | 'SNAP' | 'ETHY' | 'OTHER'>): {
  peer: Peer
  disconnect: ReturnType<typeof vi.fn>
} {
  const protos = protoNames.map((n) => {
    if (n === 'ETH') return new ETH()
    if (n === 'SNAP') return new SNAP()
    if (n === 'ETHY') return new ETHY()
    return new OTHER()
  })
  const disconnect = vi.fn()
  const peer = Object.create(Peer.prototype) as Peer
  Object.assign(peer, {
    getProtocols: () => protos,
    disconnect,
  })
  return { peer, disconnect }
}

const KEY_1 = '11'.repeat(32)
const KEY_2 = '22'.repeat(32)
const KEY_3 = '33'.repeat(32)

describe('[Devp2p/RLPx]: _enforceEthyPeerReserve', () => {
  const open: RLPx[] = []

  afterEach(() => {
    for (const rlpx of open) {
      rlpx['_peers'].clear()
      rlpx.destroy()
    }
    open.length = 0
  })

  function makeRlpx(maxPeers: number, minEthyPeers: number): RLPx {
    const rlpx = new RLPx(randomBytes(32), {
      timeout: 1000,
      maxPeers,
      minEthyPeers,
      capabilities: [],
      common: new Common({ chain: Mainnet }),
    })
    open.push(rlpx)
    return rlpx
  }

  it('does not evict the last non-ETHY ETH/SNAP peer', () => {
    const rlpx = makeRlpx(2, 2)
    const headSnap = fakePeer(['ETH', 'SNAP'])
    const incoming = fakePeer(['ETHY'])
    rlpx['_peers'].set(KEY_1, headSnap.peer)
    rlpx['_peers'].set(KEY_2, incoming.peer)
    ;(rlpx as unknown as { _enforceEthyPeerReserve: (p: Peer) => void })._enforceEthyPeerReserve(
      incoming.peer,
    )
    expect(headSnap.disconnect).not.toHaveBeenCalled()
  })

  it('evicts one non-ETHY ETH/SNAP peer when at least two exist', () => {
    const rlpx = makeRlpx(3, 2)
    const headSnapA = fakePeer(['ETH', 'SNAP'])
    const headSnapB = fakePeer(['ETH'])
    const incoming = fakePeer(['ETHY'])
    rlpx['_peers'].set(KEY_1, headSnapA.peer)
    rlpx['_peers'].set(KEY_2, headSnapB.peer)
    rlpx['_peers'].set(KEY_3, incoming.peer)
    ;(rlpx as unknown as { _enforceEthyPeerReserve: (p: Peer) => void })._enforceEthyPeerReserve(
      incoming.peer,
    )
    expect(headSnapA.disconnect).toHaveBeenCalledWith(DISCONNECT_REASON.TOO_MANY_PEERS)
    expect(headSnapB.disconnect).not.toHaveBeenCalled()
  })

  it('prefers evicting a non-ETH/non-SNAP peer over an ETH/SNAP peer', () => {
    const rlpx = makeRlpx(3, 2)
    const headSnap = fakePeer(['ETH', 'SNAP'])
    const other = fakePeer(['OTHER'])
    const incoming = fakePeer(['ETHY'])
    rlpx['_peers'].set(KEY_1, headSnap.peer)
    rlpx['_peers'].set(KEY_2, other.peer)
    rlpx['_peers'].set(KEY_3, incoming.peer)
    ;(rlpx as unknown as { _enforceEthyPeerReserve: (p: Peer) => void })._enforceEthyPeerReserve(
      incoming.peer,
    )
    expect(other.disconnect).toHaveBeenCalledWith(DISCONNECT_REASON.TOO_MANY_PEERS)
    expect(headSnap.disconnect).not.toHaveBeenCalled()
  })

  it('ignores non-ETHY incoming peers', () => {
    const rlpx = makeRlpx(3, 2)
    const headSnapA = fakePeer(['ETH', 'SNAP'])
    const headSnapB = fakePeer(['ETH', 'SNAP'])
    const incomingNonEthy = fakePeer(['ETH'])
    rlpx['_peers'].set(KEY_1, headSnapA.peer)
    rlpx['_peers'].set(KEY_2, headSnapB.peer)
    rlpx['_peers'].set(KEY_3, incomingNonEthy.peer)
    ;(rlpx as unknown as { _enforceEthyPeerReserve: (p: Peer) => void })._enforceEthyPeerReserve(
      incomingNonEthy.peer,
    )
    expect(headSnapA.disconnect).not.toHaveBeenCalled()
    expect(headSnapB.disconnect).not.toHaveBeenCalled()
  })
})

describe('[Devp2p/RLPx]: _trimSurplusPeers mask-0 ETHY', () => {
  const open: RLPx[] = []

  afterEach(() => {
    for (const rlpx of open) {
      rlpx['_peers'].clear()
      rlpx.destroy()
    }
    open.length = 0
  })

  function makeRlpx(maxPeers: number, minEthyPeers: number): RLPx {
    const rlpx = new RLPx(randomBytes(32), {
      timeout: 1000,
      maxPeers,
      minEthyPeers,
      capabilities: [],
      common: new Common({ chain: Mainnet }),
    })
    open.push(rlpx)
    return rlpx
  }

  it('prefers evicting ETHY peers with bucketsBitmask 0 even when minEthyPeers protects custodians', () => {
    const rlpx = makeRlpx(1, 1)
    const custodianDisconnect = vi.fn()
    const custodian = Object.create(Peer.prototype) as Peer
    Object.assign(custodian, {
      getProtocols: () => [new ETHY(0xffff)],
      disconnect: custodianDisconnect,
    })
    const leechDisconnect = vi.fn()
    const leech = Object.create(Peer.prototype) as Peer
    Object.assign(leech, {
      getProtocols: () => [new ETHY(0)],
      disconnect: leechDisconnect,
    })
    rlpx['_peers'].set(KEY_1, custodian)
    rlpx['_peers'].set(KEY_2, leech)
    ;(rlpx as unknown as { _trimSurplusPeers: () => void })._trimSurplusPeers()
    expect(leechDisconnect).toHaveBeenCalledWith(DISCONNECT_REASON.TOO_MANY_PEERS)
    expect(custodianDisconnect).not.toHaveBeenCalled()
  })

  it('_enforceEthyPeerReserve evicts mask-0 ETHY peer before non-ETHY peers for incoming custodian', () => {
    const rlpx = makeRlpx(3, 2)
    const headSnap = fakePeer(['ETH'])
    const leechDisconnect = vi.fn()
    const leech = Object.create(Peer.prototype) as Peer
    Object.assign(leech, {
      getProtocols: () => [new ETHY(0)],
      disconnect: leechDisconnect,
    })
    const incomingCustodian = fakePeer(['ETHY'])
    rlpx['_peers'].set(KEY_1, headSnap.peer)
    rlpx['_peers'].set(KEY_2, leech)
    rlpx['_peers'].set(KEY_3, incomingCustodian.peer)
    ;(rlpx as unknown as { _enforceEthyPeerReserve: (p: Peer) => void })._enforceEthyPeerReserve(
      incomingCustodian.peer,
    )
    expect(leechDisconnect).toHaveBeenCalledWith(DISCONNECT_REASON.TOO_MANY_PEERS)
    expect(headSnap.disconnect).not.toHaveBeenCalled()
  })
})
