import * as fs from 'node:fs'
import * as path from 'node:path'

import { RLP } from '@ethereumjs/rlp'
import {
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToUnprefixedHex,
  equalsBytes,
  intToUnpaddedBytes,
} from '@ethereumjs/util'

export type EthyStorageEntry = {
  accountHash: Uint8Array
  storageRoot: Uint8Array
  chunkBlockNumber: bigint
  slotsSlab64B: Uint8Array
  complete: boolean
  proofNodes: Uint8Array[]
}

export type EthyStorageDiskChunk = {
  originSlotHash: Uint8Array
  lastSlotHash: Uint8Array
  hasRight: number
  slotsSlab64B: Uint8Array
  proofNodes: Uint8Array[]
}

type DiskStorageRecord = {
  accountHash: Uint8Array
  storageRoot: Uint8Array
  chunkBlockNumber: bigint
  complete: boolean
  chunks: EthyStorageDiskChunk[]
}

type CachedDiskRecord = {
  mtimeMs: number
  size: number
  record: DiskStorageRecord
}

const DISK_RECORD_VERSION = 1
const MAX_DISK_CACHE = 128
const MAX_READ_INFLIGHT = 8

const slotHashAt = (slab: Uint8Array, index: number): Uint8Array => {
  const off = index * 64
  return slab.subarray(off, off + 32)
}

const compareHash = (a: Uint8Array, b: Uint8Array): number => {
  for (let i = 0; i < 32; i++) {
    if (a[i]! < b[i]!) return -1
    if (a[i]! > b[i]!) return 1
  }
  return 0
}

function uint8ToNum(field: unknown): number {
  if (!(field instanceof Uint8Array) || field.length === 0) return 0
  return Number(bytesToBigInt(field))
}

function diskFilePath(storageDir: string, accountHash: Uint8Array): string {
  const hex = bytesToUnprefixedHex(accountHash)
  return path.join(storageDir, hex.slice(0, 2), `${hex}.rlp`)
}

function encodeDiskRecord(rec: DiskStorageRecord): Uint8Array {
  return RLP.encode([
    intToUnpaddedBytes(DISK_RECORD_VERSION),
    rec.accountHash,
    rec.storageRoot,
    bigIntToUnpaddedBytes(rec.chunkBlockNumber),
    intToUnpaddedBytes(rec.complete ? 1 : 0),
    rec.chunks.map((c) => [
      c.originSlotHash,
      c.lastSlotHash,
      intToUnpaddedBytes(c.hasRight !== 0 ? 1 : 0),
      c.slotsSlab64B,
      c.proofNodes,
    ]),
  ] as never)
}

function decodeDiskRecord(raw: Uint8Array): DiskStorageRecord | undefined {
  let decoded: unknown
  try {
    decoded = RLP.decode(raw)
  } catch {
    return undefined
  }
  if (!Array.isArray(decoded) || decoded.length < 6) return undefined
  if (uint8ToNum(decoded[0]) !== DISK_RECORD_VERSION) return undefined
  const accountHash = decoded[1]
  const storageRoot = decoded[2]
  const chunkBlockRaw = decoded[3]
  const complete = uint8ToNum(decoded[4]) !== 0
  const chunksRaw = decoded[5]
  if (
    !(accountHash instanceof Uint8Array) ||
    accountHash.length !== 32 ||
    !(storageRoot instanceof Uint8Array) ||
    storageRoot.length !== 32 ||
    !(chunkBlockRaw instanceof Uint8Array) ||
    !Array.isArray(chunksRaw)
  ) {
    return undefined
  }
  const chunkBlockNumber = chunkBlockRaw.length === 0 ? 0n : bytesToBigInt(chunkBlockRaw)
  const chunks: EthyStorageDiskChunk[] = []
  for (const row of chunksRaw) {
    if (!Array.isArray(row) || row.length < 5) continue
    const originSlotHash = row[0]
    const lastSlotHash = row[1]
    const hasRight = uint8ToNum(row[2]) !== 0 ? 1 : 0
    const slotsSlab64B = row[3]
    const proofNodesRaw = row[4]
    if (
      !(originSlotHash instanceof Uint8Array) ||
      originSlotHash.length !== 32 ||
      !(lastSlotHash instanceof Uint8Array) ||
      lastSlotHash.length !== 32 ||
      !(slotsSlab64B instanceof Uint8Array) ||
      slotsSlab64B.length % 64 !== 0 ||
      !Array.isArray(proofNodesRaw)
    ) {
      continue
    }
    const proofNodes: Uint8Array[] = []
    for (const p of proofNodesRaw) {
      if (p instanceof Uint8Array) proofNodes.push(p)
    }
    chunks.push({ originSlotHash, lastSlotHash, hasRight, slotsSlab64B, proofNodes })
  }
  if (chunks.length === 0) return undefined
  chunks.sort((a, b) => compareHash(a.originSlotHash, b.originSlotHash))
  return { accountHash, storageRoot, chunkBlockNumber, complete, chunks }
}

function writeAtomic(filePath: string, data: Uint8Array): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  const tmp = `${filePath}.${process.pid}.${Date.now()}.tmp`
  fs.writeFileSync(tmp, data)
  fs.renameSync(tmp, filePath)
}

export class EthyStorageStore {
  private readonly _entries = new Map<string, EthyStorageEntry>()
  private readonly _diskCache = new Map<string, CachedDiskRecord>()
  private readonly _diskOrder: string[] = []
  private _storageDir: string | undefined
  private _readInflight = 0

  /** Persist a verified complete small-contract storage slab (`kind = 2` / whole-trie `kind = 1`). */
  static writeDiskComplete(
    storageDir: string,
    opts: {
      accountHash: Uint8Array
      storageRoot: Uint8Array
      chunkBlockNumber: bigint
      slotsSlab64B: Uint8Array
    },
  ): void {
    if (opts.accountHash.length !== 32 || opts.storageRoot.length !== 32) return
    if (opts.slotsSlab64B.length === 0 || opts.slotsSlab64B.length % 64 !== 0) return
    const rowCount = Math.floor(opts.slotsSlab64B.length / 64)
    const originSlotHash = new Uint8Array(slotHashAt(opts.slotsSlab64B, 0))
    const lastSlotHash = new Uint8Array(slotHashAt(opts.slotsSlab64B, rowCount - 1))
    const rec: DiskStorageRecord = {
      accountHash: opts.accountHash,
      storageRoot: opts.storageRoot,
      chunkBlockNumber: opts.chunkBlockNumber,
      complete: true,
      chunks: [
        {
          originSlotHash,
          lastSlotHash,
          hasRight: 0,
          slotsSlab64B: opts.slotsSlab64B,
          proofNodes: [],
        },
      ],
    }
    writeAtomic(diskFilePath(storageDir, opts.accountHash), encodeDiskRecord(rec))
  }

  /** Persist or merge a verified `kind = 1` proven storage chunk + boundary proofs onto disk. */
  static writeDiskChunk(
    storageDir: string,
    opts: {
      accountHash: Uint8Array
      storageRoot: Uint8Array
      chunkBlockNumber: bigint
      originSlotHash: Uint8Array
      lastSlotHash: Uint8Array
      hasRight: number
      slotsSlab64B: Uint8Array
      proofNodes: Uint8Array[]
    },
  ): void {
    if (
      opts.accountHash.length !== 32 ||
      opts.storageRoot.length !== 32 ||
      opts.originSlotHash.length !== 32 ||
      opts.lastSlotHash.length !== 32 ||
      opts.slotsSlab64B.length % 64 !== 0
    ) {
      return
    }
    const targetPath = diskFilePath(storageDir, opts.accountHash)
    let existing: DiskStorageRecord | undefined
    try {
      if (fs.existsSync(targetPath)) {
        const parsed = decodeDiskRecord(new Uint8Array(fs.readFileSync(targetPath)))
        if (parsed !== undefined && equalsBytes(parsed.storageRoot, opts.storageRoot)) {
          existing = parsed
        }
      }
    } catch {
      existing = undefined
    }
    const chunks: EthyStorageDiskChunk[] = existing !== undefined ? [...existing.chunks] : []
    const idx = chunks.findIndex((c) => equalsBytes(c.originSlotHash, opts.originSlotHash))
    const nextChunk: EthyStorageDiskChunk = {
      originSlotHash: opts.originSlotHash,
      lastSlotHash: opts.lastSlotHash,
      hasRight: opts.hasRight !== 0 ? 1 : 0,
      slotsSlab64B: opts.slotsSlab64B,
      proofNodes: opts.proofNodes,
    }
    if (idx >= 0) {
      chunks[idx] = nextChunk
    } else {
      chunks.push(nextChunk)
    }
    chunks.sort((a, b) => compareHash(a.originSlotHash, b.originSlotHash))
    const rec: DiskStorageRecord = {
      accountHash: opts.accountHash,
      storageRoot: opts.storageRoot,
      chunkBlockNumber:
        existing !== undefined && existing.chunkBlockNumber > opts.chunkBlockNumber
          ? existing.chunkBlockNumber
          : opts.chunkBlockNumber,
      complete: existing?.complete === true,
      chunks,
    }
    writeAtomic(targetPath, encodeDiskRecord(rec))
  }

  setStorageDir(dir: string | undefined): void {
    if (this._storageDir !== dir) {
      this._storageDir = dir
      this._diskCache.clear()
      this._diskOrder.length = 0
    }
  }

  storageDir(): string | undefined {
    return this._storageDir
  }

  put(entry: EthyStorageEntry): void {
    if (entry.accountHash.length !== 32 || entry.storageRoot.length !== 32) return
    if (entry.slotsSlab64B.byteLength % 64 !== 0) {
      throw new Error('EthyStorageStore.put: slotsSlab64B length must be a multiple of 64 bytes')
    }
    const key = bytesToUnprefixedHex(entry.accountHash)
    const ownedSlab = new Uint8Array(entry.slotsSlab64B.byteLength)
    ownedSlab.set(entry.slotsSlab64B)
    this._entries.set(key, {
      ...entry,
      slotsSlab64B: ownedSlab,
      proofNodes: entry.proofNodes.map((p) => {
        const c = new Uint8Array(p.byteLength)
        c.set(p)
        return c
      }),
    })
  }

  get(accountHash: Uint8Array): EthyStorageEntry | undefined {
    if (accountHash.length !== 32) return undefined
    const mem = this._entries.get(bytesToUnprefixedHex(accountHash))
    if (mem !== undefined) return mem
    const disk = this._readDiskRecord(accountHash)
    if (disk === undefined) return undefined
    const first = disk.chunks[0]!
    return {
      accountHash: disk.accountHash,
      storageRoot: disk.storageRoot,
      chunkBlockNumber: disk.chunkBlockNumber,
      slotsSlab64B: first.slotsSlab64B,
      complete: disk.complete,
      proofNodes: first.proofNodes,
    }
  }

  private _touchDiskCache(key: string): void {
    const idx = this._diskOrder.indexOf(key)
    if (idx >= 0) {
      this._diskOrder.splice(idx, 1)
      this._diskOrder.push(key)
    }
  }

  private _putDiskCache(key: string, row: CachedDiskRecord): void {
    if (this._diskCache.has(key)) {
      this._diskCache.set(key, row)
      this._touchDiskCache(key)
      return
    }
    this._diskCache.set(key, row)
    this._diskOrder.push(key)
    while (this._diskOrder.length > MAX_DISK_CACHE) {
      const evict = this._diskOrder.shift()
      if (evict !== undefined) this._diskCache.delete(evict)
    }
  }

  private _readDiskRecord(accountHash: Uint8Array): DiskStorageRecord | undefined {
    if (this._storageDir === undefined) return undefined
    if (this._readInflight >= MAX_READ_INFLIGHT) return undefined
    const key = bytesToUnprefixedHex(accountHash)
    const filePath = diskFilePath(this._storageDir, accountHash)
    this._readInflight++
    try {
      if (!fs.existsSync(filePath)) return undefined
      const stat = fs.statSync(filePath)
      const cached = this._diskCache.get(key)
      if (cached !== undefined && cached.mtimeMs === stat.mtimeMs && cached.size === stat.size) {
        this._touchDiskCache(key)
        return cached.record
      }
      const parsed = decodeDiskRecord(new Uint8Array(fs.readFileSync(filePath)))
      if (parsed === undefined) return undefined
      this._putDiskCache(key, { mtimeMs: stat.mtimeMs, size: stat.size, record: parsed })
      return parsed
    } catch {
      return undefined
    } finally {
      this._readInflight--
    }
  }

  sliceKind1(
    accountHash: Uint8Array,
    storageRoot: Uint8Array,
    originSlotHash: Uint8Array,
    maxBytes: number,
  ):
    | {
        storageRoot: Uint8Array
        chunkBlockNumber: bigint
        originSlotHash: Uint8Array
        lastSlotHash: Uint8Array
        hasRight: number
        slotsSlab64B: Uint8Array
        proofNodes: Uint8Array[]
      }
    | undefined {
    if (accountHash.length !== 32 || storageRoot.length !== 32 || originSlotHash.length !== 32) {
      return undefined
    }
    const mem = this._entries.get(bytesToUnprefixedHex(accountHash))
    if (mem !== undefined) {
      return this._sliceInMemoryEntry(mem, storageRoot, originSlotHash, maxBytes)
    }
    const disk = this._readDiskRecord(accountHash)
    if (disk === undefined || !equalsBytes(disk.storageRoot, storageRoot)) return undefined
    if (disk.complete && disk.chunks.length === 1 && disk.chunks[0]!.proofNodes.length === 0) {
      const only = disk.chunks[0]!
      return this._sliceInMemoryEntry(
        {
          accountHash: disk.accountHash,
          storageRoot: disk.storageRoot,
          chunkBlockNumber: disk.chunkBlockNumber,
          slotsSlab64B: only.slotsSlab64B,
          complete: true,
          proofNodes: [],
        },
        storageRoot,
        originSlotHash,
        maxBytes,
      )
    }
    const picked = pickCoveringDiskChunk(disk.chunks, originSlotHash)
    if (picked === undefined) return undefined
    if (picked.slotsSlab64B.length > maxBytes) return undefined
    return {
      storageRoot: disk.storageRoot,
      chunkBlockNumber: disk.chunkBlockNumber,
      originSlotHash: picked.originSlotHash,
      lastSlotHash: picked.lastSlotHash,
      hasRight: picked.hasRight,
      slotsSlab64B: new Uint8Array(picked.slotsSlab64B),
      proofNodes: picked.proofNodes,
    }
  }

  private _sliceInMemoryEntry(
    rec: EthyStorageEntry,
    storageRoot: Uint8Array,
    originSlotHash: Uint8Array,
    maxBytes: number,
  ) {
    if (!equalsBytes(rec.storageRoot, storageRoot)) return undefined
    const rowCount = Math.floor(rec.slotsSlab64B.length / 64)
    if (rowCount === 0) return undefined

    const firstSlot = slotHashAt(rec.slotsSlab64B, 0)
    const lastSlot = slotHashAt(rec.slotsSlab64B, rowCount - 1)
    const target = originSlotHash
    const zeroTarget = target.every((b) => b === 0)

    let startIdx = 0
    if (!zeroTarget) {
      if (compareHash(target, firstSlot) < 0) {
        startIdx = 0
      } else if (compareHash(target, lastSlot) > 0) {
        if (!rec.complete) return undefined
        startIdx = rowCount - 1
      } else {
        let found = false
        for (let i = 0; i < rowCount; i++) {
          const h = slotHashAt(rec.slotsSlab64B, i)
          const cmp = compareHash(h, target)
          if (cmp >= 0) {
            // Exact match starts at `i`; gap between `i - 1` and `i` includes `i - 1` so the
            // returned `[originSlotHash .. lastSlotHash]` range covers `target` for exclusion proofs.
            startIdx = cmp === 0 ? i : Math.max(0, i - 1)
            found = true
            break
          }
        }
        if (!found) return undefined
      }
    }

    let endIdx = startIdx
    let bytes = 0
    while (endIdx < rowCount) {
      if (bytes + 64 > maxBytes) break
      bytes += 64
      endIdx++
    }
    if (endIdx <= startIdx) return undefined

    const slice = rec.slotsSlab64B.subarray(startIdx * 64, endIdx * 64)
    const lastSlotHash = slotHashAt(slice, Math.floor(slice.length / 64) - 1)
    const hasRight = !rec.complete || endIdx < rowCount ? 1 : 0
    const isCompleteWholeTrie = rec.complete && startIdx === 0 && endIdx === rowCount
    const proofNodes = isCompleteWholeTrie ? [] : rec.proofNodes

    return {
      storageRoot: rec.storageRoot,
      chunkBlockNumber: rec.chunkBlockNumber,
      originSlotHash: slotHashAt(slice, 0),
      lastSlotHash,
      hasRight,
      slotsSlab64B: new Uint8Array(slice),
      proofNodes,
    }
  }

  entriesKind2(
    pairs: Array<{ accountHash: Uint8Array; storageRoot: Uint8Array }>,
    maxBytes: number,
  ): Array<{ accountHash: Uint8Array; storageRoot: Uint8Array; slotsSlab64B: Uint8Array }> {
    const out: Array<{
      accountHash: Uint8Array
      storageRoot: Uint8Array
      slotsSlab64B: Uint8Array
    }> = []
    let bytes = 0
    for (const p of pairs.slice(0, 64)) {
      const mem = this._entries.get(bytesToUnprefixedHex(p.accountHash))
      if (mem !== undefined) {
        if (!mem.complete) continue
        if (!equalsBytes(mem.storageRoot, p.storageRoot)) continue
        if (bytes + mem.slotsSlab64B.length > maxBytes) continue
        out.push({
          accountHash: p.accountHash,
          storageRoot: p.storageRoot,
          slotsSlab64B: mem.slotsSlab64B,
        })
        bytes += mem.slotsSlab64B.length
        continue
      }
      const disk = this._readDiskRecord(p.accountHash)
      if (disk === undefined || !disk.complete || disk.chunks.length === 0) continue
      if (!equalsBytes(disk.storageRoot, p.storageRoot)) continue
      const slab = disk.chunks[0]!.slotsSlab64B
      if (bytes + slab.length > maxBytes) continue
      out.push({
        accountHash: p.accountHash,
        storageRoot: p.storageRoot,
        slotsSlab64B: slab,
      })
      bytes += slab.length
    }
    return out
  }
}

function pickCoveringDiskChunk(
  chunks: readonly EthyStorageDiskChunk[],
  target: Uint8Array,
): EthyStorageDiskChunk | undefined {
  if (chunks.length === 0) return undefined
  if (target.every((b) => b === 0)) return chunks[0]
  // 1. Exact origin match or interior `[origin .. last]` covering chunk.
  for (const c of chunks) {
    if (compareHash(target, c.originSlotHash) >= 0 && compareHash(target, c.lastSlotHash) <= 0) {
      return c
    }
  }
  // 2. Target before first chunk's origin → return first chunk (left boundary).
  if (compareHash(target, chunks[0]!.originSlotHash) < 0) {
    return chunks[0]
  }
  // 3. Target past last chunk's `lastSlotHash` when `hasRight === 0` (proven right tail).
  const lastChunk = chunks[chunks.length - 1]!
  if (compareHash(target, lastChunk.lastSlotHash) > 0 && lastChunk.hasRight === 0) {
    return lastChunk
  }
  // 4. Target falls in the gap between `chunks[i].lastSlotHash` and `chunks[i + 1].originSlotHash`
  //    (e.g. a sequential crawl passing `incrementKey32(prev.last)`): return `chunks[i + 1]`.
  for (let i = 0; i < chunks.length; i++) {
    if (compareHash(chunks[i]!.originSlotHash, target) >= 0) {
      return chunks[i]
    }
  }
  return undefined
}
