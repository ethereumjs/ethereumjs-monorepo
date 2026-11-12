import {
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToInt,
  bytesToUnprefixedHex,
  intToUnpaddedBytes,
} from '@ethereumjs/util'

import { EthyMessageCodes } from '../protocol/ethy/codes.ts'
import type { EthyKnownPeerRow } from '../worker/ethyPex.ts'
import type { EthyChunkStore } from './ethyChunkStore.ts'
import type { RollingBlockStore } from './rollingBlockStore.ts'

export type EthyServedReply = {
  code: EthyMessageCodes
  rlp: unknown[]
  bytesEstimate: number
  metric: 'chunk' | 'bal' | 'pex' | 'none'
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

export function tryServeEthyGet(
  chunks: EthyChunkStore,
  blocks: RollingBlockStore,
  knownPeers: EthyKnownPeerRow[],
  localNodeId: Uint8Array,
  excludePeerId: Uint8Array | undefined,
  msgName: string,
  decoded: unknown,
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
      return {
        code: EthyMessageCodes.PROVEN_STORAGE_OR_CODE,
        rlp: [reqIdB, intToUnpaddedBytes(0), []],
        bytesEstimate: 32,
        metric: 'none',
      }
    }
    return {
      code: EthyMessageCodes.PROVEN_STORAGE_OR_CODE,
      rlp: [
        reqIdB,
        intToUnpaddedBytes(1),
        new Uint8Array(32),
        new Uint8Array(32),
        new Uint8Array(32),
        intToUnpaddedBytes(0),
        [],
        [],
      ],
      bytesEstimate: 64,
      metric: 'none',
    }
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
    const rows: unknown[] = []
    for (const p of knownPeers) {
      const idHex = bytesToUnprefixedHex(p.peerId)
      if (idHex === localHex) continue
      if (excludeHex !== undefined && idHex === excludeHex) continue
      rows.push([
        p.peerId,
        new TextEncoder().encode(p.address),
        intToUnpaddedBytes(p.tcpPort),
        intToUnpaddedBytes(p.udpPort),
        bigIntToUnpaddedBytes(p.basePivotBlock),
        intToUnpaddedBytes(p.bucketsBitmask),
        intToUnpaddedBytes(Math.max(0, now - p.lastSeenSec)),
      ])
      if (rows.length >= maxPeers) break
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
