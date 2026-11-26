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

function pexRankScore(row: EthyKnownPeerRow, desiredBucketsMask: number): number {
  let score = Number(row.basePivotBlock) * 1_000_000 + row.lastSeenSec
  if (desiredBucketsMask !== 0) {
    const overlap = row.bucketsBitmask & desiredBucketsMask
    if (overlap !== 0) score += 500_000
    const trieOverlap = row.trieBucketsBitmask & desiredBucketsMask
    if (trieOverlap !== 0) score += 200_000
    const planes =
      countSetBits(row.bucketsBitmask & desiredBucketsMask) +
      countSetBits(row.storageBucketsBitmask & desiredBucketsMask) +
      countSetBits(row.codeBucketsBitmask & desiredBucketsMask)
    score += planes * 10_000
  } else {
    score += countSetBits(row.bucketsBitmask) * 1_000
    score += countSetBits(row.trieBucketsBitmask) * 500
  }
  return score
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
    return [...custodians].sort(
      (a, b) => pexRankScore(b, desiredBucketsMask) - pexRankScore(a, desiredBucketsMask),
    )
  }
  const indexed = custodians.map((r, i) => ({
    row: r,
    i,
    score: pexRankScore(r, desiredBucketsMask),
  }))
  indexed.sort((a, b) => b.score - a.score)
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
