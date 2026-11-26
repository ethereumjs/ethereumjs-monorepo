import {
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToInt,
  bytesToUnprefixedHex,
  intToUnpaddedBytes,
} from '@ethereumjs/util'

import { EthyMessageCodes } from '../protocol/ethy/codes.ts'
import { type EthyKnownPeerRow, selectEthyPexPeers } from '../worker/ethyPex.ts'
import type { EthyChunkStore } from './ethyChunkStore.ts'
import type { EthyStorageStore } from './ethyStorageStore.ts'
import type { RollingBlockStore } from './rollingBlockStore.ts'
import { SERVE_SOFT_RESPONSE_BYTES } from './serveGovernor.ts'
import type { SharedCodeDisk } from './sharedCodeDisk.ts'

export type EthyServedReply = {
  code: EthyMessageCodes
  rlp: unknown[]
  bytesEstimate: number
  metric: 'chunk' | 'bal' | 'pex' | 'storage' | 'code' | 'none'
}

function reqIdFromPayload(decoded: unknown): bigint {
  if (!Array.isArray(decoded) || decoded.length === 0) return 0n
  const id = decoded[0]
  if (!(id instanceof Uint8Array)) return 0n
  return bytesToBigInt(id)
}

function clampCount(raw: unknown, min: number, max: number): number {
  if (!(raw instanceof Uint8Array) || raw.length === 0) return min
  const n = bytesToInt(raw)
  if (n < min) return min
  if (n > max) return max
  return n
}

function clampBudget(raw: unknown): number {
  if (!(raw instanceof Uint8Array) || raw.length === 0) return SERVE_SOFT_RESPONSE_BYTES
  const n = bytesToInt(raw)
  if (n <= 0) return SERVE_SOFT_RESPONSE_BYTES
  return Math.min(n, SERVE_SOFT_RESPONSE_BYTES)
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
    const rec = chunks.get(bucketIndex, originHash)
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
    const kind = bytesToInt(decoded[1] as Uint8Array)
    if (kind === 0) {
      const hashesRaw = decoded[2]
      const budget = decoded.length > 3 ? clampBudget(decoded[3]) : SERVE_SOFT_RESPONSE_BYTES
      const hashes = Array.isArray(hashesRaw)
        ? hashesRaw.filter((h): h is Uint8Array => h instanceof Uint8Array).slice(0, 64)
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
      if (decoded.length < 6) return undefined
      const accountHash = decoded[2] as Uint8Array
      const storageRoot = decoded[3] as Uint8Array
      const originSlotHash = decoded[4] as Uint8Array
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
        .filter((p): p is unknown[] => Array.isArray(p) && p.length >= 2)
        .map((p) => ({ accountHash: p[0] as Uint8Array, storageRoot: p[1] as Uint8Array }))
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
    const now = Math.floor(Date.now() / 1000)
    const excludeHex = excludePeerId !== undefined ? bytesToUnprefixedHex(excludePeerId) : undefined
    const localHex = bytesToUnprefixedHex(localNodeId)
    const candidates = knownPeers.filter((p) => {
      const idHex = bytesToUnprefixedHex(p.peerId)
      if (idHex === localHex) return false
      if (excludeHex !== undefined && idHex === excludeHex) return false
      return true
    })
    const selected = selectEthyPexPeers(candidates, maxPeers)
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
      ])
    }
    return {
      code: EthyMessageCodes.ETHY_PEERS,
      rlp: [reqIdB, rows],
      bytesEstimate: rows.length * 128,
      metric: 'pex',
    }
  }

  return undefined
}
