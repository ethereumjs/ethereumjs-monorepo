import * as fs from 'node:fs'
import * as path from 'node:path'

import { RLP } from '@ethereumjs/rlp'
import type { FlatStateManager } from '@ethereumjs/statemanager'
import {
  type BALJSONBlockAccessList,
  KECCAK256_NULL,
  KECCAK256_RLP,
  bigIntToUnpaddedBytes,
  bytesToUnprefixedHex,
  equalsBytes,
  getBinaryAccountCodeHash,
  getBinaryAccountStorageRoot,
  hexToBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3'

import { type SnapPivotStore, snapBucketsUnfinished } from '../persist/snapStore.ts'
import { enqueueProtocol } from '../runtime/lanes.ts'
import { recordDiagnostic } from '../spine/diagnostics.ts'
import type { EthySpine } from '../spine/types.ts'
import type { IngestedAccountMeta } from './accountSync.ts'
import type { SnapPeerFlightTracker } from './snapFlight.ts'
import type { SnapTransport } from './snapTransport.ts'
import { snapReplyRequestId, verifyStorageRangeJob } from './snapVerifyJob.ts'
import { SnapVerifyPool } from './snapVerifyWorker.ts'
import { incrementKey32 } from './syntheticPeer.ts'

const RESPONSE_BYTES = 128 * 1024
const MAX_CODE_HASHES = 64
/** In-memory contract/storage task cap before disk spill (WP-04g). */
export const MAX_IN_MEMORY_CONTRACT_TASKS = 16_384
const CONTRACT_SPILL_ROW_BYTES = 96
const RANGE_TIMEOUT_MS = 20_000
const STORAGE_LIMIT = new Uint8Array(32).fill(0xff)

type StorageTask = {
  accountHash: Uint8Array
  storageRoot: Uint8Array
  origin: Uint8Array
  /** Proof is in the worker. The task is not in flight, and must not be requested again yet. */
  verifying: boolean
  missRetries: number
}

type CodeTask = {
  codeHash: Uint8Array
  missRetries: number
}

type InFlightStorage = {
  reqId: bigint
  sentAt: number
  accountKey: string
  rootGeneration: number
}
type InFlightCodes = { reqId: bigint; sentAt: number; hashes: Uint8Array[]; rootGeneration: number }

function accountHashKey(accountHash: Uint8Array): string {
  return bytesToUnprefixedHex(accountHash)
}

function codeHashKey(codeHash: Uint8Array): string {
  return bytesToUnprefixedHex(codeHash)
}

export type SnapCodeAndStorageSynchronizerOpts = {
  spine: EthySpine
  stateManager: FlatStateManager
  transport: SnapTransport
  flightTracker: SnapPeerFlightTracker
  getSnapPeers: () => Array<{ id: string; caps: string[] }>
  snapStore?: SnapPivotStore
  peerBusy: (peerId: string) => boolean
  verifyPool?: SnapVerifyPool
  maxInMemoryContractTasks?: number
  /** Test-only spill file when no {@link SnapPivotStore} is attached. */
  contractSpillPath?: string
}

export class SnapCodeAndStorageSynchronizer {
  private readonly spine: EthySpine
  private readonly stateManager: FlatStateManager
  private readonly transport: SnapTransport
  private readonly flightTracker: SnapPeerFlightTracker
  private readonly getSnapPeers: () => Array<{ id: string; caps: string[] }>
  private readonly snapStore?: SnapPivotStore
  private readonly peerBusy: (peerId: string) => boolean
  private readonly verifyPool: SnapVerifyPool
  private readonly maxInMemoryContractTasks: number
  private readonly contractSpillPath?: string
  private contractsSpilledOnDisk = 0
  private contractSpillReadOffset = 0
  private readonly contractSpillBuffer: Uint8Array[] = []
  private reqId = 1n
  private readonly codeQueue = new Map<string, CodeTask>()
  private readonly pendingStorage = new Map<string, StorageTask>()
  private storageInFlight = new Map<string, InFlightStorage>()
  private codesInFlight = new Map<string, InFlightCodes>()
  private detachStorage?: () => void
  private detachCodes?: () => void
  private tickTimer?: ReturnType<typeof setInterval>

  constructor(opts: SnapCodeAndStorageSynchronizerOpts) {
    this.spine = opts.spine
    this.stateManager = opts.stateManager
    this.transport = opts.transport
    this.flightTracker = opts.flightTracker
    this.getSnapPeers = opts.getSnapPeers
    this.snapStore = opts.snapStore
    this.peerBusy = opts.peerBusy
    this.verifyPool = opts.verifyPool ?? new SnapVerifyPool({ inProcess: true })
    this.maxInMemoryContractTasks = opts.maxInMemoryContractTasks ?? MAX_IN_MEMORY_CONTRACT_TASKS
    this.contractSpillPath = opts.contractSpillPath
  }

  start(): void {
    if (this.detachStorage !== undefined) return
    this.detachStorage = this.transport.onStorageRanges((peerId, payload) => {
      void this.handleStorageRanges(peerId, payload)
    })
    this.detachCodes = this.transport.onByteCodes((peerId, payload) => {
      void this.handleByteCodes(peerId, payload)
    })
    this.tickTimer = setInterval(() => this.schedule(), 50)
    this.tickTimer.unref?.()
    this.schedule()
  }

  stop(): void {
    this.flushContractSpillBuffer()
    this.detachStorage?.()
    this.detachCodes?.()
    this.detachStorage = undefined
    this.detachCodes = undefined
    if (this.tickTimer !== undefined) clearInterval(this.tickTimer)
  }

  noteAccounts(entries: IngestedAccountMeta[]): void {
    for (const { accountHash, codeHash, storageRoot } of entries) {
      const ownedHash = new Uint8Array(accountHash)
      if (!equalsBytes(codeHash, KECCAK256_NULL)) {
        const key = codeHashKey(codeHash)
        if (!this.codeQueue.has(key)) {
          if (this.codeQueue.size >= this.maxInMemoryContractTasks) {
            if (this.snapStore !== undefined) {
              this.snapStore.enableContractScan()
            } else {
              this.spillContractRow(ownedHash, codeHash, storageRoot)
            }
            continue
          }
          this.codeQueue.set(key, { codeHash: new Uint8Array(codeHash), missRetries: 0 })
        }
      }
      if (!equalsBytes(storageRoot, KECCAK256_RLP)) {
        const key = accountHashKey(ownedHash)
        if (!this.pendingStorage.has(key)) {
          if (this.pendingStorage.size >= this.maxInMemoryContractTasks) {
            if (this.snapStore !== undefined) {
              this.snapStore.enableContractScan()
            } else {
              this.spillContractRow(ownedHash, codeHash, storageRoot)
            }
            continue
          }
          this.pendingStorage.set(key, {
            accountHash: ownedHash,
            storageRoot: new Uint8Array(storageRoot),
            origin: new Uint8Array(32),
            verifying: false,
            missRetries: 0,
          })
        }
      }
    }
    this.publishPending()
  }

  /** Spilled + journal-backed tasks not yet in memory (tests / metrics). */
  contractsBacklogSize(): number {
    if (this.snapStore?.contractScanRemaining() === true) return 1
    return this.contractsSpilledOnDisk
  }

  clearPending(): void {
    this.codeQueue.clear()
    this.pendingStorage.clear()
    this.storageInFlight.clear()
    this.codesInFlight.clear()
    this.publishPending()
  }

  /** Drop in-flight work and refresh storage roots after a pivot heal (D-058). */
  refreshAfterPivotHeal(): void {
    this.storageInFlight.clear()
    this.codesInFlight.clear()
    for (const [key, task] of this.pendingStorage) {
      const binary = this.stateManager.getBinaryAccountByHash(task.accountHash)
      if (binary === undefined) {
        this.pendingStorage.delete(key)
        continue
      }
      const storageRoot = getBinaryAccountStorageRoot(binary)
      if (equalsBytes(storageRoot, KECCAK256_RLP)) {
        this.pendingStorage.delete(key)
        continue
      }
      if (!equalsBytes(task.storageRoot, storageRoot)) {
        task.storageRoot = new Uint8Array(storageRoot)
        task.origin = new Uint8Array(32)
        task.missRetries = 0
      }
    }
    this.publishPending()
  }

  noteBalApplied(bal: BALJSONBlockAccessList): void {
    for (const row of bal) {
      const address = hexToBytes(row.address)
      if (address.length !== 20) continue
      this.invalidateAccount(keccak_256(address))
    }
    this.publishPending()
  }

  pendingDone(): boolean {
    return (
      this.codeQueue.size === 0 &&
      this.pendingStorage.size === 0 &&
      this.storageInFlight.size === 0 &&
      this.codesInFlight.size === 0 &&
      !this.snapStore?.contractScanRemaining() &&
      this.contractsSpilledOnDisk === 0
    )
  }

  invalidateAccount(accountHash: Uint8Array): void {
    const accKey = accountHashKey(accountHash)
    const binary = this.stateManager.getBinaryAccountByHash(accountHash)
    if (binary !== undefined) {
      const storageRoot = getBinaryAccountStorageRoot(binary)
      if (!equalsBytes(storageRoot, KECCAK256_RLP)) {
        const existing = this.pendingStorage.get(accKey)
        if (existing !== undefined) {
          existing.storageRoot = new Uint8Array(storageRoot)
          existing.origin = new Uint8Array(32)
          existing.missRetries = 0
          existing.verifying = false
        } else {
          this.pendingStorage.set(accKey, {
            accountHash: new Uint8Array(accountHash),
            storageRoot: new Uint8Array(storageRoot),
            origin: new Uint8Array(32),
            verifying: false,
            missRetries: 0,
          })
        }
      } else {
        this.pendingStorage.delete(accKey)
      }
      const codeHash = getBinaryAccountCodeHash(binary)
      if (!equalsBytes(codeHash, KECCAK256_NULL)) {
        this.codeQueue.delete(codeHashKey(codeHash))
      }
    } else {
      this.pendingStorage.delete(accKey)
    }
  }

  private codeHashesClaimedByFlights(): Set<string> {
    const claimed = new Set<string>()
    for (const flight of this.codesInFlight.values()) {
      for (const h of flight.hashes) {
        claimed.add(codeHashKey(h))
      }
    }
    return claimed
  }

  private storageKeysInFlight(): Set<string> {
    const keys = new Set<string>()
    for (const flight of this.storageInFlight.values()) {
      keys.add(flight.accountKey)
    }
    return keys
  }

  private nextCodeBatch(max: number): CodeTask[] {
    const claimed = this.codeHashesClaimedByFlights()
    const batch: CodeTask[] = []
    for (const task of this.codeQueue.values()) {
      if (claimed.has(codeHashKey(task.codeHash))) continue
      batch.push(task)
      if (batch.length >= max) break
    }
    return batch
  }

  private nextStorageTask(): StorageTask | undefined {
    const inFlight = this.storageKeysInFlight()
    for (const task of this.pendingStorage.values()) {
      const key = accountHashKey(task.accountHash)
      if (task.verifying || inFlight.has(key)) continue
      return task
    }
    return undefined
  }

  private schedule(): void {
    if (this.spine.snapPaused || this.spine.pivotStateRoot === undefined) return
    if (snapBucketsUnfinished(this.spine.snapBuckets)) return
    this.refillContractTasksFromDisk()
    const now = Date.now()
    this.expireStale(now)
    const peers = this.getSnapPeers().filter((p) => p.caps.some((c) => c.startsWith('snap')))
    if (peers.length === 0) return

    for (const peer of peers) {
      if (this.flightTracker.has(peer.id) || this.peerBusy(peer.id)) continue
      if (this.codesInFlight.has(peer.id)) continue
      if (this.storageInFlight.has(peer.id)) continue

      const codeBatch = this.nextCodeBatch(MAX_CODE_HASHES)
      if (codeBatch.length > 0) {
        const hashes = codeBatch.map((t) => t.codeHash)
        const reqId = this.reqId++
        if (!this.flightTracker.tryClaim(peer.id, { kind: 'byteCodes', reqId, sentAt: now })) {
          continue
        }
        this.codesInFlight.set(peer.id, {
          reqId,
          sentAt: now,
          hashes,
          rootGeneration: this.flightTracker.rootGeneration,
        })
        this.transport.sendByteCodes(peer.id, encodeGetByteCodes(reqId, hashes, RESPONSE_BYTES))
        continue
      }

      const task = this.nextStorageTask()
      if (task !== undefined) {
        const accountKey = accountHashKey(task.accountHash)
        const reqId = this.reqId++
        if (!this.flightTracker.tryClaim(peer.id, { kind: 'storage', reqId, sentAt: now })) {
          continue
        }
        this.storageInFlight.set(peer.id, {
          reqId,
          sentAt: now,
          accountKey,
          rootGeneration: this.flightTracker.rootGeneration,
        })
        this.transport.sendStorageRanges(
          peer.id,
          encodeGetStorageRanges(
            reqId,
            this.spine.pivotStateRoot,
            [task.accountHash],
            task.origin,
            STORAGE_LIMIT,
            RESPONSE_BYTES,
          ),
        )
      }
    }
  }

  private expireStale(now: number): void {
    for (const [peerId, flight] of this.storageInFlight) {
      if (now - flight.sentAt < RANGE_TIMEOUT_MS) continue
      this.storageInFlight.delete(peerId)
      this.flightTracker.release(peerId, flight.reqId)
    }
    for (const [peerId, flight] of this.codesInFlight) {
      if (now - flight.sentAt < RANGE_TIMEOUT_MS) continue
      this.codesInFlight.delete(peerId)
      this.flightTracker.release(peerId, flight.reqId)
    }
  }

  private async handleStorageRanges(peerId: string, payload: Uint8Array): Promise<void> {
    const flight = this.storageInFlight.get(peerId)
    if (flight === undefined || this.spine.pivotStateRoot === undefined) return
    if (flight.rootGeneration !== this.flightTracker.rootGeneration) {
      this.storageInFlight.delete(peerId)
      this.flightTracker.release(peerId, flight.reqId)
      return
    }
    const replyId = snapReplyRequestId(payload)
    if (replyId === undefined || replyId !== flight.reqId) return
    this.storageInFlight.delete(peerId)
    this.flightTracker.release(peerId, flight.reqId)
    const task = this.pendingStorage.get(flight.accountKey)
    if (task === undefined) return
    task.verifying = true

    let result: Awaited<ReturnType<SnapVerifyPool['verifyStorageRange']>>
    try {
      result = await this.verifyPool.verifyStorageRange({
        storageRoot: task.storageRoot,
        origin: task.origin,
        payload,
      })
    } finally {
      task.verifying = false
    }
    await new Promise<void>((resolve) => {
      enqueueProtocol(() => {
        try {
          if (result.ok && result.slots !== undefined && result.slots.length > 0) {
            this.stateManager.putSnapStorageBatch(task.accountHash, result.slots)
            this.spine.storageSlotsSynced += result.slots.length
            this.snapStore?.appendStorageSlots(task.accountHash, result.slots)
          }
          if (!result.ok) {
            recordDiagnostic(this.spine, {
              subsystem: 'snap',
              severity: 'warn',
              peerId,
              message: result.reason ?? 'storage range failed',
            })
            return
          }
          if (result.hasRight && result.lastKey !== undefined) {
            task.origin = incrementKey32(result.lastKey)
          } else {
            this.pendingStorage.delete(flight.accountKey)
          }
          this.publishPending()
        } finally {
          resolve()
        }
      })
    })
  }

  private handleByteCodes(peerId: string, payload: Uint8Array): void {
    const flight = this.codesInFlight.get(peerId)
    if (flight === undefined) return
    if (flight.rootGeneration !== this.flightTracker.rootGeneration) {
      this.codesInFlight.delete(peerId)
      this.flightTracker.release(peerId, flight.reqId)
      return
    }
    const replyId = snapReplyRequestId(payload)
    if (replyId === undefined || replyId !== flight.reqId) return
    this.codesInFlight.delete(peerId)
    this.flightTracker.release(peerId, flight.reqId)

    let decoded: unknown[]
    try {
      decoded = RLP.decode(payload) as unknown[]
    } catch {
      return
    }
    const codesRaw = decoded[1]
    if (!Array.isArray(codesRaw)) return
    const requested = [...flight.hashes]
    for (const raw of codesRaw) {
      if (!(raw instanceof Uint8Array)) continue
      const hash = keccak_256(raw)
      const idx = requested.findIndex((h) => equalsBytes(h, hash))
      if (idx < 0) continue
      this.stateManager.putCodeByHash(hash, raw)
      this.spine.codesSynced++
      this.snapStore?.appendCode(hash, raw)
      requested.splice(idx, 1)
      this.codeQueue.delete(codeHashKey(hash))
    }
    for (const missed of requested) {
      const key = codeHashKey(missed)
      const task = this.codeQueue.get(key)
      if (task !== undefined) {
        task.missRetries++
        if (task.missRetries > 1) {
          this.codeQueue.delete(key)
          recordDiagnostic(this.spine, {
            subsystem: 'snap',
            severity: 'warn',
            peerId,
            message: `bytecode miss for ${bytesToHexShort(missed)}`,
          })
        }
      }
    }
    this.publishPending()
  }

  private publishPending(): void {
    this.spine.codesQueued = this.codeQueue.size
    this.spine.storageQueued = this.pendingStorage.size
  }

  private spillContractRow(
    accountHash: Uint8Array,
    codeHash: Uint8Array,
    storageRoot: Uint8Array,
  ): void {
    if (this.contractSpillPath === undefined) return
    const row = new Uint8Array(CONTRACT_SPILL_ROW_BYTES)
    row.set(accountHash.subarray(0, 32), 0)
    row.set(codeHash.subarray(0, 32), 32)
    row.set(storageRoot.subarray(0, 32), 64)
    this.contractSpillBuffer.push(row)
    this.contractsSpilledOnDisk++
    if (this.contractSpillBuffer.length >= 256) {
      this.flushContractSpillBuffer()
    }
  }

  private flushContractSpillBuffer(): void {
    if (this.contractSpillPath === undefined || this.contractSpillBuffer.length === 0) return
    const totalBytes = this.contractSpillBuffer.length * CONTRACT_SPILL_ROW_BYTES
    const batch = new Uint8Array(totalBytes)
    let off = 0
    for (const row of this.contractSpillBuffer) {
      batch.set(row, off)
      off += CONTRACT_SPILL_ROW_BYTES
    }
    this.contractSpillBuffer.length = 0
    fs.mkdirSync(path.dirname(this.contractSpillPath), { recursive: true })
    fs.appendFileSync(this.contractSpillPath, batch)
  }

  private refillContractTasksFromDisk(): void {
    this.flushContractSpillBuffer()
    while (
      this.codeQueue.size + this.pendingStorage.size < this.maxInMemoryContractTasks &&
      (this.snapStore?.contractScanRemaining() === true || this.contractsSpilledOnDisk > 0)
    ) {
      if (this.snapStore !== undefined) {
        const batch = this.snapStore.nextContractScanBatch(512)
        if (batch.length === 0) break
        this.noteAccounts(batch)
        continue
      }
      if (this.contractSpillPath === undefined || !fs.existsSync(this.contractSpillPath)) break
      const stat = fs.statSync(this.contractSpillPath)
      const availBytes = stat.size - this.contractSpillReadOffset
      if (availBytes < CONTRACT_SPILL_ROW_BYTES) {
        this.contractsSpilledOnDisk = 0
        this.contractSpillReadOffset = 0
        break
      }
      const batchRows = Math.min(256, Math.floor(availBytes / CONTRACT_SPILL_ROW_BYTES))
      const buf = Buffer.alloc(batchRows * CONTRACT_SPILL_ROW_BYTES)
      const fd = fs.openSync(this.contractSpillPath, 'r')
      try {
        fs.readSync(fd, buf, 0, buf.length, this.contractSpillReadOffset)
      } finally {
        fs.closeSync(fd)
      }
      this.contractSpillReadOffset += buf.length
      this.contractsSpilledOnDisk = Math.max(
        0,
        Math.floor((stat.size - this.contractSpillReadOffset) / CONTRACT_SPILL_ROW_BYTES),
      )
      const entries: IngestedAccountMeta[] = []
      for (let i = 0; i < batchRows; i++) {
        const base = i * CONTRACT_SPILL_ROW_BYTES
        entries.push({
          accountHash: new Uint8Array(buf.subarray(base, base + 32)),
          codeHash: new Uint8Array(buf.subarray(base + 32, base + 64)),
          storageRoot: new Uint8Array(buf.subarray(base + 64, base + 96)),
        })
      }
      this.noteAccounts(entries)
    }
  }
}

export function encodeGetByteCodes(
  reqId: bigint,
  codeHashes: Uint8Array[],
  responseBytes: number,
): Uint8Array {
  return RLP.encode([
    bigIntToUnpaddedBytes(reqId),
    codeHashes.map((h) => setLengthLeft(h, 32)),
    bigIntToUnpaddedBytes(BigInt(responseBytes)),
  ] as never)
}

export function encodeGetStorageRanges(
  reqId: bigint,
  rootHash: Uint8Array,
  accountHashes: Uint8Array[],
  origin: Uint8Array,
  limit: Uint8Array,
  responseBytes: number,
): Uint8Array {
  return RLP.encode([
    bigIntToUnpaddedBytes(reqId),
    setLengthLeft(rootHash, 32),
    accountHashes.map((h) => setLengthLeft(h, 32)),
    setLengthLeft(origin, 32),
    setLengthLeft(limit, 32),
    bigIntToUnpaddedBytes(BigInt(responseBytes)),
  ] as never)
}

export async function ingestStorageRangesReply(
  storageRoot: Uint8Array,
  replyPayload: Uint8Array,
  origin: Uint8Array,
  putBatch: (slots: Array<{ slotHash: Uint8Array; value: Uint8Array }>) => void,
): Promise<{ ok: boolean; hasRight: boolean; lastKey?: Uint8Array; reason?: string }> {
  const result = await verifyStorageRangeJob({
    storageRoot,
    replyPayload,
    origin,
  })
  if (result.ok && result.slots !== undefined && result.slots.length > 0) {
    putBatch(result.slots)
  }
  return result
}

function bytesToHexShort(hash: Uint8Array): string {
  return `0x${Array.from(hash.slice(0, 4))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')}…`
}
