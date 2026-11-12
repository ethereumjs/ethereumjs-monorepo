import * as fs from 'node:fs'
import * as path from 'node:path'
import { RLP } from '@ethereumjs/rlp'
import { bytesToUnprefixedHex, equalsBytes } from '@ethereumjs/util'

import {
  type DiskChunkProofRecord,
  journalPathForProofSidecar,
  listProofSidecarsForBucket,
  readProofSidecarRecords,
  readSlabSlice,
} from './ethyProofDisk.ts'

/** One servable self-proving account chunk (spec §6 `0x04`). */
export type EthyAccountChunkRecord = {
  bucketIndex: number
  originHash: Uint8Array
  lastHash: Uint8Array
  hasRight: number
  chunkStateRoot: Uint8Array
  chunkBlockNumber: bigint
  binaryAccountsSlab: Uint8Array
  proofNodes: Uint8Array[]
}

export type EthyChunkManifestEntry = {
  originHash: Uint8Array
  lastHash: Uint8Array
  hasRight: number
  chunkStateRoot: Uint8Array
  chunkBlockNumber: bigint
  accountCount: number
  slabByteLength: number
}

type IndexedDiskChunk = {
  journalPath: string
  rec: DiskChunkProofRecord
  nextJournalPath?: string
  nextSlabByteOffset?: number
  nextSlabByteLength?: number
}

type BucketDiskCache = {
  signature: string
  byOriginHex: Map<string, IndexedDiskChunk>
  ordered: IndexedDiskChunk[]
}

function chunkKey(bucketIndex: number, originHash: Uint8Array): string {
  return `${bucketIndex}:${bytesToUnprefixedHex(originHash)}`
}

function bucketSidecarSignature(accountsDir: string, bucketIndex: number): string {
  const paths = listProofSidecarsForBucket(accountsDir, bucketIndex)
  if (paths.length === 0) return ''
  return paths
    .map((p) => {
      try {
        return `${p}:${fs.statSync(p).size}`
      } catch {
        return `${p}:0`
      }
    })
    .join('|')
}

/**
 * In-worker ETHY/0 account chunk catalog (memory; optional disk sidecar in WP-06c).
 */
export class EthyChunkStore {
  private readonly _byKey = new Map<string, EthyAccountChunkRecord>()
  private _pivotAccountsDir?: string
  private readonly _diskCache = new Map<number, BucketDiskCache>()
  private readonly _journalFds = new Map<string, number>()

  setPivotAccountsDir(dir: string | undefined): void {
    if (this._pivotAccountsDir !== dir) {
      this._pivotAccountsDir = dir
      this._diskCache.clear()
      for (const fd of this._journalFds.values()) {
        try {
          fs.closeSync(fd)
        } catch {
          // ignore
        }
      }
      this._journalFds.clear()
    }
  }

  /** Read a persisted `(headerRlp, balRlp)` bundle from `../heal/<n>.bundle.rlp` on disk. */
  getBalBundleFromDisk(
    blockNumber: bigint,
  ): { headerRlp: Uint8Array; balRlp: Uint8Array } | undefined {
    const accountsDir = this._pivotAccountsDir
    if (accountsDir === undefined) return undefined
    const healFile = path.join(
      path.dirname(accountsDir),
      'heal',
      `${blockNumber.toString()}.bundle.rlp`,
    )
    if (!fs.existsSync(healFile)) return undefined
    try {
      const raw = new Uint8Array(fs.readFileSync(healFile))
      const decoded = RLP.decode(raw)
      if (!Array.isArray(decoded) || decoded.length < 5) return undefined
      const headerRlp = decoded[3]
      const balRlp = decoded[4]
      if (!(headerRlp instanceof Uint8Array) || !(balRlp instanceof Uint8Array)) return undefined
      return { headerRlp, balRlp }
    } catch {
      return undefined
    }
  }

  private readJournalSliceCached(
    journalPath: string,
    byteOffset: number,
    byteLength: number,
  ): Uint8Array {
    let fd = this._journalFds.get(journalPath)
    if (fd === undefined) {
      fd = fs.openSync(journalPath, 'r')
      this._journalFds.set(journalPath, fd)
    }
    const out = Buffer.alloc(byteLength)
    try {
      fs.readSync(fd, out, 0, byteLength, byteOffset)
    } catch {
      this._journalFds.delete(journalPath)
      return readSlabSlice(journalPath, byteOffset, byteLength)
    }
    return new Uint8Array(out)
  }

  put(record: EthyAccountChunkRecord): void {
    const key = chunkKey(record.bucketIndex, record.originHash)
    this._byKey.set(key, record)
  }

  private ensureBucketDiskCache(bucketIndex: number): BucketDiskCache | undefined {
    const accountsDir = this._pivotAccountsDir
    if (accountsDir === undefined || bucketIndex < 0 || bucketIndex > 15) return undefined
    const sig = bucketSidecarSignature(accountsDir, bucketIndex)
    const cached = this._diskCache.get(bucketIndex)
    if (cached !== undefined && cached.signature === sig) {
      return cached
    }
    const ordered: IndexedDiskChunk[] = []
    const byOriginHex = new Map<string, IndexedDiskChunk>()
    for (const proofPath of listProofSidecarsForBucket(accountsDir, bucketIndex)) {
      const journalPath = journalPathForProofSidecar(proofPath)
      for (const rec of readProofSidecarRecords(proofPath)) {
        const item: IndexedDiskChunk = { journalPath, rec }
        ordered.push(item)
        byOriginHex.set(bytesToUnprefixedHex(rec.originHash), item)
      }
    }
    for (let i = 0; i < ordered.length - 1; i++) {
      ordered[i]!.nextJournalPath = ordered[i + 1]!.journalPath
      ordered[i]!.nextSlabByteOffset = ordered[i + 1]!.rec.slabByteOffset
      ordered[i]!.nextSlabByteLength = ordered[i + 1]!.rec.slabByteLength
    }
    const nextCache: BucketDiskCache = { signature: sig, byOriginHex, ordered }
    this._diskCache.set(bucketIndex, nextCache)
    return nextCache
  }

  private firstChunkOfNextBucket(bucketIndex: number): IndexedDiskChunk | undefined {
    if (bucketIndex >= 15) return undefined
    const nextCache = this.ensureBucketDiskCache(bucketIndex + 1)
    return nextCache?.ordered[0]
  }

  private getFromDisk(
    bucketIndex: number,
    originHash: Uint8Array,
  ): EthyAccountChunkRecord | undefined {
    const cache = this.ensureBucketDiskCache(bucketIndex)
    if (cache === undefined) return undefined
    const hit = cache.byOriginHex.get(bytesToUnprefixedHex(originHash))
    if (hit === undefined) return undefined
    const { rec, journalPath } = hit
    let slab = this.readJournalSliceCached(journalPath, rec.slabByteOffset, rec.slabByteLength)
    if (slab.length >= 136) {
      const lastKeyInSlab = slab.subarray(slab.length - 136, slab.length - 104)
      if (!equalsBytes(lastKeyInSlab, rec.lastHash)) {
        const nextSource =
          hit.nextJournalPath !== undefined &&
          hit.nextSlabByteOffset !== undefined &&
          hit.nextSlabByteLength !== undefined
            ? {
                journalPath: hit.nextJournalPath,
                offset: hit.nextSlabByteOffset,
                length: hit.nextSlabByteLength,
              }
            : (() => {
                const nb = this.firstChunkOfNextBucket(bucketIndex)
                return nb !== undefined
                  ? {
                      journalPath: nb.journalPath,
                      offset: nb.rec.slabByteOffset,
                      length: nb.rec.slabByteLength,
                    }
                  : undefined
              })()
        if (nextSource !== undefined && nextSource.length >= 136) {
          const nextSlice = this.readJournalSliceCached(
            nextSource.journalPath,
            nextSource.offset,
            Math.min(nextSource.length, 136 * 16),
          )
          const extraRows: Uint8Array[] = []
          let matched = false
          for (let off = 0; off + 136 <= nextSlice.length; off += 136) {
            const row = nextSlice.subarray(off, off + 136)
            extraRows.push(row)
            if (equalsBytes(row.subarray(0, 32), rec.lastHash)) {
              matched = true
              break
            }
          }
          if (matched && extraRows.length > 0) {
            const combined = new Uint8Array(slab.length + extraRows.length * 136)
            combined.set(slab, 0)
            let outOff = slab.length
            for (const r of extraRows) {
              combined.set(r, outOff)
              outOff += 136
            }
            slab = combined
          }
        }
      }
    }
    return {
      bucketIndex,
      originHash: rec.originHash,
      lastHash: rec.lastHash,
      hasRight: rec.hasRight,
      chunkStateRoot: rec.chunkStateRoot,
      chunkBlockNumber: rec.chunkBlockNumber,
      binaryAccountsSlab: slab,
      proofNodes: rec.proofNodes,
    }
  }

  get(bucketIndex: number, originHash: Uint8Array): EthyAccountChunkRecord | undefined {
    const mem = this._byKey.get(chunkKey(bucketIndex, originHash))
    if (mem !== undefined) return mem
    return this.getFromDisk(bucketIndex, originHash)
  }

  manifestForBucket(bucketIndex: number): EthyChunkManifestEntry[] {
    const prefix = `${bucketIndex}:`
    const out: EthyChunkManifestEntry[] = []
    for (const [key, rec] of this._byKey) {
      if (!key.startsWith(prefix)) continue
      const accountCount =
        rec.binaryAccountsSlab.length === 0 ? 0 : rec.binaryAccountsSlab.length / 136
      out.push({
        originHash: rec.originHash,
        lastHash: rec.lastHash,
        hasRight: rec.hasRight,
        chunkStateRoot: rec.chunkStateRoot,
        chunkBlockNumber: rec.chunkBlockNumber,
        accountCount,
        slabByteLength: rec.binaryAccountsSlab.length,
      })
    }
    const cache = this.ensureBucketDiskCache(bucketIndex)
    if (cache !== undefined) {
      for (const { rec } of cache.ordered) {
        const accountCount = rec.slabByteLength === 0 ? 0 : Math.floor(rec.slabByteLength / 136)
        out.push({
          originHash: rec.originHash,
          lastHash: rec.lastHash,
          hasRight: rec.hasRight,
          chunkStateRoot: rec.chunkStateRoot,
          chunkBlockNumber: rec.chunkBlockNumber,
          accountCount,
          slabByteLength: rec.slabByteLength,
        })
      }
    }
    out.sort((a, b) =>
      bytesToUnprefixedHex(a.originHash).localeCompare(bytesToUnprefixedHex(b.originHash)),
    )
    const seen = new Set<string>()
    return out.filter((row) => {
      const k = bytesToUnprefixedHex(row.originHash)
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
  }
}
