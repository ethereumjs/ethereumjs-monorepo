import { assert, describe, it } from 'vitest'

import { type StatyKnownPeerRow, selectStatyPexPeers } from '../../src/worker/statyPex.ts'

function row(epoch: bigint, mask: bigint, hint: number, seen: number): StatyKnownPeerRow {
  return {
    peerId: new Uint8Array(32).fill(Number(epoch % 256n)),
    address: '127.0.0.1',
    tcpPort: 30303,
    udpPort: 30303,
    latestEpoch: epoch,
    epochMask: mask,
    witnessCountHint: hint,
    lastSeenSec: seen,
  }
}

describe('[Devp2p/STATY]: PEX peer selection', () => {
  it('selectStatyPexPeers returns 75% freshest then random fill', () => {
    const rows = [
      row(100n, 0xffffn, 1, 1),
      row(200n, 0xffffn, 2, 2),
      row(150n, 0x0fn, 3, 3),
      row(50n, 1n, 4, 4),
    ]
    const picked = selectStatyPexPeers(rows, 4, () => 0)
    assert.equal(picked.length, 4)
    assert.equal(picked[0]!.latestEpoch, 200n)
    assert.equal(picked[1]!.latestEpoch, 150n)
    assert.ok(picked.some((p) => p.latestEpoch === 100n))
  })
})
