import * as fs from 'node:fs'
import * as path from 'node:path'

import type { FlatStateManager } from '@ethereumjs/statemanager'
import { createBlockLevelAccessListFromRLP } from '@ethereumjs/util'
import { bytesToHex, unprefixedHexToBytes } from '@ethereumjs/util'

import { createSnapBuckets, snapBucketCursorExhausted } from '../spine/buckets.ts'
import type { EthySpine, SnapBucket, SnapBucketStatus } from '../spine/types.ts'
import {
  accountFromJournalRlp,
  countAccountJournalRecords,
  encodeAccountJournalRecord,
  journalCursorAfterRecords,
  readAccountJournalFile,
} from './journal.ts'

export const SNAP_STORE_SCHEMA = 2

type ChainMeta = { chainId: string; genesisHash: string }

type ActiveMeta = { stateRoot: string; previousStateRoot?: string | null }

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

  /** Hydrate spine + state from the active pivot. Returns account count restored. */
  loadInto(spine: EthySpine, stateManager: FlatStateManager): number {
    if (!this.enabled) return 0
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
        const { records, lastHash } = readAccountJournalFile(raw)
        journalRecords = records.length
        for (const row of records) {
          stateManager.putSnapAccountsBatch([
            { accountHash: row.accountHash, account: accountFromJournalRlp(row.accountRlp) },
          ])
          restored++
        }
        const cursor = journalCursorAfterRecords(i, records.length, lastHash, bucket.startHash)
        bucket.accountsLoaded = cursor.accountsLoaded
        bucket.currentLastHash = cursor.currentLastHash
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

  appendVerifiedRange(
    bucketIndex: number,
    records: Array<{ accountHash: Uint8Array; accountRlp: Uint8Array }>,
    buckets: SnapBucket[],
  ): void {
    if (!this.enabled || this.activeStateRoot === undefined || records.length === 0) return
    const file = this.accountFile(bucketIndex, this.activeStateRoot)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    const fd = fs.openSync(file, 'a')
    try {
      for (const row of records) {
        const encoded = encodeAccountJournalRecord(row)
        fs.writeSync(fd, encoded)
      }
      fs.fsyncSync(fd)
    } finally {
      fs.closeSync(fd)
    }
    writeAtomicDoc(path.join(this.pivotDir(this.activeStateRoot), 'buckets.json'), {
      buckets: serializeBuckets(buckets),
    })
  }

  flushBuckets(buckets: SnapBucket[]): void {
    if (!this.enabled || this.activeStateRoot === undefined) return
    writeAtomicDoc(path.join(this.pivotDir(this.activeStateRoot), 'buckets.json'), {
      buckets: serializeBuckets(buckets),
    })
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
