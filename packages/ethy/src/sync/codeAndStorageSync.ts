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
import { ethyKeccak256 } from '../crypto/keccak.ts'
import { type SnapPivotStore, snapBucketsUnfinished } from '../persist/snapStore.ts'
import { enqueueProtocol } from '../runtime/lanes.ts'
import { recordDiagnostic } from '../spine/diagnostics.ts'
import type { EthySpine } from '../spine/types.ts'
import type { IngestedAccountMeta } from './accountSync.ts'
import type { SnapPeerFlightTracker } from './snapFlight.ts'
import { type SnapSchedulePeer, maxInFlightForPeer } from './snapSchedulePolicy.ts'
import type { SnapTransport } from './snapTransport.ts'
import { snapReplyRequestId, verifyStorageRangeJob } from './snapVerifyJob.ts'
import { SnapVerifyPool } from './snapVerifyWorker.ts'
import { isAccountHashSynced } from './syncedAccountHash.ts'
import { incrementKey32 } from './syntheticPeer.ts'

const CODE_RESPONSE_BYTES = 128 * 1024
const STORAGE_RESPONSE_BYTES = 256 * 1024
const MAX_CODE_HASHES = 64
const MAX_STORAGE_ACCOUNTS_PER_REQ = 16
const CODE_STORAGE_PIPELINE_CAP = 4
const CONTRACT_RATE_IDLE_SEC = 5
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
  accountKeys: string[]
  origin: Uint8Array
  rootGeneration: number
}
type InFlightCodes = { reqId: bigint; sentAt: number; hashes: Uint8Array[]; rootGeneration: number }

function inFlightKey(peerId: string, reqId: bigint): string {
  return `${peerId}:${reqId.toString()}`
}

function peerIdFromFlightKey(key: string): string {
  const i = key.lastIndexOf(':')
  return i >= 0 ? key.slice(0, i) : key
}

function isFreshStorageOrigin(origin: Uint8Array): boolean {
  for (const b of origin) {
    if (b !== 0) return false
  }
  return true
}

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
  getSnapPeers: () => SnapSchedulePeer[]
  snapStore?: SnapPivotStore
  peerBusy: (peerId: string) => boolean
  verifyPool?: SnapVerifyPool
  maxInMemoryContractTasks?: number
  /** Test-only spill file when no {@link SnapPivotStore} is attached. */
  contractSpillPath?: string
  onBalRefreshAccount?: (accountHash: Uint8Array) => void
}

export class SnapCodeAndStorageSynchronizer {
  private readonly spine: EthySpine
  private readonly stateManager: FlatStateManager
  private readonly transport: SnapTransport
  private readonly flightTracker: SnapPeerFlightTracker
  private readonly getSnapPeers: () => SnapSchedulePeer[]
  private readonly snapStore?: SnapPivotStore
  private readonly peerBusy: (peerId: string) => boolean
  private readonly verifyPool: SnapVerifyPool
  private readonly maxInMemoryContractTasks: number
  private readonly contractSpillPath?: string
  private readonly onBalRefreshAccount?: (accountHash: Uint8Array) => void
  private contractsSpilledOnDisk = 0
  private contractSpillReadOffset = 0
  private readonly contractSpillBuffer: Uint8Array[] = []
  private readonly completedStorageAccounts = new Set<string>()
  private readonly countedCodeHashes = new Set<string>()
  private readonly countedStorageAccounts = new Set<string>()
  private hasRestoredTotals = false
  private lastContractsDone = 0
  private lastContractRateAt = Date.now()
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
    this.onBalRefreshAccount = opts.onBalRefreshAccount
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

  noteAccounts(entries: IngestedAccountMeta[], opts?: { fromDiskRefill?: boolean }): void {
    const fromDiskRefill = opts?.fromDiskRefill === true
    let spilled = false
    for (const { accountHash, codeHash, storageRoot } of entries) {
      const ownedHash = new Uint8Array(accountHash)
      let rowSpilled = false
      if (!equalsBytes(codeHash, KECCAK256_NULL)) {
        const key = codeHashKey(codeHash)
        const alreadyHaveCode =
          this.stateManager.getCodeByHash(codeHash) !== undefined ||
          this.snapStore?.hasPersistedCode(codeHash) === true
        if ((!fromDiskRefill || !this.hasRestoredTotals) && !this.countedCodeHashes.has(key)) {
          this.countedCodeHashes.add(key)
          if (!alreadyHaveCode || fromDiskRefill) {
            this.spine.codesTotal = (this.spine.codesTotal ?? 0) + 1
          }
        }
        if (!alreadyHaveCode && !this.codeQueue.has(key)) {
          if (!fromDiskRefill && this.codeQueue.size >= this.maxInMemoryContractTasks) {
            if (this.snapStore !== undefined) {
              this.snapStore.enableContractScan()
            } else {
              this.spillContractRow(ownedHash, codeHash, storageRoot)
              rowSpilled = true
            }
            spilled = true
          } else {
            this.codeQueue.set(key, { codeHash: new Uint8Array(codeHash), missRetries: 0 })
          }
        }
      }
      if (!equalsBytes(storageRoot, KECCAK256_RLP)) {
        const key = accountHashKey(ownedHash)
        const alreadyHaveStorage =
          this.completedStorageAccounts.has(key) ||
          this.snapStore?.hasPersistedStorageAccount(ownedHash) === true
        if (alreadyHaveStorage) {
          this.completedStorageAccounts.add(key)
        }
        if ((!fromDiskRefill || !this.hasRestoredTotals) && !this.countedStorageAccounts.has(key)) {
          this.countedStorageAccounts.add(key)
          if (!alreadyHaveStorage || fromDiskRefill) {
            this.spine.storageAccountsTotal = (this.spine.storageAccountsTotal ?? 0) + 1
          }
        }
        if (!alreadyHaveStorage) {
          const existing = this.pendingStorage.get(key)
          if (existing !== undefined) {
            if (!equalsBytes(existing.storageRoot, storageRoot)) {
              existing.storageRoot = new Uint8Array(storageRoot)
              existing.origin = new Uint8Array(32)
              existing.verifying = false
              existing.missRetries = 0
            }
          } else if (!fromDiskRefill && this.pendingStorage.size >= this.maxInMemoryContractTasks) {
            if (this.snapStore !== undefined) {
              this.snapStore.enableContractScan()
            } else if (!rowSpilled) {
              this.spillContractRow(ownedHash, codeHash, storageRoot)
            }
            spilled = true
          } else {
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
    }
    if (spilled && this.snapStore !== undefined && !fromDiskRefill) {
      this.snapStore.persistContractProgress(
        this.spine.codesTotal ?? 0,
        this.spine.codesSynced,
        this.spine.storageAccountsTotal ?? 0,
        this.spine.storageAccountsSynced ?? 0,
        this.spine.storageSlotsSynced,
      )
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
      const accountHash = ethyKeccak256(address)
      const touchedStorageOrCode = row.storageChanges.length > 0 || row.codeChanges.length > 0
      if (
        touchedStorageOrCode &&
        this.spine.phase === 'SNAP_SYNCING' &&
        isAccountHashSynced(accountHash, this.spine.snapBuckets)
      ) {
        this.onBalRefreshAccount?.(accountHash)
      }
      this.invalidateAccount(accountHash)
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
      for (const k of flight.accountKeys) keys.add(k)
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

  private nextStorageBatch(max: number): StorageTask[] {
    const inFlight = this.storageKeysInFlight()
    const batch: StorageTask[] = []
    for (const task of this.pendingStorage.values()) {
      const key = accountHashKey(task.accountHash)
      if (task.verifying || inFlight.has(key)) continue
      if (batch.length === 0) {
        batch.push(task)
        if (!isFreshStorageOrigin(task.origin)) break
        continue
      }
      if (!isFreshStorageOrigin(task.origin)) break
      batch.push(task)
      if (batch.length >= max) break
    }
    return batch
  }

  private refreshContractRate(now: number): void {
    const done = this.spine.codesSynced + (this.spine.storageAccountsSynced ?? 0)
    const dt = (now - this.lastContractRateAt) / 1000
    if (dt >= CONTRACT_RATE_IDLE_SEC) {
      const delta = done - this.lastContractsDone
      this.spine.contractsPerSec = delta > 0 ? delta / dt : 0
      this.lastContractsDone = done
      this.lastContractRateAt = now
      const codeRem = Math.max(
        0,
        Math.max(this.spine.codesTotal ?? 0, this.spine.codesSynced + this.spine.codesQueued) -
          this.spine.codesSynced,
      )
      const storRem = Math.max(
        0,
        Math.max(
          this.spine.storageAccountsTotal ?? 0,
          (this.spine.storageAccountsSynced ?? 0) + this.spine.storageQueued,
        ) - (this.spine.storageAccountsSynced ?? 0),
      )
      const rem = codeRem + storRem
      const rate = (this.spine.contractsPerSec ?? 0) * 60
      this.spine.storageEtaMinutes = rate > 0 && rem > 0 ? rem / rate : undefined
    }
  }

  private schedule(): void {
    if (
      this.spine.snapPaused ||
      this.spine.pivotBridging !== undefined ||
      this.spine.pivotStateRoot === undefined
    ) {
      return
    }
    if (snapBucketsUnfinished(this.spine.snapBuckets)) return
    this.refillContractTasksFromDisk()
    const now = Date.now()
    this.refreshContractRate(now)
    this.expireStale(now)
    const peers = this.getSnapPeers().filter((p) => p.caps.some((c) => c.startsWith('snap')))
    if (peers.length === 0) return

    for (const peer of peers) {
      if (this.peerBusy(peer.id)) continue
      const depth = Math.min(CODE_STORAGE_PIPELINE_CAP, maxInFlightForPeer(peer))
      while (this.flightTracker.inFlightCount(peer.id) < depth) {
        const codeBatch = this.nextCodeBatch(MAX_CODE_HASHES)
        if (codeBatch.length > 0) {
          const hashes = codeBatch.map((t) => t.codeHash)
          const reqId = this.reqId++
          if (
            !this.flightTracker.tryClaim(peer.id, { kind: 'byteCodes', reqId, sentAt: now }, depth)
          ) {
            break
          }
          const flightKey = inFlightKey(peer.id, reqId)
          this.codesInFlight.set(flightKey, {
            reqId,
            sentAt: now,
            hashes,
            rootGeneration: this.flightTracker.rootGeneration,
          })
          this.transport.sendByteCodes(
            peer.id,
            encodeGetByteCodes(reqId, hashes, CODE_RESPONSE_BYTES),
          )
          continue
        }
        const batch = this.nextStorageBatch(MAX_STORAGE_ACCOUNTS_PER_REQ)
        if (batch.length === 0) break
        const reqId = this.reqId++
        if (!this.flightTracker.tryClaim(peer.id, { kind: 'storage', reqId, sentAt: now }, depth)) {
          break
        }
        const accountKeys = batch.map((t) => accountHashKey(t.accountHash))
        const origin = new Uint8Array(batch[0]!.origin)
        for (const t of batch) t.verifying = true
        const flightKey = inFlightKey(peer.id, reqId)
        this.storageInFlight.set(flightKey, {
          reqId,
          sentAt: now,
          accountKeys,
          origin,
          rootGeneration: this.flightTracker.rootGeneration,
        })
        this.transport.sendStorageRanges(
          peer.id,
          encodeGetStorageRanges(
            reqId,
            this.spine.pivotStateRoot,
            batch.map((t) => t.accountHash),
            origin,
            STORAGE_LIMIT,
            STORAGE_RESPONSE_BYTES,
          ),
        )
      }
    }
  }

  private expireStale(now: number): void {
    for (const [key, flight] of this.storageInFlight) {
      if (now - flight.sentAt < RANGE_TIMEOUT_MS) continue
      this.storageInFlight.delete(key)
      this.flightTracker.release(peerIdFromFlightKey(key), flight.reqId)
      for (const accKey of flight.accountKeys) {
        const task = this.pendingStorage.get(accKey)
        if (task !== undefined) task.verifying = false
      }
    }
    for (const [key, flight] of this.codesInFlight) {
      if (now - flight.sentAt < RANGE_TIMEOUT_MS) continue
      this.codesInFlight.delete(key)
      this.flightTracker.release(peerIdFromFlightKey(key), flight.reqId)
    }
  }

  private markStorageAccountDone(accountKey: string): void {
    this.pendingStorage.delete(accountKey)
    this.completedStorageAccounts.add(accountKey)
    this.spine.storageAccountsSynced = (this.spine.storageAccountsSynced ?? 0) + 1
  }

  private handleStorageProofFailure(
    task: StorageTask,
    accountKey: string,
    peerId: string,
    reason?: string,
  ): void {
    task.verifying = false
    task.missRetries++
    this.pendingStorage.delete(accountKey)
    this.pendingStorage.set(accountKey, task)
    if (task.missRetries === 1) {
      this.onBalRefreshAccount?.(task.accountHash)
    }
    if (task.missRetries > 2) {
      this.markStorageAccountDone(accountKey)
      recordDiagnostic(this.spine, {
        subsystem: 'snap',
        severity: 'warn',
        peerId,
        message: reason ?? 'storage range failed',
      })
    }
  }

  private async handleStorageRanges(peerId: string, payload: Uint8Array): Promise<void> {
    const replyId = snapReplyRequestId(payload)
    if (replyId === undefined || this.spine.pivotStateRoot === undefined) return
    const flightKey = inFlightKey(peerId, replyId)
    const flight = this.storageInFlight.get(flightKey)
    if (flight === undefined) return
    if (flight.rootGeneration !== this.flightTracker.rootGeneration) {
      this.storageInFlight.delete(flightKey)
      this.flightTracker.release(peerId, flight.reqId)
      for (const accKey of flight.accountKeys) {
        const task = this.pendingStorage.get(accKey)
        if (task !== undefined) task.verifying = false
      }
      return
    }
    this.storageInFlight.delete(flightKey)
    this.flightTracker.release(peerId, flight.reqId)
    const tasks = flight.accountKeys
      .map((k) => this.pendingStorage.get(k))
      .filter((t): t is StorageTask => t !== undefined)
    if (tasks.length === 0) return

    const accounts = tasks.map((t) => ({
      accountHash: t.accountHash,
      storageRoot: t.storageRoot,
    }))
    let result: Awaited<ReturnType<SnapVerifyPool['verifyStorageRange']>>
    try {
      result = await this.verifyPool.verifyStorageRange({
        accounts,
        origin: flight.origin,
        payload,
      })
    } catch {
      for (const t of tasks) {
        const key = accountHashKey(t.accountHash)
        this.handleStorageProofFailure(t, key, peerId, 'storage verify threw')
      }
      await new Promise<void>((resolve) => {
        enqueueProtocol(() => {
          this.publishPending()
          resolve()
        })
      })
      return
    }
    await new Promise<void>((resolve) => {
      enqueueProtocol(() => {
        try {
          if (!result.ok) {
            for (const t of tasks) {
              const key = accountHashKey(t.accountHash)
              this.handleStorageProofFailure(t, key, peerId, result.reason)
            }
            this.publishPending()
            return
          }
          const rows = result.perAccount ?? []
          for (const row of rows) {
            const task = tasks[row.accountIndex]
            if (task === undefined) continue
            const accKey = accountHashKey(task.accountHash)
            if (!row.ok) {
              this.handleStorageProofFailure(task, accKey, peerId, row.reason)
              continue
            }
            task.verifying = false
            if (row.slots !== undefined && row.slots.length > 0) {
              this.stateManager.putSnapStorageBatch(task.accountHash, row.slots)
              this.spine.storageSlotsSynced += row.slots.length
              this.snapStore?.appendStorageSlots(task.accountHash, row.slots)
            }
            if (row.hasRight && row.lastKey !== undefined) {
              task.origin = incrementKey32(row.lastKey)
            } else {
              this.markStorageAccountDone(accKey)
            }
          }
          for (const t of tasks) {
            if (t.verifying) t.verifying = false
          }
          this.snapStore?.persistContractProgress(
            this.spine.codesTotal ?? 0,
            this.spine.codesSynced,
            this.spine.storageAccountsTotal ?? 0,
            this.spine.storageAccountsSynced ?? 0,
            this.spine.storageSlotsSynced,
          )
          this.publishPending()
        } finally {
          resolve()
        }
      })
    })
  }

  private handleByteCodes(peerId: string, payload: Uint8Array): void {
    const replyId = snapReplyRequestId(payload)
    if (replyId === undefined) return
    const flightKey = inFlightKey(peerId, replyId)
    const flight = this.codesInFlight.get(flightKey)
    if (flight === undefined) return
    if (flight.rootGeneration !== this.flightTracker.rootGeneration) {
      this.codesInFlight.delete(flightKey)
      this.flightTracker.release(peerId, flight.reqId)
      return
    }
    this.codesInFlight.delete(flightKey)
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
      const hash = ethyKeccak256(raw)
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
          this.spine.codesSynced++
          recordDiagnostic(this.spine, {
            subsystem: 'snap',
            severity: 'warn',
            peerId,
            message: `bytecode miss for ${bytesToHexShort(missed)}`,
          })
        }
      }
    }
    this.snapStore?.persistContractProgress(
      this.spine.codesTotal ?? 0,
      this.spine.codesSynced,
      this.spine.storageAccountsTotal ?? 0,
      this.spine.storageAccountsSynced ?? 0,
      this.spine.storageSlotsSynced,
    )
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
      this.codeQueue.size < this.maxInMemoryContractTasks &&
      this.pendingStorage.size < this.maxInMemoryContractTasks &&
      (this.snapStore?.contractScanRemaining() === true || this.contractsSpilledOnDisk > 0)
    ) {
      if (this.snapStore !== undefined) {
        const batch = this.snapStore.nextContractScanBatch(512)
        if (batch.length === 0) break
        this.noteAccounts(batch, { fromDiskRefill: true })
        if (!this.hasRestoredTotals) {
          const frac = this.snapStore.contractScanFraction()
          if (frac >= 0.005) {
            this.spine.codesTotal = Math.max(
              this.spine.codesSynced + this.codeQueue.size,
              Math.round(this.countedCodeHashes.size / frac),
            )
            this.spine.storageAccountsTotal = Math.max(
              (this.spine.storageAccountsSynced ?? 0) + this.pendingStorage.size,
              Math.round(this.countedStorageAccounts.size / frac),
            )
          }
        }
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
      this.noteAccounts(entries, { fromDiskRefill: true })
    }
  }

  /** Restore contract totals after session resume (WP-06f). */
  restoreContractTotals(totals: {
    codesTotal: number
    codesSynced: number
    storageAccountsTotal: number
    storageAccountsSynced: number
    storageSlotsSynced: number
  }): void {
    this.spine.codesTotal = totals.codesTotal
    this.spine.codesSynced = totals.codesSynced
    this.spine.storageAccountsTotal = totals.storageAccountsTotal
    this.spine.storageAccountsSynced = totals.storageAccountsSynced
    this.spine.storageSlotsSynced = totals.storageSlotsSynced
    this.lastContractsDone = totals.codesSynced + totals.storageAccountsSynced
    this.hasRestoredTotals =
      totals.codesTotal > totals.codesSynced ||
      totals.storageAccountsTotal > totals.storageAccountsSynced ||
      this.snapStore?.contractScanRemaining() !== true
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
