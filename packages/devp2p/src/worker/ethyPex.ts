import { bytesToUnprefixedHex, equalsBytes } from '@ethereumjs/util'

import type { EthyPeerStatus } from '../protocol/ethy/codec.ts'

export type EthyKnownPeerRow = {
  peerId: Uint8Array
  address: string
  tcpPort: number
  udpPort: number
  basePivotBlock: bigint
  bucketsBitmask: number
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
 * 75% freshest ETHY/0 seeders by pivot, bitmask, and recency; 25% random remainder (WP-11b).
 */
function pexRowScore(row: EthyKnownPeerRow): number {
  return (
    Number(row.basePivotBlock) * 1_000_000 +
    countSetBits(row.bucketsBitmask) * 1_000 +
    row.lastSeenSec
  )
}

export function selectEthyPexPeers(
  rows: readonly EthyKnownPeerRow[],
  maxPeers: number,
  rng: () => number = Math.random,
): EthyKnownPeerRow[] {
  if (maxPeers <= 0 || rows.length === 0) return []
  if (rows.length <= maxPeers) {
    return [...rows].sort((a, b) => pexRowScore(b) - pexRowScore(a))
  }
  const indexed = rows.map((r, i) => ({
    row: r,
    i,
    score: pexRowScore(r),
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
