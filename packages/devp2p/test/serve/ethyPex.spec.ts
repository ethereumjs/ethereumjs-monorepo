import { assert, describe, it } from 'vitest'

import { type EthyKnownPeerRow, selectEthyPexPeers } from '../../src/worker/ethyPex.ts'

function row(
  block: bigint,
  mask: number,
  seen: number,
  trieMask = mask,
  storageMask = 0,
  codeMask = 0,
): EthyKnownPeerRow {
  return {
    peerId: new Uint8Array(32).fill(Number((block + BigInt(mask)) % 256n)),
    address: '127.0.0.1',
    tcpPort: 30303,
    udpPort: 30303,
    basePivotBlock: block,
    bucketsBitmask: mask,
    storageBucketsBitmask: storageMask,
    codeBucketsBitmask: codeMask,
    trieBucketsBitmask: trieMask,
    lastSeenSec: seen,
  }
}

describe('[Devp2p/ETHY]: PEX peer selection', () => {
  it('selectEthyPexPeers returns 75% freshest then random fill', () => {
    const rows = [row(100n, 0xffff, 1), row(200n, 0xffff, 2), row(150n, 0x0f, 3), row(50n, 1, 4)]
    const picked = selectEthyPexPeers(rows, 4, 0, () => 0)
    assert.equal(picked.length, 4)
    assert.equal(picked[0]!.basePivotBlock, 200n)
    assert.equal(picked[1]!.basePivotBlock, 150n)
    assert.ok(picked.some((p) => p.basePivotBlock === 100n))
  })

  it('selectEthyPexPeers omits mask-0 custodians', () => {
    const rows = [row(100n, 0, 1), row(200n, 0xffff, 2)]
    const picked = selectEthyPexPeers(rows, 8, 0)
    assert.equal(picked.length, 1)
    assert.equal(picked[0]!.basePivotBlock, 200n)
  })

  it('selectEthyPexPeers prioritizes desiredBucketsMask and trieBucketsBitmask even across large block/timestamp gaps', () => {
    const now = 1_795_000_000
    // Newer block & newer timestamp, but ZERO overlap with desired bucket 0x04
    const nonMatching = row(12_000_500n, 0x0001, now + 100, 0x0001, 0x0001, 0x0001)
    // Older block & older timestamp, matches bucket 0x04 without trie
    const flatMatch = row(12_000_000n, 0x0004, now - 50, 0x0000, 0x0004, 0x0004)
    // Older block, matches bucket 0x04 WITH live subtree trie
    const trieMatch = row(11_999_900n, 0x0004, now - 80, 0x0004, 0x0004, 0x0004)

    const picked = selectEthyPexPeers([nonMatching, flatMatch, trieMatch], 3, 0x0004)
    assert.equal(picked[0]!.trieBucketsBitmask, 0x0004)
    assert.equal(picked[1]!.bucketsBitmask, 0x0004)
    assert.equal(picked[2]!.bucketsBitmask, 0x0001)
  })
})
