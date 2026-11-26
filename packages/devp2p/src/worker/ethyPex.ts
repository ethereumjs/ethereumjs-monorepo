import { bytesToUnprefixedHex, equalsBytes } from '@ethereumjs/util'

import type { EthyPeerStatus } from '../protocol/ethy/codec.ts'

export type EthyKnownPeerRow = {
  peerId: Uint8Array
  address: string
  tcpPort: number
  udpPort: number
  basePivotBlock: bigint
  bucketsBitmask: number
  storageBucketsBitmask: number
  codeBucketsBitmask: number
  trieBucketsBitmask: number
  /** Unix seconds when last seen. */
  lastSeenSec: number
}

const MAX_KNOWN = 64

function countSetBits(mask: number): number {
  let n = mask
  let c = 0
  while (n !== 0) {
    c += n & 1
    n >>>= 1
  }
  return c
}

/**
 * Lexicographic descending comparator (returns negative when `a` ranks ahead of `b`).
 * When `desiredBucketsMask !== 0`, prioritizes:
 * 1. Bucket overlap (`bucketsBitmask & desiredBucketsMask !== 0`)
 * 2. Live subtree-trie overlap (`countSetBits(trieBucketsBitmask & desiredBucketsMask)`)
 * 3. Total 3-plane coverage on desired buckets (`buckets + storage + code`)
 * 4. Freshest `basePivotBlock` (`bigint` exact comparison)
 * 5. Most recently seen (`lastSeenSec`)
 */
function comparePexRank(
  a: EthyKnownPeerRow,
  b: EthyKnownPeerRow,
  desiredBucketsMask: number,
): number {
  if (desiredBucketsMask !== 0) {
    const aHas = (a.bucketsBitmask & desiredBucketsMask) !== 0 ? 1 : 0
    const bHas = (b.bucketsBitmask & desiredBucketsMask) !== 0 ? 1 : 0
    if (aHas !== bHas) return bHas - aHas

    const aTrie = countSetBits(a.trieBucketsBitmask & desiredBucketsMask)
    const bTrie = countSetBits(b.trieBucketsBitmask & desiredBucketsMask)
    if (aTrie !== bTrie) return bTrie - aTrie

    const aPlanes =
      countSetBits(a.bucketsBitmask & desiredBucketsMask) +
      countSetBits(a.storageBucketsBitmask & desiredBucketsMask) +
      countSetBits(a.codeBucketsBitmask & desiredBucketsMask)
    const bPlanes =
      countSetBits(b.bucketsBitmask & desiredBucketsMask) +
      countSetBits(b.storageBucketsBitmask & desiredBucketsMask) +
      countSetBits(b.codeBucketsBitmask & desiredBucketsMask)
    if (aPlanes !== bPlanes) return bPlanes - aPlanes
  }

  if (a.basePivotBlock !== b.basePivotBlock) {
    return b.basePivotBlock > a.basePivotBlock ? 1 : -1
  }

  if (desiredBucketsMask === 0) {
    const aTrie = countSetBits(a.trieBucketsBitmask)
    const bTrie = countSetBits(b.trieBucketsBitmask)
    if (aTrie !== bTrie) return bTrie - aTrie

    const aBuckets = countSetBits(a.bucketsBitmask)
    const bBuckets = countSetBits(b.bucketsBitmask)
    if (aBuckets !== bBuckets) return bBuckets - aBuckets
  }

  return b.lastSeenSec - a.lastSeenSec
}

/**
 * 75% ranked custodians; 25% random remainder. Never returns `bucketsBitmask === 0`.
 */
export function selectEthyPexPeers(
  rows: readonly EthyKnownPeerRow[],
  maxPeers: number,
  desiredBucketsMask = 0,
  rng: () => number = Math.random,
): EthyKnownPeerRow[] {
  const custodians = rows.filter((r) => r.bucketsBitmask !== 0)
  if (maxPeers <= 0 || custodians.length === 0) return []
  if (custodians.length <= maxPeers) {
    return [...custodians].sort((a, b) => comparePexRank(a, b, desiredBucketsMask))
  }
  const indexed = custodians.map((row, i) => ({ row, i }))
  indexed.sort((a, b) => comparePexRank(a.row, b.row, desiredBucketsMask))
  const freshN = Math.min(maxPeers, Math.ceil(maxPeers * 0.75))
  const chosen = new Set<number>()
  const out: EthyKnownPeerRow[] = []
  for (const ent of indexed) {
    if (out.length >= freshN) break
    chosen.add(ent.i)
    out.push(ent.row)
  }
  const pool = indexed.filter((e) => !chosen.has(e.i))
  while (out.length < maxPeers && pool.length > 0) {
    const pick = Math.floor(rng() * pool.length)
    out.push(pool[pick]!.row)
    pool.splice(pick, 1)
  }
  return out
}

export class EthyKnownPeerBook {
  private readonly _rows: EthyKnownPeerRow[] = []

  upsertFromStatus(
    peerId: Uint8Array,
    address: string,
    tcpPort: number,
    udpPort: number,
    status: EthyPeerStatus,
  ): void {
    const now = Math.floor(Date.now() / 1000)
    const idHex = bytesToUnprefixedHex(peerId)
    const existing = this._rows.findIndex((r) => bytesToUnprefixedHex(r.peerId) === idHex)
    const row: EthyKnownPeerRow = {
      peerId,
      address,
      tcpPort,
      udpPort,
      basePivotBlock: status.basePivotBlock,
      bucketsBitmask: status.bucketsBitmask,
      storageBucketsBitmask: status.storageBucketsBitmask,
      codeBucketsBitmask: status.codeBucketsBitmask,
      trieBucketsBitmask: status.trieBucketsBitmask,
      lastSeenSec: now,
    }
    if (existing >= 0) {
      this._rows[existing] = row
      return
    }
    this._rows.push(row)
    while (this._rows.length > MAX_KNOWN) {
      this._rows.shift()
    }
  }

  list(): EthyKnownPeerRow[] {
    return [...this._rows]
  }

  noteDialFromPex(peerId: Uint8Array, address: string, tcpPort: number, udpPort: number): void {
    const idHex = bytesToUnprefixedHex(peerId)
    if (this._rows.some((r) => bytesToUnprefixedHex(r.peerId) === idHex)) return
    this._rows.push({
      peerId,
      address,
      tcpPort,
      udpPort,
      basePivotBlock: 0n,
      bucketsBitmask: 0,
      storageBucketsBitmask: 0,
      codeBucketsBitmask: 0,
      trieBucketsBitmask: 0,
      lastSeenSec: Math.floor(Date.now() / 1000),
    })
    while (this._rows.length > MAX_KNOWN) {
      this._rows.shift()
    }
  }

  equalsId(a: Uint8Array, b: Uint8Array): boolean {
    return equalsBytes(a, b)
  }
}
