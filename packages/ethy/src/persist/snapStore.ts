import * as fs from 'node:fs'
import * as path from 'node:path'

import type { FlatStateManager } from '@ethereumjs/statemanager'
import {
  Account,
  KECCAK256_NULL,
  KECCAK256_RLP,
  binaryAccountToAccount,
  createBlockLevelAccessListFromRLP,
  equalsBytes,
  getBinaryAccountCodeHash,
  getBinaryAccountStorageRoot,
  isBinaryAccountContract,
  isBinaryAccountEmptyStorage,
} from '@ethereumjs/util'
import { bytesToHex, unprefixedHexToBytes } from '@ethereumjs/util'

import {
  compareBytes32,
  createSnapBuckets,
  newPrefixCursor,
  snapBucketCursorExhausted,
  syncBucketCursorFields,
} from '../spine/buckets.ts'
import type { EthySpine, SnapBucket, SnapBucketStatus, SnapRangeCursor } from '../spine/types.ts'
import type { IngestedAccountMeta } from '../sync/accountSync.ts'
import type { VerifiedBalBlock } from '../sync/balSync.ts'
import type { SnapResumeSaved } from '../sync/resumePolicy.ts'
import { incrementKey32 } from '../sync/syntheticPeer.ts'
import { decodeHealBundleRlp, encodeHealBundleRlp } from './healBundle.ts'
import {
  BINARY_ACCOUNT_JOURNAL_MAGIC,
  BINARY_ACCOUNT_JOURNAL_RECORD_SIZE,
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
import {
  type ChunkProofFields,
  appendProofRecordSync,
  proofSidecarPathForJournal,
} from './proofSidecar.ts'

export const SNAP_STORE_SCHEMA = 2

/** Magic prefix for framed storage shard batches (WP-08a). */
export const STORAGE_BATCH_MAGIC = new Uint8Array([0x45, 0x54, 0x59, 0x31])

type StorageBatchSpan = {
  batchOffset: number
  accountHashHex: string
  slotCount: number
  batchByteLength: number
}

/** Full journal replay above this row count uses tail-only warmup (WP-04g). */
export const HOT_WARMUP_JOURNAL_RECORDS = 2_000
export const TAIL_WARMUP_JOURNAL_RECORDS = 256

type ChainMeta = { chainId: string; genesisHash: string }

type ActiveMeta = {
  stateRoot: string
  previousStateRoot?: string | null
  baseSyncComplete?: boolean
  lastVerifiedBlockNumber?: string
  ethyBucketsBitmask?: number
}

type PivotMeta = {
  blockNumber: string
  blockHash: string
  stateRoot: string
  anchoredAt: number
}

type SerializedSubRange = {
  origin: string
  limit: string
  journal: string
}

type SerializedBucket = {
  index: number
  prefix: string
  status: SnapBucketStatus
  accountsLoaded: number
  currentLastHash: string
  lastStallReason?: string
  subRanges?: SerializedSubRange[]
}

export type SnapStoreOpenOpts = {
  dataDir: string
  network: string
  chainId: bigint
  genesisHash: string
  enabled: boolean
}

let atomicDocSeq = 0

function writeAtomicDoc(filePath: string, value: unknown): void {
  const dir = path.dirname(filePath)
  fs.mkdirSync(dir, { recursive: true })
  const tmp = `${filePath}.${process.pid}.${++atomicDocSeq}.tmp`
  fs.writeFileSync(tmp, `${JSON.stringify(value, null, 2)}\n`, 'utf8')
  fs.renameSync(tmp, filePath)
}

function readStoredDoc<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T
}

/** On-disk snap pivot journal for one network. */
export class SnapPivotStore {
  readonly enabled: boolean
  readonly root: string
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
  /** Journal files that already have the binary magic prefix (live hot path, WP-04f). */
  private readonly initializedAccountFiles = new Set<string>()
  private bucketsFlushInFlight?: Promise<void>
  private readonly journalFdCache = new Map<number, number>()
  private readonly lookupFdCache = new Map<string, number>()
  private readonly lookupRowScratch = Buffer.alloc(BINARY_ACCOUNT_JOURNAL_RECORD_SIZE)
  private contractScan?: { bucket: number; byteOffset: number; segment?: string }
  private contractScanComplete = false
  private contractProgress?: {
    codesTotal: number
    codesSynced: number
    storageAccountsTotal: number
    storageAccountsSynced: number
    storageSlotsSynced: number
  }
  private readonly codeWriteChains = new Map<string, Promise<void>>()
  private readonly storageWriteChains = new Map<string, Promise<void>>()
  private readonly persistedCodeHashes = new Set<string>()
  private readonly persistedStorageAccounts = new Set<string>()
  private readonly codeLookupIndex = new Map<
    string,
    { fileSize: number; entries: Map<string, { offset: number; length: number }> }
  >()
  private readonly storageLookupIndex = new Map<
    string,
    { fileSize: number; batches: StorageBatchSpan[] }
  >()
  private restoredHealBlocks: VerifiedBalBlock[] = []

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
    return this.accountJournalPath(bucketIndex, stateRootHex, 'prefix')
  }

  private accountJournalPath(
    bucketIndex: number,
    stateRootHex: string,
    journal: 'prefix' | string,
  ): string {
    const dir = path.join(this.pivotDir(stateRootHex), 'accounts')
    if (journal === 'prefix') {
      return path.join(dir, `${bucketIndex.toString(16)}.bin`)
    }
    return path.join(dir, `${bucketIndex.toString(16)}.${journal}.seg`)
  }

  private listSegmentJournalFiles(bucketIndex: number, stateRootHex: string): string[] {
    const dir = path.join(this.pivotDir(stateRootHex), 'accounts')
    if (!fs.existsSync(dir)) return []
    const prefix = `${bucketIndex.toString(16)}.`
    return fs
      .readdirSync(dir)
      .filter((name) => name.startsWith(prefix) && name.endsWith('.seg'))
      .sort()
      .map((name) => path.join(dir, name))
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
    let totalAccountsSaved = 0
    const bucketsPath = path.join(this.pivotDir(active.stateRoot), 'buckets.json')
    if (fs.existsSync(bucketsPath)) {
      const saved = readStoredDoc<{ buckets: SerializedBucket[] }>(bucketsPath).buckets
      bucketsDoneCount = saved.filter((b) => b.status === 'done').length
      totalAccountsSaved = saved.reduce((sum, b) => sum + (b.accountsLoaded ?? 0), 0)
    }
    const pivotBlock = BigInt(pivot.blockNumber)
    let lastVerifiedBlockNumber: bigint | undefined
    if (active.lastVerifiedBlockNumber !== undefined) {
      lastVerifiedBlockNumber = BigInt(active.lastVerifiedBlockNumber)
    } else if (active.baseSyncComplete === true) {
      lastVerifiedBlockNumber = pivotBlock
    }
    if (
      active.baseSyncComplete !== true &&
      bucketsDoneCount === 0 &&
      totalAccountsSaved === 0 &&
      this.heldAccountCount(active.stateRoot) === 0 &&
      (lastVerifiedBlockNumber === undefined || lastVerifiedBlockNumber <= pivotBlock)
    ) {
      return undefined
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
    let lastVerified = pivotBlock
    if (active.lastVerifiedBlockNumber !== undefined) {
      const existing = BigInt(active.lastVerifiedBlockNumber)
      if (existing > lastVerified) lastVerified = existing
    }
    writeAtomicDoc(path.join(this.networkDir, 'active.json'), {
      ...active,
      baseSyncComplete: true,
      lastVerifiedBlockNumber: lastVerified.toString(),
    } satisfies ActiveMeta)
  }

  /** Rewrite pivot head metadata without changing the active journal directory (WP-04k). */
  updatePivotHead(meta: {
    blockNumber: bigint
    blockHash: Uint8Array
    stateRoot: Uint8Array
  }): void {
    if (!this.enabled) return
    const active = this.readActive()
    if (active === undefined) return
    const stateRootHex = active.stateRoot
    const pivotPath = path.join(this.pivotDir(stateRootHex), 'pivot.json')
    writeAtomicDoc(pivotPath, {
      blockNumber: meta.blockNumber.toString(),
      blockHash: bytesToHex(meta.blockHash),
      stateRoot: bytesToHex(meta.stateRoot),
      anchoredAt: Date.now(),
    } satisfies PivotMeta)
    writeAtomicDoc(path.join(this.networkDir, 'active.json'), {
      ...active,
      lastVerifiedBlockNumber: meta.blockNumber.toString(),
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
    if (active.lastVerifiedBlockNumber !== undefined) {
      spine.lastVerifiedBlockNumber = BigInt(active.lastVerifiedBlockNumber)
    } else if (active.baseSyncComplete === true) {
      spine.lastVerifiedBlockNumber = spine.pivotBlockNumber
    }
    spine.headBlockNumber = spine.lastVerifiedBlockNumber ?? spine.pivotBlockNumber
    spine.headStateRoot = spine.pivotStateRoot
    if (active.ethyBucketsBitmask !== undefined) {
      spine.ethyBucketsBitmask = active.ethyBucketsBitmask
    }

    const buckets = createSnapBuckets()
    const bucketsPath = path.join(this.pivotDir(active.stateRoot), 'buckets.json')
    let savedBuckets: SerializedBucket[] | undefined
    if (fs.existsSync(bucketsPath)) {
      savedBuckets = readStoredDoc<{ buckets: SerializedBucket[] }>(bucketsPath).buckets
    }

    let restored = 0
    for (let i = 0; i < buckets.length; i++) {
      const bucket = buckets[i]!
      const saved = savedBuckets?.find((b) => b.index === i)
      const lastHashByJournal = new Map<string, Uint8Array>()
      const file = this.accountFile(i, active.stateRoot)
      let journalRecords = 0
      if (fs.existsSync(file)) {
        const raw = fs.readFileSync(file)
        if (isBinaryAccountJournalFile(raw)) {
          const { recordCount, lastHash } = this.restoreBinaryJournalSync(raw, stateManager)
          journalRecords += recordCount
          restored += recordCount
          if (lastHash !== undefined) lastHashByJournal.set('prefix', lastHash)
          const cursor = journalCursorAfterRecords(i, recordCount, lastHash, bucket.startHash)
          bucket.accountsLoaded = cursor.accountsLoaded
          bucket.currentLastHash = cursor.currentLastHash
        } else {
          const { records, lastHash } = readAccountJournalFile(raw)
          journalRecords += records.length
          if (lastHash !== undefined) lastHashByJournal.set('prefix', lastHash)
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
      for (const segFile of this.listSegmentJournalFiles(i, active.stateRoot)) {
        const raw = fs.readFileSync(segFile)
        if (!isBinaryAccountJournalFile(raw)) continue
        const { recordCount, lastHash } = this.restoreBinaryJournalSync(raw, stateManager)
        journalRecords += recordCount
        restored += recordCount
        const segKey = this.segmentKeyFromPath(segFile)
        if (segKey !== undefined && lastHash !== undefined) {
          lastHashByJournal.set(segKey, lastHash)
        }
      }
      bucket.accountsLoaded = journalRecords
      if (saved !== undefined) {
        bucket.status = saved.status
        bucket.lastStallReason = saved.lastStallReason
        if (journalRecords === 0) {
          bucket.accountsLoaded = saved.accountsLoaded
          bucket.currentLastHash = unprefixedHexToBytes(saved.currentLastHash.slice(2))
        }
      }
      if (saved?.subRanges !== undefined) {
        this.applySavedSubRanges(bucket, saved.subRanges, lastHashByJournal)
      } else {
        this.resetPrefixCursorFromBucket(bucket)
      }
      if (((active.ethyBucketsBitmask ?? 0) & (1 << i)) !== 0) {
        bucket.status = 'done'
        bucket.subRanges = []
        bucket.currentLastHash = new Uint8Array(bucket.limitHash)
      }
      syncBucketCursorFields(bucket)
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
    this.restoredHealBlocks = this.readUnappliedHealBundles(
      BigInt(pivot.blockNumber),
      active.stateRoot,
    )
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
    if (active.lastVerifiedBlockNumber !== undefined) {
      spine.lastVerifiedBlockNumber = BigInt(active.lastVerifiedBlockNumber)
    } else if (active.baseSyncComplete === true) {
      spine.lastVerifiedBlockNumber = spine.pivotBlockNumber
    }
    spine.headBlockNumber = spine.lastVerifiedBlockNumber ?? spine.pivotBlockNumber
    spine.headStateRoot = spine.pivotStateRoot
    if (active.ethyBucketsBitmask !== undefined) {
      spine.ethyBucketsBitmask = active.ethyBucketsBitmask
    }

    const buckets = createSnapBuckets()
    const bucketsPath = path.join(this.pivotDir(active.stateRoot), 'buckets.json')
    let savedBuckets: SerializedBucket[] | undefined
    if (fs.existsSync(bucketsPath)) {
      savedBuckets = readStoredDoc<{ buckets: SerializedBucket[] }>(bucketsPath).buckets
    }
    for (let i = 0; i < buckets.length; i++) {
      const saved = savedBuckets?.find((b) => b.index === i)
      if (saved === undefined) continue
      const bucket = buckets[i]!
      bucket.status = saved.status
      bucket.lastStallReason = saved.lastStallReason
      bucket.accountsLoaded = saved.accountsLoaded
      bucket.currentLastHash = unprefixedHexToBytes(saved.currentLastHash.slice(2))
    }
    spine.snapBuckets = buckets
    if (spine.ethyBucketsBitmask === undefined || spine.ethyBucketsBitmask === 0) {
      const derivedMask = this.ethyBucketsBitmaskFromBuckets(buckets)
      if (derivedMask > 0) spine.ethyBucketsBitmask = derivedMask
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
      const saved = savedBuckets?.find((b) => b.index === i)
      const lastHashByJournal = new Map<string, Uint8Array>()
      const file = this.accountFile(i, active.stateRoot)
      let journalRecords = 0
      if (fs.existsSync(file)) {
        const stat = await fs.promises.stat(file)
        const recordCountOnDisk =
          stat.size > BINARY_ACCOUNT_JOURNAL_MAGIC.length
            ? Math.floor(
                (stat.size - BINARY_ACCOUNT_JOURNAL_MAGIC.length) /
                  BINARY_ACCOUNT_JOURNAL_RECORD_SIZE,
              )
            : 0
        const magicOk =
          stat.size >= BINARY_ACCOUNT_JOURNAL_MAGIC.length &&
          (await this.fileHasBinaryJournalMagic(file))
        if (magicOk && recordCountOnDisk > HOT_WARMUP_JOURNAL_RECORDS) {
          const { lastHash } = await this.warmBinaryJournalTail(file, stateManager)
          journalRecords += recordCountOnDisk
          restored += recordCountOnDisk
          if (lastHash !== undefined) {
            lastHashByJournal.set('prefix', lastHash)
            const cursor = journalCursorAfterRecords(
              i,
              recordCountOnDisk,
              lastHash,
              bucket.startHash,
            )
            bucket.accountsLoaded = cursor.accountsLoaded
            bucket.currentLastHash = cursor.currentLastHash
          }
        } else if (magicOk && recordCountOnDisk > 0) {
          const raw = new Uint8Array(await fs.promises.readFile(file))
          const { recordCount, lastHash } = await this.restoreBinaryJournalAsync(
            i,
            raw,
            stateManager,
            bucket,
            spine,
            maybeYield,
          )
          journalRecords += recordCount
          restored += recordCount
          if (recordCount > 0 && lastHash !== undefined) {
            lastHashByJournal.set('prefix', lastHash)
            const cursor = journalCursorAfterRecords(i, recordCount, lastHash, bucket.startHash)
            bucket.accountsLoaded = cursor.accountsLoaded
            bucket.currentLastHash = cursor.currentLastHash
          }
        } else if (stat.size > 0 && !magicOk) {
          const raw = new Uint8Array(await fs.promises.readFile(file))
          const { records, lastHash } = readAccountJournalFile(raw)
          journalRecords += records.length
          if (lastHash !== undefined) lastHashByJournal.set('prefix', lastHash)
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
      for (const segFile of this.listSegmentJournalFiles(i, active.stateRoot)) {
        const stat = await fs.promises.stat(segFile)
        const segRecords =
          stat.size > BINARY_ACCOUNT_JOURNAL_MAGIC.length
            ? Math.floor(
                (stat.size - BINARY_ACCOUNT_JOURNAL_MAGIC.length) /
                  BINARY_ACCOUNT_JOURNAL_RECORD_SIZE,
              )
            : 0
        if (segRecords <= 0 || !(await this.fileHasBinaryJournalMagic(segFile))) continue
        const segKey = this.segmentKeyFromPath(segFile)
        if (segRecords > HOT_WARMUP_JOURNAL_RECORDS) {
          const { lastHash } = await this.warmBinaryJournalTail(segFile, stateManager)
          journalRecords += segRecords
          restored += segRecords
          if (segKey !== undefined && lastHash !== undefined) {
            lastHashByJournal.set(segKey, lastHash)
          }
        } else {
          const raw = new Uint8Array(await fs.promises.readFile(segFile))
          const { recordCount, lastHash } = await this.restoreBinaryJournalAsync(
            i,
            raw,
            stateManager,
            bucket,
            spine,
            maybeYield,
          )
          journalRecords += recordCount
          restored += recordCount
          if (segKey !== undefined && lastHash !== undefined) {
            lastHashByJournal.set(segKey, lastHash)
          }
        }
      }
      bucket.accountsLoaded = journalRecords
      if (saved !== undefined) {
        bucket.status = saved.status
        bucket.lastStallReason = saved.lastStallReason
        if (journalRecords === 0) {
          bucket.accountsLoaded = saved.accountsLoaded
          bucket.currentLastHash = unprefixedHexToBytes(saved.currentLastHash.slice(2))
        }
      }
      if (saved?.subRanges !== undefined) {
        this.applySavedSubRanges(bucket, saved.subRanges, lastHashByJournal)
      } else {
        this.resetPrefixCursorFromBucket(bucket)
      }
      if (((active.ethyBucketsBitmask ?? 0) & (1 << i)) !== 0) {
        bucket.status = 'done'
        bucket.subRanges = []
        bucket.currentLastHash = new Uint8Array(bucket.limitHash)
      }
      syncBucketCursorFields(bucket)
      if (bucket.status === 'done' && !snapBucketCursorExhausted(bucket)) {
        bucket.status = 'pending'
      }
    }
    spine.snapBuckets = buckets
    const logicalTotal = buckets.reduce((sum, b) => sum + b.accountsLoaded, 0)
    stateManager.setSyncedAccountCount(logicalTotal)
    spine.totalAccountsSynced = logicalTotal
    this.loadContractScanCursor(active.stateRoot)
    if (active.previousStateRoot !== undefined && active.previousStateRoot !== null) {
      const held = this.heldAccountCount(active.previousStateRoot)
      if (held > 0) {
        spine.pivotCarry = { kind: 'previous', accounts: held }
      }
    }
    this.restoredHealBlocks = this.readUnappliedHealBundles(
      BigInt(pivot.blockNumber),
      active.stateRoot,
    )
    return restored
  }

  /** Buffered BAL blocks restored from disk for {@link BalChainStreamer.restoreBuffered}. */
  takeRestoredHealBlocks(): VerifiedBalBlock[] {
    const out = this.restoredHealBlocks
    this.restoredHealBlocks = []
    return out
  }

  /** Whether code/storage sync must still scan on-disk account journals (WP-04g). */
  contractScanRemaining(): boolean {
    if (!this.enabled || this.contractScanComplete) return false
    return this.contractScan !== undefined
  }

  /** Fraction (`0.0 .. 1.0`) of the 16 account buckets scanned by `contractScan` (WP-06f). */
  contractScanFraction(): number {
    if (!this.enabled || this.contractScanComplete) return 1
    if (this.contractScan === undefined || this.activeStateRoot === undefined) return 0
    const b = Math.min(16, Math.max(0, this.contractScan.bucket))
    if (b >= 16) return 1
    const file = this.contractScanJournalFile()
    let withinBucket = 0
    if (file !== undefined && fs.existsSync(file)) {
      try {
        const size = fs.statSync(file).size
        if (size > BINARY_ACCOUNT_JOURNAL_MAGIC.length) {
          withinBucket = Math.min(
            1,
            Math.max(
              0,
              (this.contractScan.byteOffset - BINARY_ACCOUNT_JOURNAL_MAGIC.length) /
                (size - BINARY_ACCOUNT_JOURNAL_MAGIC.length),
            ),
          )
        }
      } catch {
        // ignore stat error
      }
    }
    return (b + withinBucket) / 16
  }

  hasPersistedCode(codeHash: Uint8Array): boolean {
    return this.persistedCodeHashes.has(bytesToHex(codeHash).slice(2).toLowerCase())
  }

  hasPersistedStorageAccount(accountHash: Uint8Array): boolean {
    return this.persistedStorageAccounts.has(bytesToHex(accountHash).slice(2).toLowerCase())
  }

  /** Arm on-disk journal contract scan when live ingest exceeds in-memory contract task cap. */
  enableContractScan(): void {
    if (!this.enabled || this.contractScanComplete || this.contractScan !== undefined) return
    this.contractScan = { bucket: 0, byteOffset: BINARY_ACCOUNT_JOURNAL_MAGIC.length }
  }

  /** Pull the next window of contract rows from sorted bucket journals. */
  nextContractScanBatch(maxRows: number): IngestedAccountMeta[] {
    if (!this.enabled || this.activeStateRoot === undefined || this.contractScanComplete) {
      return []
    }
    if (this.contractScan === undefined) {
      this.contractScan = { bucket: 0, byteOffset: BINARY_ACCOUNT_JOURNAL_MAGIC.length }
    }
    const out: IngestedAccountMeta[] = []
    const rowSize = BINARY_ACCOUNT_JOURNAL_RECORD_SIZE
    const chunkRows = 512
    const chunkBuf = Buffer.alloc(chunkRows * rowSize)
    while (out.length < maxRows && this.contractScan.bucket < 16) {
      const file = this.contractScanJournalFile()
      if (file === undefined || !fs.existsSync(file)) {
        this.advanceContractScanToNextJournal()
        continue
      }
      const stat = fs.statSync(file)
      if (stat.size <= this.contractScan.byteOffset) {
        this.advanceContractScanToNextJournal()
        continue
      }
      const fd = fs.openSync(file, 'r')
      try {
        while (out.length < maxRows && this.contractScan.byteOffset + rowSize <= stat.size) {
          const remainingBytes = stat.size - this.contractScan.byteOffset
          const rowsToRead = Math.min(chunkRows, Math.floor(remainingBytes / rowSize))
          if (rowsToRead <= 0) break
          const bytesToRead = rowsToRead * rowSize
          const n = fs.readSync(fd, chunkBuf, 0, bytesToRead, this.contractScan.byteOffset)
          const rowsRead = Math.floor(n / rowSize)
          if (rowsRead <= 0) break
          for (let r = 0; r < rowsRead; r++) {
            const base = r * rowSize
            this.contractScan.byteOffset += rowSize
            const binaryAccount = chunkBuf.subarray(base + 32, base + rowSize)
            if (
              !isBinaryAccountContract(binaryAccount) &&
              isBinaryAccountEmptyStorage(binaryAccount)
            ) {
              continue
            }
            out.push({
              accountHash: new Uint8Array(chunkBuf.subarray(base, base + 32)),
              codeHash: new Uint8Array(getBinaryAccountCodeHash(binaryAccount)),
              storageRoot: new Uint8Array(getBinaryAccountStorageRoot(binaryAccount)),
            })
            if (out.length >= maxRows) break
          }
        }
      } finally {
        fs.closeSync(fd)
      }
      if (this.contractScan.byteOffset + rowSize > stat.size) {
        this.advanceContractScanToNextJournal()
      }
    }
    if (this.contractScan !== undefined && this.contractScan.bucket >= 16) {
      this.contractScanComplete = true
      this.contractScan = undefined
      this.persistContractScanCursor()
    }
    return out
  }

  private resetPrefixCursorFromBucket(bucket: SnapBucket): void {
    if (compareBytes32(bucket.currentLastHash, bucket.limitHash) >= 0) {
      bucket.subRanges = []
      return
    }
    bucket.subRanges = [
      newPrefixCursor(bucket.index, bucket.currentLastHash, bucket.limitHash, bucket.index),
    ]
  }

  private segmentKeyFromPath(filePath: string): string | undefined {
    const base = path.basename(filePath)
    if (!base.endsWith('.seg')) return undefined
    const dot = base.indexOf('.')
    if (dot < 0) return undefined
    return base.slice(dot + 1, -4)
  }

  private applySavedSubRanges(
    bucket: SnapBucket,
    saved: SerializedSubRange[],
    lastHashByJournal: ReadonlyMap<string, Uint8Array>,
  ): void {
    if (saved.length === 0) {
      bucket.subRanges = []
      bucket.currentLastHash = new Uint8Array(bucket.limitHash)
      return
    }
    const ranges: SnapRangeCursor[] = []
    for (let idx = 0; idx < saved.length; idx++) {
      const s = saved[idx]!
      const journal = s.journal === 'prefix' ? 'prefix' : s.journal
      let origin = unprefixedHexToBytes(s.origin.replace(/^0x/i, ''))
      const limit = unprefixedHexToBytes(s.limit.replace(/^0x/i, ''))
      const lastHash = lastHashByJournal.get(journal)
      if (lastHash !== undefined) {
        const next = incrementKey32(lastHash)
        if (compareBytes32(next, origin) > 0) {
          origin = next
        }
      }
      if (compareBytes32(origin, limit) <= 0) {
        ranges.push({
          id: bucket.index * 1000 + idx,
          bucketIndex: bucket.index,
          origin,
          limit,
          journal,
        })
      }
    }
    bucket.subRanges = ranges
  }

  private contractScanJournalFile(): string | undefined {
    if (this.activeStateRoot === undefined || this.contractScan === undefined) return undefined
    const journal = this.contractScan.segment ?? 'prefix'
    return this.accountJournalPath(this.contractScan.bucket, this.activeStateRoot, journal)
  }

  private advanceContractScanToNextJournal(): void {
    if (this.contractScan === undefined || this.activeStateRoot === undefined) return
    const segments = this.listSegmentJournalFiles(this.contractScan.bucket, this.activeStateRoot)
      .map((f) => this.segmentKeyFromPath(f))
      .filter((k): k is string => k !== undefined)
    if (this.contractScan.segment === undefined) {
      if (segments.length > 0) {
        this.contractScan.segment = segments[0]!
        this.contractScan.byteOffset = BINARY_ACCOUNT_JOURNAL_MAGIC.length
        return
      }
      this.contractScan.bucket++
      this.contractScan.byteOffset = BINARY_ACCOUNT_JOURNAL_MAGIC.length
      return
    }
    const curIdx = segments.indexOf(this.contractScan.segment)
    if (curIdx >= 0 && curIdx + 1 < segments.length) {
      this.contractScan.segment = segments[curIdx + 1]!
      this.contractScan.byteOffset = BINARY_ACCOUNT_JOURNAL_MAGIC.length
      return
    }
    this.contractScan.bucket++
    this.contractScan.segment = undefined
    this.contractScan.byteOffset = BINARY_ACCOUNT_JOURNAL_MAGIC.length
  }

  private buildCodeShardIndex(file: string): Map<string, { offset: number; length: number }> {
    const entries = new Map<string, { offset: number; length: number }>()
    try {
      const stat = fs.statSync(file)
      const fd = fs.openSync(file, 'r')
      const header = Buffer.alloc(36)
      try {
        let offset = 0
        while (offset + 36 <= stat.size) {
          const n = fs.readSync(fd, header, 0, 36, offset)
          if (n < 36) break
          const hashHex = header.subarray(0, 32).toString('hex')
          const len = header.readUInt32BE(32)
          entries.set(hashHex, { offset: offset + 36, length: len })
          offset += 36 + len
        }
      } finally {
        fs.closeSync(fd)
      }
    } catch {
      // ignore malformed shard
    }
    return entries
  }

  /** Cold bytecode lookup for {@link FlatStateManager} (`code/shard-*.bin` journals). */
  lookupCodeByHash(codeHash: Uint8Array): Uint8Array | undefined {
    if (!this.enabled) return undefined
    if (this.activeStateRoot === undefined) {
      const active = this.readActive()
      if (active === undefined) return undefined
      this.activeStateRoot = active.stateRoot
    }
    const shard = codeHash[0]!.toString(16).padStart(2, '0')
    const file = path.join(this.pivotDir(this.activeStateRoot), 'code', `shard-${shard}.bin`)
    if (!fs.existsSync(file)) return undefined
    const hashHex = bytesToHex(codeHash).slice(2).toLowerCase()
    const stat = fs.statSync(file)
    let cached = this.codeLookupIndex.get(file)
    if (cached === undefined || cached.fileSize !== stat.size) {
      cached = { fileSize: stat.size, entries: this.buildCodeShardIndex(file) }
      this.codeLookupIndex.set(file, cached)
    }
    const entry = cached.entries.get(hashHex)
    if (entry === undefined) return undefined
    const fd = fs.openSync(file, 'r')
    const buf = Buffer.alloc(entry.length)
    try {
      const n = fs.readSync(fd, buf, 0, entry.length, entry.offset)
      if (n < entry.length) return undefined
      return new Uint8Array(buf)
    } finally {
      fs.closeSync(fd)
    }
  }

  sampleAccountsFromDisk(opts: {
    prefixHex?: string
    limit: number
    sortByBalanceDesc?: boolean
  }): Array<{ accountHash: Uint8Array; account: Account }> {
    if (!this.enabled || opts.limit <= 0) return []
    if (this.activeStateRoot === undefined) {
      const active = this.readActive()
      if (active === undefined) return []
      this.activeStateRoot = active.stateRoot
    }
    const prefix = opts.prefixHex?.trim().replace(/^0x/i, '').toLowerCase() ?? ''
    const nibble = prefix.length > 0 ? Number.parseInt(prefix.slice(0, 1), 16) : undefined
    const buckets =
      nibble !== undefined && !Number.isNaN(nibble)
        ? [nibble]
        : Array.from({ length: 16 }, (_, i) => i)
    const rows: Array<{ accountHash: Uint8Array; account: Account }> = []
    const rowSize = BINARY_ACCOUNT_JOURNAL_RECORD_SIZE
    const payloadStart = BINARY_ACCOUNT_JOURNAL_MAGIC.length
    const isTopBalanceScan = opts.sortByBalanceDesc === true
    for (const bucket of buckets) {
      if (!isTopBalanceScan && rows.length >= opts.limit) break
      const files = [
        this.accountFile(bucket, this.activeStateRoot),
        ...this.listSegmentJournalFiles(bucket, this.activeStateRoot),
      ]
      for (const file of files) {
        if (!isTopBalanceScan && rows.length >= opts.limit) break
        if (!fs.existsSync(file)) continue
        const stat = fs.statSync(file)
        const recordCount = Math.floor((stat.size - payloadStart) / rowSize)
        if (recordCount <= 0) continue
        const want = Math.min(recordCount, isTopBalanceScan ? 256 : opts.limit - rows.length)
        const start = isTopBalanceScan
          ? Math.max(payloadStart, stat.size - want * rowSize)
          : payloadStart
        const maxPerFile = isTopBalanceScan ? want : opts.limit - rows.length
        let readInFile = 0
        const fd = fs.openSync(file, 'r')
        const rowBuf = Buffer.alloc(rowSize)
        try {
          for (
            let offset = start;
            offset + rowSize <= stat.size && readInFile < maxPerFile;
            offset += rowSize
          ) {
            fs.readSync(fd, rowBuf, 0, rowSize, offset)
            const accountHash = new Uint8Array(rowBuf.subarray(0, 32))
            const hashHex = bytesToHex(accountHash).slice(2).toLowerCase()
            if (prefix.length > 0 && !hashHex.startsWith(prefix)) continue
            const account = binaryAccountToAccount(new Uint8Array(rowBuf.subarray(32, rowSize)))
            rows.push({ accountHash, account })
            readInFile++
          }
        } finally {
          fs.closeSync(fd)
        }
      }
    }
    if (isTopBalanceScan && rows.length > 1) {
      rows.sort((a, b) => (a.account.balance > b.account.balance ? -1 : 1))
    }
    return rows.slice(0, opts.limit)
  }

  /** Cold account lookup for {@link FlatStateManager} (sorted binary journals). */
  lookupBinaryAccountByHash(accountHash: Uint8Array): Uint8Array | undefined {
    if (!this.enabled) return undefined
    if (this.activeStateRoot === undefined) {
      const active = this.readActive()
      if (active === undefined) return undefined
      this.activeStateRoot = active.stateRoot
      this.seedInitializedAccountFiles(active.stateRoot)
    }
    const nibble = accountHash[0]! >> 4
    const files = [
      this.accountFile(nibble, this.activeStateRoot),
      ...this.listSegmentJournalFiles(nibble, this.activeStateRoot),
    ]
    for (const file of files) {
      const hit = this.lookupBinaryAccountInFile(file, accountHash)
      if (hit !== undefined) return hit
    }
    return undefined
  }

  private lookupBinaryAccountInFile(file: string, accountHash: Uint8Array): Uint8Array | undefined {
    let fd = this.lookupFdCache.get(file)
    if (fd === undefined) {
      if (!fs.existsSync(file)) return undefined
      try {
        fd = fs.openSync(file, 'r')
        this.lookupFdCache.set(file, fd)
      } catch {
        return undefined
      }
    }
    let size = 0
    try {
      size = fs.fstatSync(fd).size
    } catch {
      try {
        fs.closeSync(fd)
      } catch {
        // ignore
      }
      this.lookupFdCache.delete(file)
      return undefined
    }
    const payloadStart = BINARY_ACCOUNT_JOURNAL_MAGIC.length
    const rowSize = BINARY_ACCOUNT_JOURNAL_RECORD_SIZE
    const recordCount = Math.floor((size - payloadStart) / rowSize)
    if (recordCount <= 0) return undefined
    const rowBuf = this.lookupRowScratch
    let lo = 0
    let hi = recordCount - 1
    while (lo <= hi) {
      const mid = (lo + hi) >>> 1
      const offset = payloadStart + mid * rowSize
      fs.readSync(fd, rowBuf, 0, rowSize, offset)
      const midHash = rowBuf.subarray(0, 32)
      const cmp = compareBytes32(midHash, accountHash)
      if (cmp === 0) {
        return new Uint8Array(rowBuf.subarray(32, rowSize))
      }
      if (cmp < 0) lo = mid + 1
      else hi = mid - 1
    }
    return undefined
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
    const countedSavedBuckets = new Set<number>()
    let total = 0
    for (const name of fs.readdirSync(accountsDir)) {
      const isPrefix = /^[0-9a-f]\.bin$/i.test(name)
      const isSegment = /^[0-9a-f]\..+\.seg$/i.test(name)
      if (!isPrefix && !isSegment) continue
      const filePath = path.join(accountsDir, name)
      if (fs.statSync(filePath).size === 0) continue
      const index = Number.parseInt(name.slice(0, 1), 16)
      const row = saved?.find((b) => b.index === index)
      if (row !== undefined && row.accountsLoaded > 0) {
        if (!countedSavedBuckets.has(index)) {
          countedSavedBuckets.add(index)
          total += row.accountsLoaded
        }
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
    if (prior !== undefined && prior.stateRoot.toLowerCase() === stateRootHex.toLowerCase()) {
      writeAtomicDoc(path.join(this.networkDir, 'active.json'), {
        ...prior,
        stateRoot: stateRootHex,
        previousStateRoot,
      } satisfies ActiveMeta)
    } else {
      writeAtomicDoc(path.join(this.networkDir, 'active.json'), {
        stateRoot: stateRootHex,
        previousStateRoot,
      } satisfies ActiveMeta)
    }
    this.activeStateRoot = stateRootHex
    this.seedInitializedAccountFiles(stateRootHex)
    this.prunePivots(stateRootHex, previousStateRoot)
  }

  private seedInitializedAccountFiles(stateRootHex: string): void {
    this.initializedAccountFiles.clear()
    for (const fd of this.lookupFdCache.values()) {
      try {
        fs.closeSync(fd)
      } catch {
        // ignore
      }
    }
    this.lookupFdCache.clear()
    const dir = path.join(this.pivotDir(stateRootHex), 'accounts')
    if (!fs.existsSync(dir)) return
    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith('.bin') && !name.endsWith('.seg')) continue
      const file = path.join(dir, name)
      try {
        if (fs.statSync(file).size > 0) this.initializedAccountFiles.add(file)
      } catch {
        // race with concurrent append
      }
    }
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
    bucketIndex: number,
    raw: Uint8Array,
    stateManager: FlatStateManager,
    bucket: SnapBucket,
    spine: EthySpine,
    maybeYield: () => Promise<void>,
  ): Promise<{ recordCount: number; lastHash?: Uint8Array }> {
    let recordCount = 0
    let lastHash: Uint8Array | undefined
    // 1,000 rows stays inside the main-thread turn budget under v8 coverage.
    // A 4,000-row slab was ~40ms on the CI coverage job.
    await forEachBinaryJournalBatch(raw, 1000, async (slab, lastHashInBatch) => {
      stateManager.putSnapBinaryAccountsFromSlab(slab)
      this.pushContractRowsFromSlab(slab)
      const batchRows = slab.length / 136
      recordCount += batchRows
      lastHash = lastHashInBatch
      const cursor = journalCursorAfterRecords(
        bucketIndex,
        recordCount,
        lastHashInBatch,
        bucket.startHash,
      )
      bucket.accountsLoaded = cursor.accountsLoaded
      bucket.currentLastHash = cursor.currentLastHash
      spine.totalAccountsSynced = stateManager.accountCount()
      await maybeYield()
    })
    return { recordCount, lastHash }
  }

  /** Active pivot `accounts/` directory for ETHY/0 worker serving (WP-06c). */
  activePivotAccountsDir(): string | undefined {
    if (!this.enabled || this.activeStateRoot === undefined) return undefined
    return path.join(this.pivotDir(this.activeStateRoot), 'accounts')
  }

  ethyBucketsBitmaskFromBuckets(buckets: readonly SnapBucket[]): number {
    let mask = 0
    for (const b of buckets) {
      if (b.status === 'done') mask |= 1 << b.index
    }
    return mask
  }

  persistEthyBucketsBitmask(mask: number): void {
    if (!this.enabled) return
    const active = this.readActive()
    if (active === undefined) return
    writeAtomicDoc(path.join(this.networkDir, 'active.json'), {
      ...active,
      ethyBucketsBitmask: mask,
    } satisfies ActiveMeta)
  }

  /** Live path: one async append per verified account slab (magic prefix on empty file). */
  appendVerifiedSlabAsync(
    bucketIndex: number,
    slab: Uint8Array,
    buckets: SnapBucket[],
    journal: 'prefix' | string = 'prefix',
    proof?: ChunkProofFields,
  ): Promise<void> {
    if (!this.enabled || this.activeStateRoot === undefined || slab.length === 0) {
      return Promise.resolve()
    }
    this.lastBuckets = buckets
    const file = this.accountJournalPath(bucketIndex, this.activeStateRoot, journal)
    const needMagic = !this.initializedAccountFiles.has(file)
    if (needMagic) this.initializedAccountFiles.add(file)
    const prior = this.accountWriteChains.get(file) ?? Promise.resolve()
    const next = prior.then(async () => {
      try {
        const priorSize = fs.existsSync(file) ? fs.statSync(file).size : 0
        const slabByteOffset = needMagic
          ? priorSize + BINARY_ACCOUNT_JOURNAL_MAGIC.length
          : priorSize
        const body = needMagic
          ? Buffer.concat([Buffer.from(BINARY_ACCOUNT_JOURNAL_MAGIC), Buffer.from(slab)])
          : slab
        await fs.promises.appendFile(file, body)
        if (proof !== undefined) {
          const proofFile = proofSidecarPathForJournal(file)
          appendProofRecordSync(proofFile, {
            ...proof,
            slabByteOffset,
            slabByteLength: slab.length,
          })
        }
        this.dirtyAccountBuckets.add(bucketIndex)
        this.pendingMetadataFlush = true
        this.maybeFlushMetadata(false)
      } catch (err) {
        if (needMagic) this.initializedAccountFiles.delete(file)
        throw err
      }
    })
    this.accountWriteChains.set(file, next)
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
      if (force) {
        this.flushBuckets(this.lastBuckets)
      } else {
        void this.flushBucketsAsync(this.lastBuckets)
      }
    }
    const dirty = [...this.dirtyAccountBuckets]
    this.dirtyAccountBuckets.clear()
    this.pendingMetadataFlush = false
    this.lastMetadataFlushAt = now
    if (force) {
      for (const bucketIndex of dirty) this.fsyncBucketSync(bucketIndex)
    }
  }

  private flushBucketsAsync(buckets: SnapBucket[]): Promise<void> {
    if (!this.enabled || this.activeStateRoot === undefined) return Promise.resolve()
    this.lastBuckets = buckets
    const dir = this.pivotDir(this.activeStateRoot)
    const filePath = path.join(dir, 'buckets.json')
    const payload = `${JSON.stringify({ buckets: serializeBuckets(buckets) }, null, 2)}\n`
    const run = async () => {
      await fs.promises.mkdir(dir, { recursive: true })
      const tmp = `${filePath}.${process.pid}.${++atomicDocSeq}.tmp`
      await fs.promises.writeFile(tmp, payload, 'utf8')
      try {
        await fs.promises.rename(tmp, filePath)
      } catch (err) {
        const code = (err as NodeJS.ErrnoException).code
        if (code !== 'ENOENT') throw err
      }
    }
    this.bucketsFlushInFlight = (this.bucketsFlushInFlight ?? Promise.resolve()).then(run)
    return this.bucketsFlushInFlight
  }

  private fsyncBucketSync(bucketIndex: number): void {
    if (this.activeStateRoot === undefined) return
    const files = [
      this.accountFile(bucketIndex, this.activeStateRoot),
      ...this.listSegmentJournalFiles(bucketIndex, this.activeStateRoot),
    ]
    for (const file of files) {
      if (!fs.existsSync(file)) continue
      const fd = fs.openSync(file, 'r')
      try {
        fs.fsyncSync(fd)
      } finally {
        fs.closeSync(fd)
      }
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
    const dir = this.pivotDir(this.activeStateRoot)
    const filePath = path.join(dir, 'buckets.json')
    if (this.bucketsFlushInFlight !== undefined) {
      this.bucketsFlushInFlight = this.bucketsFlushInFlight.then(() => {
        writeAtomicDoc(filePath, {
          buckets: serializeBuckets(buckets),
        })
      })
      return
    }
    writeAtomicDoc(filePath, {
      buckets: serializeBuckets(buckets),
    })
  }

  /** Wait for in-flight `storage/shard-*.bin` appends (tests). */
  async flushStorageWrites(): Promise<void> {
    await Promise.all([...this.storageWriteChains.values()])
  }

  /** Wait for async journal appends and bucket metadata flushes (tests and clean shutdown). */
  async drainPendingFlushes(): Promise<void> {
    await Promise.all([...this.accountWriteChains.values()])
    await Promise.all([...this.codeWriteChains.values(), ...this.storageWriteChains.values()])
    if (this.bucketsFlushInFlight !== undefined) {
      await this.bucketsFlushInFlight
      this.bucketsFlushInFlight = undefined
    }
  }

  flushAll(buckets: SnapBucket[]): void {
    this.flushBuckets(buckets)
    this.maybeFlushMetadata(true)
  }

  appendCode(codeHash: Uint8Array, code: Uint8Array): void {
    if (!this.enabled || this.activeStateRoot === undefined) return
    const hex = bytesToHex(codeHash).slice(2).toLowerCase()
    this.persistedCodeHashes.add(hex)
    const pivot = this.pivotDir(this.activeStateRoot)
    const shard = codeHash[0]!.toString(16).padStart(2, '0')
    const file = path.join(pivot, 'code', `shard-${shard}.bin`)
    const record = new Uint8Array(32 + 4 + code.length)
    record.set(codeHash, 0)
    new DataView(record.buffer, record.byteOffset + 32, 4).setUint32(0, code.length, false)
    record.set(code, 36)
    const prior = this.codeWriteChains.get(file) ?? Promise.resolve()
    const next = prior.then(async () => {
      await fs.promises.mkdir(path.dirname(file), { recursive: true })
      await fs.promises.appendFile(file, record)
    })
    this.codeWriteChains.set(file, next)
    void next.catch(() => {
      if (this.codeWriteChains.get(file) === next) this.codeWriteChains.delete(file)
    })
  }

  appendHealBal(blockNumber: bigint, balRlp: Uint8Array): void {
    if (!this.enabled || this.activeStateRoot === undefined || balRlp.length === 0) return
    const healDir = path.join(this.pivotDir(this.activeStateRoot), 'heal')
    fs.mkdirSync(healDir, { recursive: true })
    const file = path.join(healDir, `${blockNumber.toString()}.bal`)
    fs.writeFileSync(file, balRlp)
  }

  /** Persist a verified block+BAL bundle for snap-stream resume (WP-06d). */
  appendHealBundle(entry: VerifiedBalBlock): void {
    if (!this.enabled || this.activeStateRoot === undefined) return
    if (entry.balRlp === undefined || entry.balRlp.length === 0) return
    const healDir = path.join(this.pivotDir(this.activeStateRoot), 'heal')
    fs.mkdirSync(healDir, { recursive: true })
    const file = path.join(healDir, `${entry.blockNumber.toString()}.bundle.rlp`)
    const body = encodeHealBundleRlp({
      blockNumber: entry.blockNumber,
      blockHash: entry.blockHash,
      stateRoot: entry.stateRoot,
      headerRlp: entry.headerRlp,
      balRlp: entry.balRlp,
    })
    fs.writeFileSync(file, body)
  }

  pruneHealBundlesUpTo(blockNumber: bigint): void {
    if (!this.enabled || this.activeStateRoot === undefined) return
    const healDir = path.join(this.pivotDir(this.activeStateRoot), 'heal')
    if (!fs.existsSync(healDir)) return
    for (const name of fs.readdirSync(healDir)) {
      const n = name.endsWith('.bundle.rlp')
        ? BigInt(name.replace(/\.bundle\.rlp$/, ''))
        : name.endsWith('.bal')
          ? BigInt(name.replace(/\.bal$/, ''))
          : undefined
      if (n !== undefined && n <= blockNumber) {
        try {
          fs.unlinkSync(path.join(healDir, name))
        } catch {
          // already removed
        }
      }
    }
  }

  private readUnappliedHealBundles(pivotBlock: bigint, stateRootHex: string): VerifiedBalBlock[] {
    const healDir = path.join(this.pivotDir(stateRootHex), 'heal')
    if (!fs.existsSync(healDir)) return []
    const bundleNames = fs
      .readdirSync(healDir)
      .filter((n) => n.endsWith('.bundle.rlp'))
      .sort((a, b) => {
        const na = BigInt(a.replace(/\.bundle\.rlp$/, ''))
        const nb = BigInt(b.replace(/\.bundle\.rlp$/, ''))
        return na < nb ? -1 : na > nb ? 1 : 0
      })
    const out: VerifiedBalBlock[] = []
    let expect = pivotBlock + 1n
    for (const name of bundleNames) {
      const blockNumber = BigInt(name.replace(/\.bundle\.rlp$/, ''))
      if (blockNumber <= pivotBlock) continue
      if (blockNumber !== expect) break
      const raw = new Uint8Array(fs.readFileSync(path.join(healDir, name)))
      const decoded = decodeHealBundleRlp(raw)
      if (decoded === undefined) break
      out.push(decoded)
      expect = blockNumber + 1n
    }
    return out
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

  private async fileHasBinaryJournalMagic(file: string): Promise<boolean> {
    const head = Buffer.alloc(BINARY_ACCOUNT_JOURNAL_MAGIC.length)
    const fd = await fs.promises.open(file, 'r')
    try {
      await fd.read(head, 0, head.length, 0)
    } finally {
      await fd.close()
    }
    for (let i = 0; i < BINARY_ACCOUNT_JOURNAL_MAGIC.length; i++) {
      if (head[i] !== BINARY_ACCOUNT_JOURNAL_MAGIC[i]) return false
    }
    return true
  }

  private async warmBinaryJournalTail(
    file: string,
    stateManager: FlatStateManager,
  ): Promise<{ lastHash?: Uint8Array }> {
    const stat = await fs.promises.stat(file)
    const payloadStart = BINARY_ACCOUNT_JOURNAL_MAGIC.length
    const rowSize = BINARY_ACCOUNT_JOURNAL_RECORD_SIZE
    const recordCount = Math.floor((stat.size - payloadStart) / rowSize)
    const tailRows = Math.min(TAIL_WARMUP_JOURNAL_RECORDS, recordCount)
    const tailStart = payloadStart + (recordCount - tailRows) * rowSize
    const buf = Buffer.alloc(tailRows * rowSize)
    const fd = await fs.promises.open(file, 'r')
    try {
      await fd.read(buf, 0, buf.length, tailStart)
    } finally {
      await fd.close()
    }
    stateManager.putSnapBinaryAccountsFromSlab(new Uint8Array(buf))
    const lastRowOffset = (tailRows - 1) * rowSize
    const lastHash = new Uint8Array(buf.subarray(lastRowOffset, lastRowOffset + 32))
    return { lastHash }
  }

  private contractScanPath(stateRootHex: string): string {
    return path.join(this.pivotDir(stateRootHex), 'contract-scan.json')
  }

  private loadContractScanCursor(stateRootHex: string): void {
    this.contractScanComplete = false
    this.contractProgress = undefined
    this.persistedCodeHashes.clear()
    this.persistedStorageAccounts.clear()
    this.indexExistingCodeAndStorageDirs(stateRootHex)
    const p = this.contractScanPath(stateRootHex)
    if (!fs.existsSync(p)) {
      this.contractScan = { bucket: 0, byteOffset: BINARY_ACCOUNT_JOURNAL_MAGIC.length }
      if (this.persistedCodeHashes.size > 0 || this.persistedStorageAccounts.size > 0) {
        this.contractProgress = {
          codesTotal: this.persistedCodeHashes.size,
          codesSynced: this.persistedCodeHashes.size,
          storageAccountsTotal: this.persistedStorageAccounts.size,
          storageAccountsSynced: this.persistedStorageAccounts.size,
          storageSlotsSynced: 0,
        }
      }
      return
    }
    try {
      const doc = readStoredDoc<{
        bucket: number
        byteOffset: number
        segment?: string
        done?: boolean
        codesTotal?: number
        codesSynced?: number
        storageAccountsTotal?: number
        storageAccountsSynced?: number
        storageSlotsSynced?: number
      }>(p)
      if (
        doc.codesTotal !== undefined ||
        doc.codesSynced !== undefined ||
        doc.storageAccountsTotal !== undefined ||
        this.persistedCodeHashes.size > 0 ||
        this.persistedStorageAccounts.size > 0
      ) {
        const codesSynced = Math.max(doc.codesSynced ?? 0, this.persistedCodeHashes.size)
        const storageAccountsSynced = Math.max(
          doc.storageAccountsSynced ?? 0,
          this.persistedStorageAccounts.size,
        )
        this.contractProgress = {
          codesTotal: Math.max(doc.codesTotal ?? 0, codesSynced),
          codesSynced,
          storageAccountsTotal: Math.max(doc.storageAccountsTotal ?? 0, storageAccountsSynced),
          storageAccountsSynced,
          storageSlotsSynced: doc.storageSlotsSynced ?? 0,
        }
      }
      if (doc.done === true) {
        this.contractScanComplete = true
        this.contractScan = undefined
        return
      }
      this.contractScan = {
        bucket: doc.bucket ?? 0,
        byteOffset: doc.byteOffset ?? BINARY_ACCOUNT_JOURNAL_MAGIC.length,
        segment: doc.segment,
      }
    } catch {
      this.contractScan = { bucket: 0, byteOffset: BINARY_ACCOUNT_JOURNAL_MAGIC.length }
    }
  }

  private indexExistingCodeAndStorageDirs(stateRootHex: string): void {
    const dir = this.pivotDir(stateRootHex)
    const codeDir = path.join(dir, 'code')
    if (fs.existsSync(codeDir)) {
      try {
        for (const name of fs.readdirSync(codeDir)) {
          if (name.endsWith('.bin') && name.length === 68 && !name.startsWith('shard-')) {
            this.persistedCodeHashes.add(name.slice(0, 64).toLowerCase())
          } else if (name.startsWith('shard-') && name.endsWith('.bin')) {
            this.scanCodeShardHashes(path.join(codeDir, name))
          }
        }
      } catch {
        // ignore read error
      }
    }
    const storageDir = path.join(dir, 'storage')
    if (fs.existsSync(storageDir)) {
      try {
        for (const name of fs.readdirSync(storageDir)) {
          if (name.endsWith('.bin') && name.length === 68 && !name.startsWith('shard-')) {
            this.persistedStorageAccounts.add(name.slice(0, 64).toLowerCase())
          } else if (name.startsWith('shard-') && name.endsWith('.bin')) {
            const batches = this.buildStorageShardBatchIndex(path.join(storageDir, name))
            if (batches !== undefined) {
              for (const b of batches) {
                this.persistedStorageAccounts.add(b.accountHashHex)
              }
            }
          }
        }
      } catch {
        // ignore read error
      }
    }
  }

  private scanCodeShardHashes(filePath: string): void {
    try {
      const stat = fs.statSync(filePath)
      if (stat.size < 36) return
      const fd = fs.openSync(filePath, 'r')
      const header = Buffer.alloc(36)
      try {
        let offset = 0
        while (offset + 36 <= stat.size) {
          const n = fs.readSync(fd, header, 0, 36, offset)
          if (n < 36) break
          const hashHex = header.subarray(0, 32).toString('hex')
          const len = header.readUInt32BE(32)
          this.persistedCodeHashes.add(hashHex)
          offset += 36 + len
        }
      } finally {
        fs.closeSync(fd)
      }
    } catch {
      // ignore malformed tail
    }
  }

  /** Restored contract counters for {@link SnapCodeAndStorageSynchronizer} (WP-06f). */
  takeContractProgress():
    | {
        codesTotal: number
        codesSynced: number
        storageAccountsTotal: number
        storageAccountsSynced: number
        storageSlotsSynced: number
      }
    | undefined {
    return this.contractProgress
  }

  persistContractProgress(
    codesTotal: number,
    codesSynced: number,
    storageAccountsTotal: number,
    storageAccountsSynced: number,
    storageSlotsSynced: number,
  ): void {
    this.contractProgress = {
      codesTotal,
      codesSynced,
      storageAccountsTotal,
      storageAccountsSynced,
      storageSlotsSynced,
    }
    this.persistContractScanCursor()
  }

  private persistContractScanCursor(): void {
    if (!this.enabled || this.activeStateRoot === undefined) return
    const p = this.contractScanPath(this.activeStateRoot)
    const progress = this.contractProgress
    if (this.contractScanComplete) {
      writeAtomicDoc(p, {
        done: true,
        ...(progress ?? {}),
      })
      return
    }
    if (this.contractScan === undefined) return
    writeAtomicDoc(p, {
      bucket: this.contractScan.bucket,
      byteOffset: this.contractScan.byteOffset,
      segment: this.contractScan.segment,
      ...(progress ?? {}),
    })
  }

  appendStorageSlots(
    accountHash: Uint8Array,
    slots: Array<{ slotHash: Uint8Array; value: Uint8Array }>,
  ): Promise<void> {
    if (!this.enabled || this.activeStateRoot === undefined || slots.length === 0) {
      return Promise.resolve()
    }
    this.persistedStorageAccounts.add(bytesToHex(accountHash).slice(2).toLowerCase())
    const pivot = this.pivotDir(this.activeStateRoot)
    const shard = accountHash[0]!.toString(16).padStart(2, '0')
    const file = path.join(pivot, 'storage', `shard-${shard}.bin`)
    const bodyLen = 32 + slots.reduce((sum, s) => sum + 32 + 4 + s.value.length, 0)
    const batch = new Uint8Array(8 + bodyLen)
    batch.set(STORAGE_BATCH_MAGIC, 0)
    new DataView(batch.buffer, batch.byteOffset + 4, 4).setUint32(0, slots.length, false)
    let off = 8
    batch.set(accountHash, off)
    off += 32
    for (const { slotHash, value } of slots) {
      batch.set(slotHash, off)
      off += 32
      new DataView(batch.buffer, batch.byteOffset + off, 4).setUint32(0, value.length, false)
      off += 4
      batch.set(value, off)
      off += value.length
    }
    const prior = this.storageWriteChains.get(file) ?? Promise.resolve()
    const next = prior.then(async () => {
      await fs.promises.mkdir(path.dirname(file), { recursive: true })
      await fs.promises.appendFile(file, batch)
      this.storageLookupIndex.delete(file)
    })
    this.storageWriteChains.set(file, next)
    const tracked = next.catch(() => {
      if (this.storageWriteChains.get(file) === next) this.storageWriteChains.delete(file)
    })
    return tracked
  }

  private storageShardFile(accountHash: Uint8Array): string | undefined {
    if (!this.enabled) return undefined
    if (this.activeStateRoot === undefined) {
      const active = this.readActive()
      if (active === undefined) return undefined
      this.activeStateRoot = active.stateRoot
    }
    const shard = accountHash[0]!.toString(16).padStart(2, '0')
    return path.join(this.pivotDir(this.activeStateRoot), 'storage', `shard-${shard}.bin`)
  }

  private buildStorageShardBatchIndex(file: string): StorageBatchSpan[] | undefined {
    try {
      const stat = fs.statSync(file)
      if (stat.size < 8) return undefined
      const batches: StorageBatchSpan[] = []
      let offset = 0
      const header = Buffer.alloc(8)
      const row = Buffer.alloc(36)
      const magic = Buffer.alloc(4)
      const fd = fs.openSync(file, 'r')
      try {
        const mn = fs.readSync(fd, magic, 0, 4, 0)
        if (mn < 4 || !equalsBytes(new Uint8Array(magic), STORAGE_BATCH_MAGIC)) {
          return undefined
        }
        while (offset + 8 <= stat.size) {
          const hn = fs.readSync(fd, header, 0, 8, offset)
          if (hn < 8) break
          if (!equalsBytes(new Uint8Array(header.subarray(0, 4)), STORAGE_BATCH_MAGIC)) break
          const slotCount = header.readUInt32BE(4)
          const dataOffset = offset + 8
          if (dataOffset + 32 > stat.size) break
          const an = fs.readSync(fd, row, 0, 32, dataOffset)
          if (an < 32) break
          const accountHashHex = row.subarray(0, 32).toString('hex')
          let pos = dataOffset + 32
          for (let i = 0; i < slotCount; i++) {
            if (pos + 36 > stat.size) {
              pos = stat.size + 1
              break
            }
            const len = fs.readSync(fd, row, 0, 36, pos)
            if (len < 36) {
              pos = stat.size + 1
              break
            }
            const valueLen = row.readUInt32BE(32)
            pos += 36 + valueLen
          }
          if (pos > stat.size) break
          const batchByteLength = pos - offset
          batches.push({
            batchOffset: offset,
            accountHashHex,
            slotCount,
            batchByteLength,
          })
          offset += batchByteLength
        }
      } finally {
        fs.closeSync(fd)
      }
      return batches
    } catch {
      return undefined
    }
  }

  /** Cold storage slot lookup for {@link FlatStateManager} (`storage/shard-*.bin` journals). */
  lookupStorageByHash(accountHash: Uint8Array, slotHash: Uint8Array): Uint8Array | undefined {
    if (!this.enabled) return undefined
    const file = this.storageShardFile(accountHash)
    if (file === undefined || !fs.existsSync(file)) return undefined
    const stat = fs.statSync(file)
    let cached = this.storageLookupIndex.get(file)
    if (cached === undefined || cached.fileSize !== stat.size) {
      const batches = this.buildStorageShardBatchIndex(file)
      if (batches === undefined) return undefined
      cached = { fileSize: stat.size, batches }
      this.storageLookupIndex.set(file, cached)
    }
    const accountHex = bytesToHex(accountHash).slice(2).toLowerCase()
    const slotHex = bytesToHex(slotHash).slice(2).toLowerCase()
    const fd = fs.openSync(file, 'r')
    const scratch = Buffer.alloc(64)
    try {
      for (let bi = cached.batches.length - 1; bi >= 0; bi--) {
        const batch = cached.batches[bi]!
        if (batch.accountHashHex !== accountHex) continue
        let pos = batch.batchOffset + 8 + 32
        for (let i = 0; i < batch.slotCount; i++) {
          const n = fs.readSync(fd, scratch, 0, 36, pos)
          if (n < 36) break
          const rowSlotHex = scratch.subarray(0, 32).toString('hex')
          const valueLen = scratch.readUInt32BE(32)
          pos += 36
          if (rowSlotHex === slotHex) {
            if (valueLen === 0) return new Uint8Array(0)
            const buf = Buffer.alloc(valueLen)
            const vn = fs.readSync(fd, buf, 0, valueLen, pos)
            if (vn < valueLen) return undefined
            return new Uint8Array(buf)
          }
          pos += valueLen
        }
      }
    } finally {
      fs.closeSync(fd)
    }
    return undefined
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
    subRanges: b.subRanges?.map((c) => ({
      origin: bytesToHex(c.origin),
      limit: bytesToHex(c.limit),
      journal: c.journal,
    })),
  }))
}

export function snapBucketsUnfinished(buckets: readonly SnapBucket[]): boolean {
  return buckets.some((b) => b.status !== 'done')
}
