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
  }

  start(): void {
    if (this.detachStorage !== undefined) return
    this.detachStorage = this.transport.onStorageRanges((peerId, payload) => {
      enqueueProtocol(async () => {
        await this.handleStorageRanges(peerId, payload)
      })
    })
    this.detachCodes = this.transport.onByteCodes((peerId, payload) => {
      void this.handleByteCodes(peerId, payload)
    })
    this.tickTimer = setInterval(() => this.schedule(), 50)
    this.tickTimer.unref?.()
    this.schedule()
  }

  stop(): void {
    this.detachStorage?.()
    this.detachCodes?.()
    this.detachStorage = undefined
    this.detachCodes = undefined
    if (this.tickTimer !== undefined) clearInterval(this.tickTimer)
  }

  noteAccounts(entries: IngestedAccountMeta[]): void {
    for (const { accountHash, codeHash, storageRoot } of entries) {
      if (!equalsBytes(codeHash, KECCAK256_NULL)) {
        const key = codeHashKey(codeHash)
        if (!this.codeQueue.has(key)) {
          this.codeQueue.set(key, { codeHash: new Uint8Array(codeHash), missRetries: 0 })
        }
      }
      if (!equalsBytes(storageRoot, KECCAK256_RLP)) {
        const key = accountHashKey(accountHash)
        if (!this.pendingStorage.has(key)) {
          this.pendingStorage.set(key, {
            accountHash,
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
      this.codesInFlight.size === 0
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
            accountHash,
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
