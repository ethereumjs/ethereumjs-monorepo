import { bytesToUnprefixedHex, equalsBytes } from '@ethereumjs/util'

import type { StatyPeerStatus } from '../protocol/staty/codec.ts'

export type StatyKnownPeerRow = {
  peerId: Uint8Array
  address: string
  tcpPort: number
  udpPort: number
  latestEpoch: bigint
  epochMask: bigint
  witnessCountHint: number
  lastSeenSec: number
}

const MAX_KNOWN = 64

function countBits64(mask: bigint): number {
  let n = mask
  let c = 0
  while (n > 0n) {
    if ((n & 1n) === 1n) c++
    n >>= 1n
  }
  return c
}

function pexRowScore(row: StatyKnownPeerRow): number {
  return (
    Number(row.latestEpoch) * 1_000_000 +
    countBits64(row.epochMask) * 1_000 +
    row.witnessCountHint +
    row.lastSeenSec
  )
}

export function selectStatyPexPeers(
  rows: readonly StatyKnownPeerRow[],
  maxPeers: number,
  rng: () => number = Math.random,
): StatyKnownPeerRow[] {
  const capped = Math.max(1, Math.min(32, maxPeers))
  if (capped <= 0 || rows.length === 0) return []
  if (rows.length <= capped) {
    return [...rows].sort((a, b) => pexRowScore(b) - pexRowScore(a))
  }
  const indexed = rows.map((r, i) => ({ row: r, i, score: pexRowScore(r) }))
  indexed.sort((a, b) => b.score - a.score)
  const freshN = Math.min(capped, Math.ceil(capped * 0.75))
  const chosen = new Set<number>()
  const out: StatyKnownPeerRow[] = []
  for (const ent of indexed) {
    if (out.length >= freshN) break
    chosen.add(ent.i)
    out.push(ent.row)
  }
  const pool = indexed.filter((e) => !chosen.has(e.i))
  while (out.length < capped && pool.length > 0) {
    const pick = Math.floor(rng() * pool.length)
    out.push(pool[pick]!.row)
    pool.splice(pick, 1)
  }
  return out
}

export class StatyKnownPeerBook {
  private readonly _rows: StatyKnownPeerRow[] = []

  upsertFromStatus(
    peerId: Uint8Array,
    address: string,
    tcpPort: number,
    udpPort: number,
    status: StatyPeerStatus,
  ): void {
    const now = Math.floor(Date.now() / 1000)
    const idHex = bytesToUnprefixedHex(peerId)
    const existing = this._rows.findIndex((r) => bytesToUnprefixedHex(r.peerId) === idHex)
    const row: StatyKnownPeerRow = {
      peerId,
      address,
      tcpPort,
      udpPort,
      latestEpoch: status.latestEpoch,
      epochMask: status.epochMask,
      witnessCountHint: status.witnessCountHint,
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

  list(): StatyKnownPeerRow[] {
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
      latestEpoch: 0n,
      epochMask: 0n,
      witnessCountHint: 0,
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
