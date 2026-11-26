import {
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToInt,
  bytesToUnprefixedHex,
  intToUnpaddedBytes,
} from '@ethereumjs/util'

import { StatyMessageCodes } from '../protocol/staty/codes.ts'
import { type StatyKnownPeerRow, selectStatyPexPeers } from '../worker/statyPex.ts'
import { SERVE_SOFT_RESPONSE_BYTES } from './serveGovernor.ts'
import type { SharedCodeDisk } from './sharedCodeDisk.ts'
import type { StatyStore, StatyWitnessQuery } from './statyStore.ts'

export type StatyServedReply = {
  code: StatyMessageCodes
  rlp: unknown[]
  bytesEstimate: number
  metric: 'part' | 'witness' | 'code' | 'pex' | 'none'
}

const ZERO32 = new Uint8Array(32)

function reqIdFromPayload(decoded: unknown): bigint {
  if (!Array.isArray(decoded) || decoded.length === 0) return 0n
  const id = decoded[0]
  if (!(id instanceof Uint8Array)) return 0n
  return bytesToBigInt(id)
}

function safeBigInt(raw: unknown): bigint | undefined {
  if (!(raw instanceof Uint8Array)) return undefined
  if (raw.length === 0) return 0n
  return bytesToBigInt(raw)
}

function safeInt(raw: unknown): number | undefined {
  if (!(raw instanceof Uint8Array)) return undefined
  if (raw.length === 0) return 0
  if (raw.length > 6) {
    const big = bytesToBigInt(raw)
    return big > BigInt(Number.MAX_SAFE_INTEGER) ? Number.MAX_SAFE_INTEGER : Number(big)
  }
  return bytesToInt(raw)
}

function clampCount(raw: unknown, min: number, max: number): number {
  const n = safeInt(raw)
  if (n === undefined) return min
  if (n < min) return min
  if (n > max) return max
  return n
}

function clampBudget(raw: unknown): number {
  const n = safeInt(raw)
  if (n === undefined || n <= 0) return SERVE_SOFT_RESPONSE_BYTES
  return Math.min(n, SERVE_SOFT_RESPONSE_BYTES)
}

export function tryServeStatyGet(
  store: StatyStore,
  codeDisk: SharedCodeDisk,
  knownPeers: StatyKnownPeerRow[],
  localNodeId: Uint8Array,
  excludePeerId: Uint8Array | undefined,
  msgName: string,
  decoded: unknown,
): StatyServedReply | undefined {
  const reqId = reqIdFromPayload(decoded)
  const reqIdB = bigIntToUnpaddedBytes(reqId)

  if (msgName === 'GET_EPOCH_MANIFEST') {
    if (!Array.isArray(decoded) || decoded.length < 2) return undefined
    const epochNumber = safeBigInt(decoded[1])
    if (epochNumber === undefined) return undefined
    const manifest = store.manifestForEpoch(epochNumber)
    if (manifest === undefined) {
      return {
        code: StatyMessageCodes.EPOCH_MANIFEST,
        rlp: [
          reqIdB,
          bigIntToUnpaddedBytes(epochNumber),
          bigIntToUnpaddedBytes(0n),
          ZERO32,
          bigIntToUnpaddedBytes(0n),
          [],
        ],
        bytesEstimate: 64,
        metric: 'none',
      }
    }
    const shards = manifest.shards.map((s) => [
      intToUnpaddedBytes(s.shardIndex),
      intToUnpaddedBytes(s.partCount),
      intToUnpaddedBytes(s.accountCount),
      intToUnpaddedBytes(s.slotCount),
      intToUnpaddedBytes(s.totalBytes),
    ])
    return {
      code: StatyMessageCodes.EPOCH_MANIFEST,
      rlp: [
        reqIdB,
        bigIntToUnpaddedBytes(manifest.epochNumber),
        bigIntToUnpaddedBytes(manifest.anchorBlock),
        manifest.anchorStateRoot,
        bigIntToUnpaddedBytes(manifest.dedupBaseEpoch),
        shards,
      ],
      bytesEstimate: 256,
      metric: 'none',
    }
  }

  if (msgName === 'GET_EPOCH_PART') {
    if (!Array.isArray(decoded) || decoded.length < 4) return undefined
    const epochNumber = safeBigInt(decoded[1])
    const shardIndex = safeInt(decoded[2])
    const partIndex = safeInt(decoded[3])
    if (epochNumber === undefined || shardIndex === undefined || partIndex === undefined) {
      return undefined
    }
    const part = store.partFor(epochNumber, shardIndex, partIndex)
    if (part === undefined) {
      return {
        code: StatyMessageCodes.EPOCH_PART,
        rlp: [
          reqIdB,
          bigIntToUnpaddedBytes(epochNumber),
          intToUnpaddedBytes(shardIndex),
          intToUnpaddedBytes(partIndex),
          bigIntToUnpaddedBytes(0n),
          ZERO32,
          [],
          [],
          [],
        ],
        bytesEstimate: 64,
        metric: 'none',
      }
    }
    const accounts = part.accounts.map((a) => [a.accountHash, a.accountRlpOrEmpty])
    const slots = part.slots.map((s) => [s.accountHash, s.slotHash, s.slotValOrEmpty])
    const bytes = part.proofNodes.reduce((n, p) => n + p.length, accounts.length * 96)
    return {
      code: StatyMessageCodes.EPOCH_PART,
      rlp: [
        reqIdB,
        bigIntToUnpaddedBytes(part.epochNumber),
        intToUnpaddedBytes(part.shardIndex),
        intToUnpaddedBytes(part.partIndex),
        bigIntToUnpaddedBytes(part.anchorBlock),
        part.anchorStateRoot,
        accounts,
        slots,
        part.proofNodes,
      ],
      bytesEstimate: bytes,
      metric: 'part',
    }
  }

  if (msgName === 'GET_WITNESSES') {
    if (!Array.isArray(decoded) || decoded.length < 4) return undefined
    const minAnchor = safeBigInt(decoded[1])
    if (minAnchor === undefined) return undefined
    const budget = clampBudget(decoded[2])
    const rawQueries = decoded[3]
    if (!Array.isArray(rawQueries)) return undefined
    const queries: StatyWitnessQuery[] = []
    for (const q of rawQueries.slice(0, 64)) {
      if (!Array.isArray(q) || q.length < 2) continue
      if (!(q[0] instanceof Uint8Array) || q[0].length !== 32) continue
      const accountHash = q[0]
      const slotHashes = Array.isArray(q[1])
        ? q[1].filter((h): h is Uint8Array => h instanceof Uint8Array && h.length === 32)
        : []
      queries.push({ accountHash, slotHashes })
    }
    const groups = store.resolveWitnesses(minAnchor, budget, queries)
    let actualBytes = 0
    const wireGroups = groups.map((g) => {
      actualBytes += 40
      for (const a of g.accounts) actualBytes += 32 + a.accountRlpOrEmpty.length
      for (const s of g.slots) actualBytes += 64 + s.slotValOrEmpty.length
      for (const p of g.proofNodes) actualBytes += p.length
      return [
        bigIntToUnpaddedBytes(g.anchorBlock),
        g.anchorStateRoot,
        g.accounts.map((a) => [a.accountHash, a.accountRlpOrEmpty]),
        g.slots.map((s) => [s.accountHash, s.slotHash, s.slotValOrEmpty]),
        g.proofNodes,
      ]
    })
    const bytes = wireGroups.length > 0 ? actualBytes : 32
    return {
      code: StatyMessageCodes.WITNESSES,
      rlp: [reqIdB, wireGroups],
      bytesEstimate: bytes,
      metric: wireGroups.length > 0 ? 'witness' : 'none',
    }
  }

  if (msgName === 'GET_BYTECODES') {
    if (!Array.isArray(decoded) || decoded.length < 3) return undefined
    const hashesRaw = decoded[1]
    const budget = clampBudget(decoded[2])
    if (!Array.isArray(hashesRaw)) return undefined
    const hashes = hashesRaw
      .filter((h): h is Uint8Array => h instanceof Uint8Array && h.length === 32)
      .slice(0, 64)
    const { codes, bytes } = codeDisk.getMany(hashes, budget)
    return {
      code: StatyMessageCodes.BYTECODES,
      rlp: [reqIdB, codes],
      bytesEstimate: bytes,
      metric: codes.length > 0 ? 'code' : 'none',
    }
  }

  if (msgName === 'GET_STATY_PEERS') {
    const req = decoded as unknown[]
    const maxPeers = clampCount(req[1], 1, 32)
    const now = Math.floor(Date.now() / 1000)
    const excludeHex = excludePeerId !== undefined ? bytesToUnprefixedHex(excludePeerId) : undefined
    const localHex = bytesToUnprefixedHex(localNodeId)
    const candidates = knownPeers.filter((p) => {
      const idHex = bytesToUnprefixedHex(p.peerId)
      if (idHex === localHex) return false
      if (excludeHex !== undefined && idHex === excludeHex) return false
      return true
    })
    const selected = selectStatyPexPeers(candidates, maxPeers)
    const rows: unknown[] = []
    for (const p of selected) {
      rows.push([
        p.peerId,
        new TextEncoder().encode(p.address),
        intToUnpaddedBytes(p.tcpPort),
        intToUnpaddedBytes(p.udpPort),
        bigIntToUnpaddedBytes(p.latestEpoch),
        bigIntToUnpaddedBytes(p.epochMask),
        intToUnpaddedBytes(p.witnessCountHint),
        intToUnpaddedBytes(Math.max(0, now - p.lastSeenSec)),
      ])
    }
    return {
      code: StatyMessageCodes.STATY_PEERS,
      rlp: [reqIdB, rows],
      bytesEstimate: rows.length * 128,
      metric: 'pex',
    }
  }

  return undefined
}
