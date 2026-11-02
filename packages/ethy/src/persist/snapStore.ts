import * as fs from 'node:fs'
import * as path from 'node:path'

import type { FlatStateManager } from '@ethereumjs/statemanager'
import {
  KECCAK256_NULL,
  KECCAK256_RLP,
  createBlockLevelAccessListFromRLP,
  equalsBytes,
  getBinaryAccountCodeHash,
  getBinaryAccountStorageRoot,
  isBinaryAccountContract,
  isBinaryAccountEmptyStorage,
} from '@ethereumjs/util'
import { bytesToHex, unprefixedHexToBytes } from '@ethereumjs/util'

import { createSnapBuckets, snapBucketCursorExhausted } from '../spine/buckets.ts'
import type { EthySpine, SnapBucket, SnapBucketStatus } from '../spine/types.ts'
import type { IngestedAccountMeta } from '../sync/accountSync.ts'
import type { SnapResumeSaved } from '../sync/resumePolicy.ts'
import {
  BINARY_ACCOUNT_JOURNAL_MAGIC,
  accountFromJournalRlp,
  countAccountJournalRecords,
  encodeAccountJournalRecord,
  encodeBinaryAccountJournalAppendBatch,
  encodeBinaryAccountJournalBatch,
  forEachBinaryJournalBatch,
  isBinaryAccountJournalFile,
  journalCursorAfterRecords,
  readAccountJournalFile,
} from './journal.ts'

export const SNAP_STORE_SCHEMA = 2

type ChainMeta = { chainId: string; genesisHash: string }

type ActiveMeta = {
  stateRoot: string
  previousStateRoot?: string | null
  baseSyncComplete?: boolean
  lastVerifiedBlockNumber?: string
}

type PivotMeta = {
  blockNumber: string
  blockHash: string
  stateRoot: string
  anchoredAt: number
}

type SerializedBucket = {
  index: number
  prefix: string
  status: SnapBucketStatus
  accountsLoaded: number
  currentLastHash: string
  lastStallReason?: string
}

export type SnapStoreOpenOpts = {
  dataDir: string
  network: string
  chainId: bigint
  genesisHash: string
  enabled: boolean
}

function writeAtomicDoc(filePath: string, value: unknown): void {
  const dir = path.dirname(filePath)
  fs.mkdirSync(dir, { recursive: true })
  const tmp = `${filePath}.${process.pid}.tmp`
  fs.writeFileSync(tmp, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
  fs.renameSync(tmp, filePath)
}

function readStoredDoc<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T
}

/** On-disk snap pivot journal for one network. */
export class SnapPivotStore {
  readonly enabled: boolean
  private readonly root: string
  private readonly networkDir: string
  private readonly network: string
  private readonly chainId: bigint
  private readonly genesisHash: string
  private activeStateRoot?: string
  private restoredContracts: IngestedAccountMeta[] = []
  private lastBuckets?: SnapBucket[]
  private pendingMetadataFlush = false
  private lastMetadataFlushAt = 0
  private dirtyAccountBuckets = new Set<number>()
  private readonly metadataFlushIntervalMs = 2_000
  private readonly accountWriteChains = new Map<string, Promise<void>>()

  private constructor(opts: SnapStoreOpenOpts & { root: string; networkDir: string }) {
    this.enabled = opts.enabled
    this.root = opts.root
    this.networkDir = opts.networkDir
    this.network = opts.network
    this.chainId = opts.chainId
    this.genesisHash = opts.genesisHash.toLowerCase()
  }

  static open(opts: SnapStoreOpenOpts): SnapPivotStore {
    const root = opts.dataDir
    const networkDir = path.join(root, 'networks', opts.network.toLowerCase())
    const store = new SnapPivotStore({ ...opts, root, networkDir })
    if (!opts.enabled) return store
    store.ensureMeta()
    return store
  }

  private ensureMeta(): void {
    fs.mkdirSync(this.networkDir, { recursive: true })
    const metaPath = path.join(this.root, 'meta.json')
    if (!fs.existsSync(metaPath)) {
      writeAtomicDoc(metaPath, { schema: SNAP_STORE_SCHEMA })
    } else {
      const meta = readStoredDoc<{ schema: number }>(metaPath)
      if (meta.schema !== SNAP_STORE_SCHEMA && meta.schema !== 1) {
        throw new Error(`Unsupported snap store schema ${meta.schema}`)
      }
    }
    const chainPath = path.join(this.networkDir, 'chain.json')
    if (!fs.existsSync(chainPath)) {
      writeAtomicDoc(chainPath, {
        chainId: this.chainId.toString(),
        genesisHash: this.genesisHash,
      } satisfies ChainMeta)
      return
    }
    const chain = readStoredDoc<ChainMeta>(chainPath)
    if (chain.genesisHash.toLowerCase() !== this.genesisHash) {
      throw new Error(`Snap store genesis mismatch for ${this.network}`)
    }
    if (BigInt(chain.chainId) !== this.chainId) {
      throw new Error(`Snap store chain id mismatch for ${this.network}`)
    }
  }

  private pivotDir(stateRootHex: string): string {
    const hex = stateRootHex.startsWith('0x') ? stateRootHex.slice(2) : stateRootHex
    return path.join(this.networkDir, 'pivots', hex.toLowerCase())
  }

  private accountFile(bucketIndex: number, stateRootHex: string): string {
    return path.join(this.pivotDir(stateRootHex), 'accounts', `${bucketIndex.toString(16)}.bin`)
  }

  /** Read on-disk pivot metadata without replaying journals (WP-04a resume). */
  peekActive(): SnapResumeSaved | undefined {
    if (!this.enabled) return undefined
    const active = this.readActive()
    if (active === undefined) return undefined
    const pivotPath = path.join(this.pivotDir(active.stateRoot), 'pivot.json')
    if (!fs.existsSync(pivotPath)) return undefined
    const pivot = readStoredDoc<PivotMeta>(pivotPath)
    let bucketsDoneCount = 0
    const bucketsPath = path.join(this.pivotDir(active.stateRoot), 'buckets.json')
    if (fs.existsSync(bucketsPath)) {
      const saved = readStoredDoc<{ buckets: SerializedBucket[] }>(bucketsPath).buckets
      bucketsDoneCount = saved.filter((b) => b.status === 'done').length
    }
    const pivotBlock = BigInt(pivot.blockNumber)
    let lastVerifiedBlockNumber: bigint | undefined
    if (active.lastVerifiedBlockNumber !== undefined) {
      lastVerifiedBlockNumber = BigInt(active.lastVerifiedBlockNumber)
    } else if (active.baseSyncComplete === true) {
      lastVerifiedBlockNumber = pivotBlock
    }
    return {
      pivotBlockNumber: pivotBlock,
      baseSyncComplete: active.baseSyncComplete === true,
      bucketsDoneCount,
      lastVerifiedBlockNumber,
    }
  }

  /** Wipe pivot journals while keeping peer book and discovery (WP-04a `--fresh`). */
  discardPivots(): void {
    if (!this.enabled) return
    const pivotsRoot = path.join(this.networkDir, 'pivots')
    if (fs.existsSync(pivotsRoot)) {
      fs.rmSync(pivotsRoot, { recursive: true, force: true })
    }
    const activePath = path.join(this.networkDir, 'active.json')
    if (fs.existsSync(activePath)) {
      fs.unlinkSync(activePath)
    }
    this.activeStateRoot = undefined
    this.restoredContracts = []
  }

  markBaseSyncComplete(pivotBlock: bigint): void {
    if (!this.enabled) return
    const active = this.readActive()
    if (active === undefined) return
    writeAtomicDoc(path.join(this.networkDir, 'active.json'), {
      ...active,
      baseSyncComplete: true,
      lastVerifiedBlockNumber: pivotBlock.toString(),
    } satisfies ActiveMeta)
  }

  noteVerifiedBlock(blockNumber: bigint): void {
    if (!this.enabled) return
    const active = this.readActive()
    if (active === undefined) return
    writeAtomicDoc(path.join(this.networkDir, 'active.json'), {
      ...active,
      lastVerifiedBlockNumber: blockNumber.toString(),
    } satisfies ActiveMeta)
  }

  drainRestoredContracts(): IngestedAccountMeta[] {
    const out = this.restoredContracts
    this.restoredContracts = []
    return out
  }

  /** Hydrate spine + state from the active pivot. Returns account count restored. */
  loadInto(spine: EthySpine, stateManager: FlatStateManager): number {
    if (!this.enabled) return 0
    this.restoredContracts = []
    const activePath = path.join(this.networkDir, 'active.json')
    if (!fs.existsSync(activePath)) return 0
    const active = readStoredDoc<ActiveMeta>(activePath)
    this.activeStateRoot = active.stateRoot
    const pivotPath = path.join(this.pivotDir(active.stateRoot), 'pivot.json')
    if (!fs.existsSync(pivotPath)) return 0
    const pivot = readStoredDoc<PivotMeta>(pivotPath)
    spine.pivotBlockNumber = BigInt(pivot.blockNumber)
    spine.pivotStateRoot = unprefixedHexToBytes(
      pivot.stateRoot.startsWith('0x') ? pivot.stateRoot.slice(2) : pivot.stateRoot,
    )
    spine.currentSlot = Number(pivot.blockNumber)
    if (active.lastVerifiedBlockNumber !== undefined) {
      spine.lastVerifiedBlockNumber = BigInt(active.lastVerifiedBlockNumber)
    } else if (active.baseSyncComplete === true) {
      spine.lastVerifiedBlockNumber = spine.pivotBlockNumber
    }
    spine.headBlockNumber = spine.lastVerifiedBlockNumber ?? spine.pivotBlockNumber
    spine.headStateRoot = spine.pivotStateRoot

    const buckets = createSnapBuckets()
    const bucketsPath = path.join(this.pivotDir(active.stateRoot), 'buckets.json')
    let savedBuckets: SerializedBucket[] | undefined
    if (fs.existsSync(bucketsPath)) {
      savedBuckets = readStoredDoc<{ buckets: SerializedBucket[] }>(bucketsPath).buckets
    }

    let restored = 0
    for (let i = 0; i < buckets.length; i++) {
      const bucket = buckets[i]!
      const file = this.accountFile(i, active.stateRoot)
      let journalRecords = 0
      if (fs.existsSync(file)) {
        const raw = fs.readFileSync(file)
        if (isBinaryAccountJournalFile(raw)) {
          const { recordCount, lastHash } = this.restoreBinaryJournalSync(raw, stateManager)
          journalRecords = recordCount
          restored += recordCount
          const cursor = journalCursorAfterRecords(i, recordCount, lastHash, bucket.startHash)
          bucket.accountsLoaded = cursor.accountsLoaded
          bucket.currentLastHash = cursor.currentLastHash
        } else {
          const { records, lastHash } = readAccountJournalFile(raw)
          journalRecords = records.length
          for (const row of records) {
            const account = accountFromJournalRlp(row.accountRlp)
            stateManager.putSnapAccountsBatch([{ accountHash: row.accountHash, account }])
            if (
              !equalsBytes(account.codeHash, KECCAK256_NULL) ||
              !equalsBytes(account.storageRoot, KECCAK256_RLP)
            ) {
              this.restoredContracts.push({
                accountHash: row.accountHash,
                codeHash: new Uint8Array(account.codeHash),
                storageRoot: new Uint8Array(account.storageRoot),
              })
            }
            restored++
          }
          const cursor = journalCursorAfterRecords(i, records.length, lastHash, bucket.startHash)
          bucket.accountsLoaded = cursor.accountsLoaded
          bucket.currentLastHash = cursor.currentLastHash
        }
      }
      const saved = savedBuckets?.find((b) => b.index === i)
      if (saved !== undefined) {
        bucket.status = saved.status
        bucket.lastStallReason = saved.lastStallReason
        if (journalRecords === 0) {
          bucket.accountsLoaded = saved.accountsLoaded
          bucket.currentLastHash = unprefixedHexToBytes(saved.currentLastHash.slice(2))
        }
      }
      if (bucket.status === 'done' && !snapBucketCursorExhausted(bucket)) {
        bucket.status = 'pending'
      }
    }
    spine.snapBuckets = buckets
    spine.totalAccountsSynced = stateManager.accountCount()
    if (active.previousStateRoot !== undefined && active.previousStateRoot !== null) {
      const held = this.heldAccountCount(active.previousStateRoot)
      if (held > 0) {
        spine.pivotCarry = { kind: 'previous', accounts: held }
      }
    }
    return restored
  }

  /** Same as {@link loadInto} but yields on the event loop so the TUI stays responsive. */
  async loadIntoAsync(spine: EthySpine, stateManager: FlatStateManager): Promise<number> {
    if (!this.enabled) return 0
    this.restoredContracts = []
    const activePath = path.join(this.networkDir, 'active.json')
    if (!fs.existsSync(activePath)) return 0
    const active = readStoredDoc<ActiveMeta>(activePath)
    this.activeStateRoot = active.stateRoot
    const pivotPath = path.join(this.pivotDir(active.stateRoot), 'pivot.json')
    if (!fs.existsSync(pivotPath)) return 0
    const pivot = readStoredDoc<PivotMeta>(pivotPath)
    spine.pivotBlockNumber = BigInt(pivot.blockNumber)
    spine.pivotStateRoot = unprefixedHexToBytes(
      pivot.stateRoot.startsWith('0x') ? pivot.stateRoot.slice(2) : pivot.stateRoot,
    )
    spine.currentSlot = Number(pivot.blockNumber)
    if (active.lastVerifiedBlockNumber !== undefined) {
      spine.lastVerifiedBlockNumber = BigInt(active.lastVerifiedBlockNumber)
    } else if (active.baseSyncComplete === true) {
      spine.lastVerifiedBlockNumber = spine.pivotBlockNumber
    }
    spine.headBlockNumber = spine.lastVerifiedBlockNumber ?? spine.pivotBlockNumber
    spine.headStateRoot = spine.pivotStateRoot

    const buckets = createSnapBuckets()
    const bucketsPath = path.join(this.pivotDir(active.stateRoot), 'buckets.json')
    let savedBuckets: SerializedBucket[] | undefined
    if (fs.existsSync(bucketsPath)) {
      savedBuckets = readStoredDoc<{ buckets: SerializedBucket[] }>(bucketsPath).buckets
    }

    let restored = 0
    let sliceStart = Date.now()
    const maybeYield = async (): Promise<void> => {
      if (Date.now() - sliceStart < 4) return
      await new Promise<void>((resolve) => setImmediate(resolve))
      sliceStart = Date.now()
    }

    for (let i = 0; i < buckets.length; i++) {
      const bucket = buckets[i]!
      const file = this.accountFile(i, active.stateRoot)
      let journalRecords = 0
      if (fs.existsSync(file)) {
        const raw = new Uint8Array(await fs.promises.readFile(file))
        if (isBinaryAccountJournalFile(raw)) {
          const { recordCount, lastHash } = await this.restoreBinaryJournalAsync(
            raw,
            stateManager,
            maybeYield,
          )
          journalRecords = recordCount
          restored += recordCount
          const cursor = journalCursorAfterRecords(i, recordCount, lastHash, bucket.startHash)
          bucket.accountsLoaded = cursor.accountsLoaded
          bucket.currentLastHash = cursor.currentLastHash
        } else {
          const { records, lastHash } = readAccountJournalFile(raw)
          journalRecords = records.length
          for (const row of records) {
            const account = accountFromJournalRlp(row.accountRlp)
            stateManager.putSnapAccountsBatch([{ accountHash: row.accountHash, account }])
            if (
              !equalsBytes(account.codeHash, KECCAK256_NULL) ||
              !equalsBytes(account.storageRoot, KECCAK256_RLP)
            ) {
              this.restoredContracts.push({
                accountHash: row.accountHash,
                codeHash: new Uint8Array(account.codeHash),
                storageRoot: new Uint8Array(account.storageRoot),
              })
            }
            restored++
            await maybeYield()
          }
          const cursor = journalCursorAfterRecords(i, records.length, lastHash, bucket.startHash)
          bucket.accountsLoaded = cursor.accountsLoaded
          bucket.currentLastHash = cursor.currentLastHash
        }
      }
      const saved = savedBuckets?.find((b) => b.index === i)
      if (saved !== undefined) {
        bucket.status = saved.status
        bucket.lastStallReason = saved.lastStallReason
        if (journalRecords === 0) {
          bucket.accountsLoaded = saved.accountsLoaded
          bucket.currentLastHash = unprefixedHexToBytes(saved.currentLastHash.slice(2))
        }
      }
      if (bucket.status === 'done' && !snapBucketCursorExhausted(bucket)) {
        bucket.status = 'pending'
      }
    }
    spine.snapBuckets = buckets
    spine.totalAccountsSynced = stateManager.accountCount()
    if (active.previousStateRoot !== undefined && active.previousStateRoot !== null) {
      const held = this.heldAccountCount(active.previousStateRoot)
      if (held > 0) {
        spine.pivotCarry = { kind: 'previous', accounts: held }
      }
    }
    return restored
  }

  /**
   * Account journals still on a pivot directory.
   * Trust `buckets.json` only for a bucket that has a non-empty journal file.
   * A saved count with no file is ignored. A file with no saved count is scanned.
   */
  private heldAccountCount(stateRootHex: string): number {
    const dir = this.pivotDir(stateRootHex)
    const accountsDir = path.join(dir, 'accounts')
    if (!fs.existsSync(accountsDir)) return 0
    let saved: SerializedBucket[] | undefined
    const bucketsPath = path.join(dir, 'buckets.json')
    if (fs.existsSync(bucketsPath)) {
      saved = readStoredDoc<{ buckets: SerializedBucket[] }>(bucketsPath).buckets
    }
    let total = 0
    for (const name of fs.readdirSync(accountsDir)) {
      if (!name.endsWith('.bin')) continue
      const filePath = path.join(accountsDir, name)
      if (fs.statSync(filePath).size === 0) continue
      const index = Number.parseInt(name.slice(0, -'.bin'.length), 16)
      const row = saved?.find((b) => b.index === index)
      if (row !== undefined && row.accountsLoaded > 0) {
        total += row.accountsLoaded
        continue
      }
      total += countAccountJournalRecords(new Uint8Array(fs.readFileSync(filePath)))
    }
    return total
  }

  /** Create or switch active pivot; prune to active + previous only. */
  activatePivot(meta: {
    blockNumber: bigint
    blockHash: Uint8Array
    stateRoot: Uint8Array
  }): void {
    if (!this.enabled) return
    const stateRootHex = bytesToHex(meta.stateRoot)
    const prior = this.readActive()
    let previousStateRoot: string | null = null
    if (prior !== undefined) {
      if (prior.stateRoot.toLowerCase() !== stateRootHex.toLowerCase()) {
        previousStateRoot = prior.stateRoot
      } else {
        previousStateRoot = prior.previousStateRoot ?? null
      }
    }
    const dir = this.pivotDir(stateRootHex)
    fs.mkdirSync(path.join(dir, 'accounts'), { recursive: true })
    fs.mkdirSync(path.join(dir, 'code'), { recursive: true })
    fs.mkdirSync(path.join(dir, 'storage'), { recursive: true })
    const pivotPath = path.join(dir, 'pivot.json')
    if (!fs.existsSync(pivotPath)) {
      writeAtomicDoc(pivotPath, {
        blockNumber: meta.blockNumber.toString(),
        blockHash: bytesToHex(meta.blockHash),
        stateRoot: stateRootHex,
        anchoredAt: Date.now(),
      } satisfies PivotMeta)
      writeAtomicDoc(path.join(dir, 'buckets.json'), {
        buckets: serializeBuckets(createSnapBuckets()),
      })
    }
    writeAtomicDoc(path.join(this.networkDir, 'active.json'), {
      stateRoot: stateRootHex,
      previousStateRoot,
    } satisfies ActiveMeta)
    this.activeStateRoot = stateRootHex
    this.prunePivots(stateRootHex, previousStateRoot)
  }

  private readActive(): ActiveMeta | undefined {
    const activePath = path.join(this.networkDir, 'active.json')
    if (!fs.existsSync(activePath)) return undefined
    return readStoredDoc<ActiveMeta>(activePath)
  }

  private prunePivots(activeHex: string, previousHex: string | null): void {
    const pivotsRoot = path.join(this.networkDir, 'pivots')
    if (!fs.existsSync(pivotsRoot)) return
    const keep = new Set<string>()
    keep.add(activeHex.slice(2).toLowerCase())
    if (previousHex !== null) {
      keep.add(previousHex.replace(/^0x/i, '').toLowerCase())
    }
    for (const name of fs.readdirSync(pivotsRoot)) {
      if (keep.has(name.toLowerCase())) continue
      fs.rmSync(path.join(pivotsRoot, name), { recursive: true, force: true })
    }
  }

  private pushContractRowsFromSlab(slab: Uint8Array): void {
    const stride = 136
    for (let offset = 0; offset + stride <= slab.length; offset += stride) {
      const accountHash = slab.subarray(offset, offset + 32)
      const binaryAccount = slab.subarray(offset + 32, offset + stride)
      if (!isBinaryAccountContract(binaryAccount) && isBinaryAccountEmptyStorage(binaryAccount)) {
        continue
      }
      this.restoredContracts.push({
        accountHash: new Uint8Array(accountHash),
        codeHash: new Uint8Array(getBinaryAccountCodeHash(binaryAccount)),
        storageRoot: new Uint8Array(getBinaryAccountStorageRoot(binaryAccount)),
      })
    }
  }

  private restoreBinaryJournalSync(
    raw: Uint8Array,
    stateManager: FlatStateManager,
  ): { recordCount: number; lastHash?: Uint8Array } {
    if (!isBinaryAccountJournalFile(raw)) {
      return { recordCount: 0 }
    }
    let recordCount = 0
    let lastHash: Uint8Array | undefined
    const payloadStart = BINARY_ACCOUNT_JOURNAL_MAGIC.length
    const rowSize = 136
    const totalRows = Math.floor((raw.length - payloadStart) / rowSize)
    const batchRows = 4000
    for (let rowStart = 0; rowStart < totalRows; rowStart += batchRows) {
      const batchCount = Math.min(batchRows, totalRows - rowStart)
      const byteStart = payloadStart + rowStart * rowSize
      const slab = raw.subarray(byteStart, byteStart + batchCount * rowSize)
      stateManager.putSnapBinaryAccountsFromSlab(slab)
      this.pushContractRowsFromSlab(slab)
      recordCount += batchCount
      const lastRowOffset = byteStart + (batchCount - 1) * rowSize
      lastHash = raw.subarray(lastRowOffset, lastRowOffset + 32)
    }
    return { recordCount, lastHash }
  }

  private async restoreBinaryJournalAsync(
    raw: Uint8Array,
    stateManager: FlatStateManager,
    maybeYield: () => Promise<void>,
  ): Promise<{ recordCount: number; lastHash?: Uint8Array }> {
    let recordCount = 0
    let lastHash: Uint8Array | undefined
    await forEachBinaryJournalBatch(raw, 4000, async (slab, lastHashInBatch) => {
      stateManager.putSnapBinaryAccountsFromSlab(slab)
      this.pushContractRowsFromSlab(slab)
      recordCount += slab.length / 136
      lastHash = lastHashInBatch
      await maybeYield()
    })
    return { recordCount, lastHash }
  }

  /** Live path: one async append per verified account slab (magic prefix on empty file). */
  appendVerifiedSlabAsync(
    bucketIndex: number,
    slab: Uint8Array,
    buckets: SnapBucket[],
  ): Promise<void> {
    if (!this.enabled || this.activeStateRoot === undefined || slab.length === 0) {
      return Promise.resolve()
    }
    this.lastBuckets = buckets
    const file = this.accountFile(bucketIndex, this.activeStateRoot)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    const prior = this.accountWriteChains.get(file) ?? Promise.resolve()
    const next = prior.then(async () => {
      const fileEmpty = !fs.existsSync(file) || fs.statSync(file).size === 0
      const body = fileEmpty
        ? Buffer.concat([Buffer.from(BINARY_ACCOUNT_JOURNAL_MAGIC), Buffer.from(slab)])
        : slab
      await fs.promises.appendFile(file, body)
    })
    this.accountWriteChains.set(file, next)
    this.dirtyAccountBuckets.add(bucketIndex)
    this.pendingMetadataFlush = true
    this.maybeFlushMetadata(false)
    return next
  }

  appendVerifiedRange(
    bucketIndex: number,
    records: Array<{ accountHash: Uint8Array; binaryAccount: Uint8Array }>,
    buckets: SnapBucket[],
  ): void {
    if (!this.enabled || this.activeStateRoot === undefined || records.length === 0) return
    this.lastBuckets = buckets
    const file = this.accountFile(bucketIndex, this.activeStateRoot)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    const fileEmpty = !fs.existsSync(file) || fs.statSync(file).size === 0
    const batch =
      fileEmpty && records.length > 0
        ? encodeBinaryAccountJournalBatch(records)
        : encodeBinaryAccountJournalAppendBatch(records)
    const fd = fs.openSync(file, 'a')
    try {
      fs.writeSync(fd, batch)
    } finally {
      fs.closeSync(fd)
    }
    this.dirtyAccountBuckets.add(bucketIndex)
    this.pendingMetadataFlush = true
    this.maybeFlushMetadata(false)
  }

  /** Legacy variable-length RLP journal append (resume in-progress pivots only). */
  appendVerifiedRangeLegacy(
    bucketIndex: number,
    records: Array<{ accountHash: Uint8Array; accountRlp: Uint8Array }>,
    buckets: SnapBucket[],
  ): void {
    if (!this.enabled || this.activeStateRoot === undefined || records.length === 0) return
    this.lastBuckets = buckets
    const file = this.accountFile(bucketIndex, this.activeStateRoot)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    const chunks: Uint8Array[] = records.map((row) => encodeAccountJournalRecord(row))
    const batch = Buffer.concat(chunks.map((c) => Buffer.from(c)))
    const fd = fs.openSync(file, 'a')
    try {
      fs.writeSync(fd, batch)
    } finally {
      fs.closeSync(fd)
    }
    this.dirtyAccountBuckets.add(bucketIndex)
    this.pendingMetadataFlush = true
    this.maybeFlushMetadata(false)
  }

  maybeFlushMetadata(force: boolean): void {
    if (!this.enabled || this.activeStateRoot === undefined) return
    const now = Date.now()
    if (!force && now - this.lastMetadataFlushAt < this.metadataFlushIntervalMs) return
    if (!this.pendingMetadataFlush && !force) return
    if (this.lastBuckets !== undefined) {
      this.flushBuckets(this.lastBuckets)
    }
    const dirty = [...this.dirtyAccountBuckets]
    this.dirtyAccountBuckets.clear()
    this.pendingMetadataFlush = false
    this.lastMetadataFlushAt = now
    if (force) {
      for (const bucketIndex of dirty) this.fsyncBucketSync(bucketIndex)
      return
    }
    // Live sync: durability without fsyncSync, which stalls the presentation clock
    // for as long as the journal is large.
    void this.fsyncBucketsAsync(dirty)
  }

  private fsyncBucketSync(bucketIndex: number): void {
    if (this.activeStateRoot === undefined) return
    const file = this.accountFile(bucketIndex, this.activeStateRoot)
    if (!fs.existsSync(file)) return
    const fd = fs.openSync(file, 'r')
    try {
      fs.fsyncSync(fd)
    } finally {
      fs.closeSync(fd)
    }
  }

  private async fsyncBucketsAsync(bucketIndexes: number[]): Promise<void> {
    if (this.activeStateRoot === undefined) return
    const root = this.activeStateRoot
    for (const bucketIndex of bucketIndexes) {
      const file = this.accountFile(bucketIndex, root)
      try {
        const handle = await fs.promises.open(file, 'r')
        try {
          await handle.sync()
        } finally {
          await handle.close()
        }
      } catch {
        // journal not on disk yet
      }
      await new Promise<void>((resolve) => setImmediate(resolve))
    }
  }

  flushBuckets(buckets: SnapBucket[]): void {
    if (!this.enabled || this.activeStateRoot === undefined) return
    this.lastBuckets = buckets
    writeAtomicDoc(path.join(this.pivotDir(this.activeStateRoot), 'buckets.json'), {
      buckets: serializeBuckets(buckets),
    })
  }

  flushAll(buckets: SnapBucket[]): void {
    this.flushBuckets(buckets)
    this.maybeFlushMetadata(true)
  }

  appendCode(codeHash: Uint8Array, code: Uint8Array): void {
    if (!this.enabled || this.activeStateRoot === undefined) return
    const hex = bytesToHex(codeHash).slice(2).toLowerCase()
    const file = path.join(this.pivotDir(this.activeStateRoot), 'code', `${hex}.bin`)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    const header = new Uint8Array(4)
    new DataView(header.buffer).setUint32(0, code.length, false)
    fs.writeFileSync(file, Buffer.concat([Buffer.from(header), Buffer.from(code)]))
  }

  appendHealBal(blockNumber: bigint, balRlp: Uint8Array): void {
    if (!this.enabled || this.activeStateRoot === undefined || balRlp.length === 0) return
    const healDir = path.join(this.pivotDir(this.activeStateRoot), 'heal')
    fs.mkdirSync(healDir, { recursive: true })
    const file = path.join(healDir, `${blockNumber.toString()}.bal`)
    fs.writeFileSync(file, balRlp)
  }

  /** Replay heal BAL files from previous (if any) and active pivot dirs (D-059). */
  async replayPersistedHealBalJournal(stateManager: FlatStateManager): Promise<number> {
    if (!this.enabled) return 0
    const active = this.readActive()
    if (active === undefined) return 0
    let applied = 0
    if (active.previousStateRoot !== undefined && active.previousStateRoot !== null) {
      applied += await this.replayHealDir(active.previousStateRoot, stateManager)
    }
    applied += await this.replayHealDir(active.stateRoot, stateManager)
    return applied
  }

  private async replayHealDir(
    stateRootHex: string,
    stateManager: FlatStateManager,
  ): Promise<number> {
    const healDir = path.join(this.pivotDir(stateRootHex), 'heal')
    if (!fs.existsSync(healDir)) return 0
    const names = fs
      .readdirSync(healDir)
      .filter((n) => n.endsWith('.bal'))
      .sort((a, b) => {
        const na = BigInt(a.replace(/\.bal$/, ''))
        const nb = BigInt(b.replace(/\.bal$/, ''))
        return na < nb ? -1 : na > nb ? 1 : 0
      })
    let count = 0
    for (const name of names) {
      const rlp = new Uint8Array(fs.readFileSync(path.join(healDir, name)))
      if (rlp.length === 0) continue
      const bal = createBlockLevelAccessListFromRLP(rlp)
      await stateManager.consumeBAL(bal.toJSON())
      count++
    }
    return count
  }

  appendStorageSlots(
    accountHash: Uint8Array,
    slots: Array<{ slotHash: Uint8Array; value: Uint8Array }>,
  ): void {
    if (!this.enabled || this.activeStateRoot === undefined || slots.length === 0) return
    const ah = bytesToHex(accountHash).slice(2).toLowerCase()
    const file = path.join(this.pivotDir(this.activeStateRoot), 'storage', `${ah}.bin`)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    const fd = fs.openSync(file, 'a')
    try {
      for (const { slotHash, value } of slots) {
        const record = new Uint8Array(32 + 4 + value.length)
        const view = new DataView(record.buffer, record.byteOffset, record.byteLength)
        record.set(slotHash, 0)
        view.setUint32(32, value.length, false)
        record.set(value, 36)
        fs.writeSync(fd, record)
      }
      fs.fsyncSync(fd)
    } finally {
      fs.closeSync(fd)
    }
  }
}

function serializeBuckets(buckets: SnapBucket[]): SerializedBucket[] {
  return buckets.map((b) => ({
    index: b.index,
    prefix: b.prefix,
    status: b.status,
    accountsLoaded: b.accountsLoaded,
    currentLastHash: bytesToHex(b.currentLastHash),
    lastStallReason: b.lastStallReason,
  }))
}

export function snapBucketsUnfinished(buckets: readonly SnapBucket[]): boolean {
  return buckets.some((b) => b.status !== 'done')
}
