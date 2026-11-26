import {
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToInt,
  bytesToUnprefixedHex,
  intToUnpaddedBytes,
} from '@ethereumjs/util'

import { MAX_ETHY_RESPONSE_BYTES } from '../protocol/ethy/codec.ts'
import { EthyMessageCodes } from '../protocol/ethy/codes.ts'
import { type EthyKnownPeerRow, selectEthyPexPeers } from '../worker/ethyPex.ts'
import type { EthyChunkStore } from './ethyChunkStore.ts'
import type { EthyStorageStore } from './ethyStorageStore.ts'
import type { EthySubtreeRootBook } from './ethySubtreeRootBook.ts'
import type { EthyWitnessQuery, EthyWitnessStore } from './ethyWitnessStore.ts'
import type { RollingBlockStore } from './rollingBlockStore.ts'
import { SERVE_SOFT_RESPONSE_BYTES } from './serveGovernor.ts'
import type { SharedCodeDisk } from './sharedCodeDisk.ts'

export type EthyServedReply = {
  code: EthyMessageCodes
  rlp: unknown[]
  bytesEstimate: number
  metric: 'chunk' | 'bal' | 'pex' | 'storage' | 'code' | 'witness' | 'none'
}

export type EthyWitnessServeThrottle = {
  windowStartMs: number
  count: number
}

const NON_CUSTODIAN_WITNESS_LIMIT = 2
const NON_CUSTODIAN_WITNESS_WINDOW_MS = 10_000

function allowWitnessServe(
  remoteBucketsBitmask: number,
  throttle: EthyWitnessServeThrottle,
): boolean {
  if (remoteBucketsBitmask !== 0) return true
  const now = Date.now()
  if (now - throttle.windowStartMs > NON_CUSTODIAN_WITNESS_WINDOW_MS) {
    throttle.windowStartMs = now
    throttle.count = 0
  }
  if (throttle.count >= NON_CUSTODIAN_WITNESS_LIMIT) return false
  throttle.count++
  return true
}

function safeBigInt(raw: unknown): bigint | undefined {
  if (!(raw instanceof Uint8Array)) return undefined
  if (raw.length === 0) return 0n
  return bytesToBigInt(raw)
}

function reqIdFromPayload(decoded: unknown): bigint {
  if (!Array.isArray(decoded) || decoded.length === 0) return 0n
  const id = decoded[0]
  if (!(id instanceof Uint8Array)) return 0n
  return bytesToBigInt(id)
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

export type TryServeEthyGetOptions = {
  witnessStore: EthyWitnessStore
  subtreeBook: EthySubtreeRootBook
  remoteBucketsBitmask: number
  witnessThrottle: EthyWitnessServeThrottle
}

export function tryServeEthyGet(
  chunks: EthyChunkStore,
  blocks: RollingBlockStore,
  knownPeers: EthyKnownPeerRow[],
  localNodeId: Uint8Array,
  excludePeerId: Uint8Array | undefined,
  msgName: string,
  decoded: unknown,
  codeDisk: SharedCodeDisk,
  storageStore: EthyStorageStore,
  opts: TryServeEthyGetOptions,
): EthyServedReply | undefined {
  const reqId = reqIdFromPayload(decoded)
  const reqIdB = bigIntToUnpaddedBytes(reqId)

  if (msgName === 'GET_BUCKET_MANIFEST') {
    if (!Array.isArray(decoded) || decoded.length < 2) return undefined
    const bucketIndex = bytesToInt(decoded[1] as Uint8Array)
    const manifest = chunks.manifestForBucket(bucketIndex)
    const entries = manifest.map((e) => [
      e.originHash,
      e.lastHash,
      intToUnpaddedBytes(e.hasRight),
      e.chunkStateRoot,
      bigIntToUnpaddedBytes(e.chunkBlockNumber),
      intToUnpaddedBytes(e.accountCount),
      intToUnpaddedBytes(e.slabByteLength),
    ])
    const rlp = [reqIdB, intToUnpaddedBytes(bucketIndex), entries]
    return { code: EthyMessageCodes.BUCKET_MANIFEST, rlp, bytesEstimate: 256, metric: 'none' }
  }

  if (msgName === 'GET_PROVEN_ACCOUNT_CHUNK') {
    if (!Array.isArray(decoded) || decoded.length < 3) return undefined
    const bucketIndex = bytesToInt(decoded[1] as Uint8Array)
    const originHash = decoded[2] as Uint8Array
    const rec = chunks.getAccountChunk(bucketIndex, originHash)
    if (rec === undefined) {
      return {
        code: EthyMessageCodes.PROVEN_ACCOUNT_CHUNK,
        rlp: [
          reqIdB,
          intToUnpaddedBytes(bucketIndex),
          originHash,
          new Uint8Array(32),
          intToUnpaddedBytes(0),
          new Uint8Array(32),
          bigIntToUnpaddedBytes(0n),
          new Uint8Array(0),
          [],
        ],
        bytesEstimate: 64,
        metric: 'none',
      }
    }
    const rlp = [
      reqIdB,
      intToUnpaddedBytes(rec.bucketIndex),
      rec.originHash,
      rec.lastHash,
      intToUnpaddedBytes(rec.hasRight),
      rec.chunkStateRoot,
      bigIntToUnpaddedBytes(rec.chunkBlockNumber),
      rec.binaryAccountsSlab,
      rec.proofNodes,
    ]
    return {
      code: EthyMessageCodes.PROVEN_ACCOUNT_CHUNK,
      rlp,
      bytesEstimate: rec.binaryAccountsSlab.length + 512,
      metric: 'chunk',
    }
  }

  if (msgName === 'GET_PROVEN_STORAGE_OR_CODE') {
    if (!Array.isArray(decoded) || decoded.length < 2) return undefined
    const kind = safeInt(decoded[1])
    if (kind === undefined) return undefined
    if (kind === 0) {
      const hashesRaw = decoded[2]
      const budget = decoded.length > 3 ? clampBudget(decoded[3]) : SERVE_SOFT_RESPONSE_BYTES
      const hashes = Array.isArray(hashesRaw)
        ? hashesRaw
            .filter((h): h is Uint8Array => h instanceof Uint8Array && h.length === 32)
            .slice(0, 64)
        : []
      const { codes, bytes } = codeDisk.getMany(hashes, budget)
      return {
        code: EthyMessageCodes.PROVEN_STORAGE_OR_CODE,
        rlp: [reqIdB, intToUnpaddedBytes(0), codes],
        bytesEstimate: bytes,
        metric: codes.length > 0 ? 'code' : 'none',
      }
    }
    if (kind === 1) {
      if (decoded.length < 5) return undefined
      const accountHash = decoded[2]
      const storageRoot = decoded[3]
      const originSlotHash = decoded[4]
      if (
        !(accountHash instanceof Uint8Array) ||
        accountHash.length !== 32 ||
        !(storageRoot instanceof Uint8Array) ||
        storageRoot.length !== 32 ||
        !(originSlotHash instanceof Uint8Array) ||
        originSlotHash.length !== 32
      ) {
        return undefined
      }
      const budget = decoded.length > 5 ? clampBudget(decoded[5]) : SERVE_SOFT_RESPONSE_BYTES
      const slice = storageStore.sliceKind1(accountHash, storageRoot, originSlotHash, budget)
      if (slice === undefined) {
        return {
          code: EthyMessageCodes.PROVEN_STORAGE_OR_CODE,
          rlp: [
            reqIdB,
            intToUnpaddedBytes(1),
            accountHash,
            storageRoot,
            bigIntToUnpaddedBytes(0n),
            originSlotHash,
            new Uint8Array(32),
            intToUnpaddedBytes(0),
            new Uint8Array(0),
            [],
          ],
          bytesEstimate: 64,
          metric: 'none',
        }
      }
      return {
        code: EthyMessageCodes.PROVEN_STORAGE_OR_CODE,
        rlp: [
          reqIdB,
          intToUnpaddedBytes(1),
          accountHash,
          slice.storageRoot,
          bigIntToUnpaddedBytes(slice.chunkBlockNumber),
          slice.originSlotHash,
          slice.lastSlotHash,
          intToUnpaddedBytes(slice.hasRight),
          slice.slotsSlab64B,
          slice.proofNodes,
        ],
        bytesEstimate: slice.slotsSlab64B.length + 128,
        metric: 'storage',
      }
    }
    if (kind === 2) {
      if (decoded.length < 3) return undefined
      const budget = decoded.length > 3 ? clampBudget(decoded[3]) : SERVE_SOFT_RESPONSE_BYTES
      const pairsRaw = decoded[2]
      if (!Array.isArray(pairsRaw)) return undefined
      const pairs = pairsRaw
        .filter(
          (p): p is [Uint8Array, Uint8Array] =>
            Array.isArray(p) &&
            p.length >= 2 &&
            p[0] instanceof Uint8Array &&
            p[0].length === 32 &&
            p[1] instanceof Uint8Array &&
            p[1].length === 32,
        )
        .map((p) => ({ accountHash: p[0], storageRoot: p[1] }))
      const entries = storageStore
        .entriesKind2(pairs, budget)
        .map((e) => [e.accountHash, e.storageRoot, e.slotsSlab64B])
      const bytes = entries.reduce((n, e) => n + (e[2] as Uint8Array).length, 0)
      return {
        code: EthyMessageCodes.PROVEN_STORAGE_OR_CODE,
        rlp: [reqIdB, intToUnpaddedBytes(2), entries],
        bytesEstimate: bytes,
        metric: entries.length > 0 ? 'storage' : 'none',
      }
    }
    return undefined
  }

  if (msgName === 'GET_BAL_RANGE') {
    if (!Array.isArray(decoded) || decoded.length < 3) return undefined
    const start = bytesToBigInt(decoded[1] as Uint8Array)
    const count = clampCount(decoded[2], 1, 32)
    const tuples: unknown[] = []
    let bytes = 0
    for (let i = 0; i < count; i++) {
      const n = start + BigInt(i)
      const b = blocks.getByNumber(n)
      if (b !== undefined) {
        const bal = b.balRlp ?? new Uint8Array(0)
        tuples.push([bigIntToUnpaddedBytes(n), b.headerRlp, bal])
        bytes += b.headerRlp.length + bal.length
        continue
      }
      const diskBundle = chunks.getBalBundleFromDisk(n)
      if (diskBundle === undefined) break
      tuples.push([bigIntToUnpaddedBytes(n), diskBundle.headerRlp, diskBundle.balRlp])
      bytes += diskBundle.headerRlp.length + diskBundle.balRlp.length
    }
    return {
      code: EthyMessageCodes.BAL_RANGE,
      rlp: [reqIdB, tuples],
      bytesEstimate: bytes,
      metric: tuples.length > 0 ? 'bal' : 'none',
    }
  }

  if (msgName === 'GET_ETHY_PEERS') {
    const req = decoded as unknown[]
    const maxPeers = clampCount(req[1], 1, 32)
    const desiredBucketsMask = req.length > 2 ? (safeInt(req[2]) ?? 0) : 0
    const now = Math.floor(Date.now() / 1000)
    const excludeHex = excludePeerId !== undefined ? bytesToUnprefixedHex(excludePeerId) : undefined
    const localHex = bytesToUnprefixedHex(localNodeId)
    const candidates = knownPeers.filter((p) => {
      const idHex = bytesToUnprefixedHex(p.peerId)
      if (idHex === localHex) return false
      if (excludeHex !== undefined && idHex === excludeHex) return false
      return true
    })
    const selected = selectEthyPexPeers(candidates, maxPeers, desiredBucketsMask)
    const rows: unknown[] = []
    for (const p of selected) {
      rows.push([
        p.peerId,
        new TextEncoder().encode(p.address),
        intToUnpaddedBytes(p.tcpPort),
        intToUnpaddedBytes(p.udpPort),
        bigIntToUnpaddedBytes(p.basePivotBlock),
        intToUnpaddedBytes(p.bucketsBitmask),
        intToUnpaddedBytes(Math.max(0, now - p.lastSeenSec)),
        intToUnpaddedBytes(p.trieBucketsBitmask),
      ])
    }
    return {
      code: EthyMessageCodes.ETHY_PEERS,
      rlp: [reqIdB, rows],
      bytesEstimate: rows.length * 128,
      metric: 'pex',
    }
  }

  if (msgName === 'GET_STATE_WITNESS') {
    if (!Array.isArray(decoded) || decoded.length < 4) return undefined
    if (!allowWitnessServe(opts.remoteBucketsBitmask, opts.witnessThrottle)) {
      return {
        code: EthyMessageCodes.STATE_WITNESS,
        rlp: [reqIdB, []],
        bytesEstimate: 32,
        metric: 'none',
      }
    }
    const minAnchor = safeBigInt(decoded[1])
    if (minAnchor === undefined) return undefined
    const budget = Math.min(clampBudget(decoded[2]), MAX_ETHY_RESPONSE_BYTES)
    const rawQueries = decoded[3]
    if (!Array.isArray(rawQueries)) return undefined
    const queries: EthyWitnessQuery[] = []
    for (const q of rawQueries.slice(0, 64)) {
      if (!Array.isArray(q) || q.length < 2) continue
      if (!(q[0] instanceof Uint8Array) || q[0].length !== 32) continue
      const slotHashes = Array.isArray(q[1])
        ? q[1].filter((h): h is Uint8Array => h instanceof Uint8Array && h.length === 32)
        : []
      queries.push({ accountHash: q[0], slotHashes })
    }
    const groups = opts.witnessStore.resolveWitnesses(minAnchor, budget, queries)
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
    return {
      code: EthyMessageCodes.STATE_WITNESS,
      rlp: [reqIdB, wireGroups],
      bytesEstimate: wireGroups.length > 0 ? actualBytes : 32,
      metric: wireGroups.length > 0 ? 'witness' : 'none',
    }
  }

  if (msgName === 'GET_SUBTREE_ROOTS') {
    if (!Array.isArray(decoded) || decoded.length < 3) return undefined
    const anchorBlock = safeBigInt(decoded[1])
    if (anchorBlock === undefined) return undefined
    const mask = safeInt(decoded[2]) ?? 0
    const entries = opts.subtreeBook.lookup(anchorBlock, mask)
    const wire = entries.map((e) => [
      intToUnpaddedBytes(e.bucketIndex),
      e.subtreeRootHash.length === 32 ? e.subtreeRootHash : new Uint8Array(0),
    ])
    return {
      code: EthyMessageCodes.SUBTREE_ROOTS,
      rlp: [reqIdB, bigIntToUnpaddedBytes(anchorBlock), wire],
      bytesEstimate: wire.length * 40,
      metric: 'none',
    }
  }

  return undefined
}
