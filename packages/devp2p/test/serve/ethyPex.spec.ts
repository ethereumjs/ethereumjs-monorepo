import { assert, describe, it } from 'vitest'

import { type EthyKnownPeerRow, selectEthyPexPeers } from '../../src/worker/ethyPex.ts'

function row(block: bigint, mask: number, seen: number): EthyKnownPeerRow {
  return {
    peerId: new Uint8Array(32).fill(Number(block % 256n)),
    address: '127.0.0.1',
    tcpPort: 30303,
    udpPort: 30303,
    basePivotBlock: block,
    bucketsBitmask: mask,
    lastSeenSec: seen,
  }
}

describe('[Devp2p/ETHY]: PEX peer selection', () => {
  it('selectEthyPexPeers returns 75% freshest then random fill', () => {
    const rows = [row(100n, 0xffff, 1), row(200n, 0xffff, 2), row(150n, 0x0f, 3), row(50n, 1, 4)]
    const picked = selectEthyPexPeers(rows, 4, () => 0)
    assert.equal(picked.length, 4)
    assert.equal(picked[0]!.basePivotBlock, 200n)
    assert.equal(picked[1]!.basePivotBlock, 150n)
    assert.ok(picked.some((p) => p.basePivotBlock === 100n))
  })
})
