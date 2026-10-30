import { verifyMerkleRangeProof } from '@ethereumjs/mpt'
import { RLP } from '@ethereumjs/rlp'
import type { FlatStateManager } from '@ethereumjs/statemanager'
import {
  type BALJSONBlockAccessList,
  KECCAK256_NULL,
  KECCAK256_RLP,
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  equalsBytes,
  hexToBytes,
  setLengthLeft,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3'

import { type SnapPivotStore, snapBucketsUnfinished } from '../persist/snapStore.ts'
import { recordDiagnostic } from '../spine/diagnostics.ts'
import type { EthySpine } from '../spine/types.ts'
import type { IngestedAccountMeta } from './accountSync.ts'
import type { SnapPeerFlightTracker } from './snapFlight.ts'
import type { SnapTransport } from './snapTransport.ts'
import { incrementKey32 } from './syntheticPeer.ts'

const RESPONSE_BYTES = 128 * 1024
const MAX_CODE_HASHES = 64
const RANGE_TIMEOUT_MS = 20_000
const STORAGE_LIMIT = new Uint8Array(32).fill(0xff)

type StorageTask = {
  accountHash: Uint8Array
  storageRoot: Uint8Array
  origin: Uint8Array
  done: boolean
  missRetries: number
}

type CodeTask = {
  codeHash: Uint8Array
  missRetries: number
}

type InFlightStorage = { reqId: bigint; sentAt: number; taskIndex: number; rootGeneration: number }
type InFlightCodes = { reqId: bigint; sentAt: number; hashes: Uint8Array[]; rootGeneration: number }

export type SnapCodeAndStorageSynchronizerOpts = {
  spine: EthySpine
  stateManager: FlatStateManager
  transport: SnapTransport
  flightTracker: SnapPeerFlightTracker
  getSnapPeers: () => Array<{ id: string; caps: string[] }>
  snapStore?: SnapPivotStore
  peerBusy: (peerId: string) => boolean
}

export class SnapCodeAndStorageSynchronizer {
  private readonly spine: EthySpine
  private readonly stateManager: FlatStateManager
  private readonly transport: SnapTransport
  private readonly flightTracker: SnapPeerFlightTracker
  private readonly getSnapPeers: () => Array<{ id: string; caps: string[] }>
  private readonly snapStore?: SnapPivotStore
  private readonly peerBusy: (peerId: string) => boolean
  private reqId = 1n
  private codeQueue: CodeTask[] = []
  private storageTasks: StorageTask[] = []
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
    this.detachStorage?.()
    this.detachCodes?.()
    this.detachStorage = undefined
    this.detachCodes = undefined
    if (this.tickTimer !== undefined) clearInterval(this.tickTimer)
  }

  noteAccounts(entries: IngestedAccountMeta[]): void {
    for (const { accountHash, account } of entries) {
      if (!equalsBytes(account.codeHash, KECCAK256_NULL)) {
        if (!this.codeQueue.some((t) => equalsBytes(t.codeHash, account.codeHash))) {
          this.codeQueue.push({ codeHash: account.codeHash, missRetries: 0 })
        }
      }
      if (!equalsBytes(account.storageRoot, KECCAK256_RLP)) {
        if (
          !this.storageTasks.some(
            (t) => t.done === false && equalsBytes(t.accountHash, accountHash),
          )
        ) {
          this.storageTasks.push({
            accountHash,
            storageRoot: account.storageRoot,
            origin: new Uint8Array(32),
            done: false,
            missRetries: 0,
          })
        }
      }
    }
    this.publishPending()
  }

  clearPending(): void {
    this.codeQueue = []
    this.storageTasks = []
    this.storageInFlight.clear()
    this.codesInFlight.clear()
    this.publishPending()
  }

  /** Drop in-flight work and refresh storage roots after a pivot heal (D-058). */
  refreshAfterPivotHeal(): void {
    this.storageInFlight.clear()
    this.codesInFlight.clear()
    for (const task of this.storageTasks) {
      if (task.done) continue
      const acc = this.stateManager.getAccountByHash(task.accountHash)
      if (acc === undefined) {
        task.done = true
        continue
      }
      if (equalsBytes(acc.storageRoot, KECCAK256_RLP)) {
        task.done = true
        continue
      }
      if (!equalsBytes(task.storageRoot, acc.storageRoot)) {
        task.storageRoot = acc.storageRoot
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
      this.codeQueue.length === 0 &&
      this.storageTasks.every((t) => t.done) &&
      this.storageInFlight.size === 0 &&
      this.codesInFlight.size === 0
    )
  }

  invalidateAccount(accountHash: Uint8Array): void {
    for (const task of this.storageTasks) {
      if (equalsBytes(task.accountHash, accountHash)) {
        task.done = false
        task.origin = new Uint8Array(32)
        task.missRetries = 0
      }
    }
    this.codeQueue = this.codeQueue.filter((t) => {
      const acc = this.stateManager.getAccountByHash(accountHash)
      return acc === undefined || !equalsBytes(acc.codeHash, t.codeHash)
    })
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

      const codeBatch = this.codeQueue.slice(0, MAX_CODE_HASHES)
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

      const taskIndex = this.storageTasks.findIndex((t) => !t.done)
      if (taskIndex >= 0) {
        const task = this.storageTasks[taskIndex]!
        const reqId = this.reqId++
        if (!this.flightTracker.tryClaim(peer.id, { kind: 'storage', reqId, sentAt: now })) {
          continue
        }
        this.storageInFlight.set(peer.id, {
          reqId,
          sentAt: now,
          taskIndex,
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
      this.flightTracker.release(peerId)
    }
    for (const [peerId, flight] of this.codesInFlight) {
      if (now - flight.sentAt < RANGE_TIMEOUT_MS) continue
      this.codesInFlight.delete(peerId)
      this.flightTracker.release(peerId)
    }
  }

  private async handleStorageRanges(peerId: string, payload: Uint8Array): Promise<void> {
    const flight = this.storageInFlight.get(peerId)
    if (flight === undefined || this.spine.pivotStateRoot === undefined) return
    if (flight.rootGeneration !== this.flightTracker.rootGeneration) {
      this.storageInFlight.delete(peerId)
      this.flightTracker.release(peerId)
      return
    }
    const replyId = snapReplyRequestId(payload)
    if (replyId === undefined || replyId !== flight.reqId) return
    this.storageInFlight.delete(peerId)
    this.flightTracker.release(peerId)
    const task = this.storageTasks[flight.taskIndex]
    if (task === undefined || task.done) return

    const result = await ingestStorageRangesReply(
      task.storageRoot,
      payload,
      task.origin,
      (slots) => {
        this.stateManager.putSnapStorageBatch(task.accountHash, slots)
        this.spine.storageSlotsSynced += slots.length
        this.snapStore?.appendStorageSlots(task.accountHash, slots)
      },
    )
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
      task.done = true
    }
    this.publishPending()
  }

  private handleByteCodes(peerId: string, payload: Uint8Array): void {
    const flight = this.codesInFlight.get(peerId)
    if (flight === undefined) return
    if (flight.rootGeneration !== this.flightTracker.rootGeneration) {
      this.codesInFlight.delete(peerId)
      this.flightTracker.release(peerId)
      return
    }
    const replyId = snapReplyRequestId(payload)
    if (replyId === undefined || replyId !== flight.reqId) return
    this.codesInFlight.delete(peerId)
    this.flightTracker.release(peerId)

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
      this.codeQueue = this.codeQueue.filter((t) => !equalsBytes(t.codeHash, hash))
    }
    for (const missed of requested) {
      const task = this.codeQueue.find((t) => equalsBytes(t.codeHash, missed))
      if (task !== undefined) {
        task.missRetries++
        if (task.missRetries > 1) {
          this.codeQueue = this.codeQueue.filter((t) => !equalsBytes(t.codeHash, missed))
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
    this.spine.codesQueued = this.codeQueue.length
    this.spine.storageQueued = this.storageTasks.filter((task) => !task.done).length
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
  let decoded: unknown[]
  try {
    decoded = RLP.decode(replyPayload) as unknown[]
  } catch {
    return { ok: false, hasRight: false, reason: 'storage RLP decode failed' }
  }
  const ranges = decoded[1] as unknown
  const proofRaw = decoded[2]
  if (!Array.isArray(ranges) || ranges.length === 0) {
    return { ok: true, hasRight: false }
  }
  const slotsNested = ranges[0] as Array<[unknown, unknown]>
  if (!Array.isArray(slotsNested)) {
    return { ok: false, hasRight: false, reason: 'storage slots shape invalid' }
  }
  const keys: Uint8Array[] = []
  const values: Uint8Array[] = []
  const decodedSlots: Array<{ slotHash: Uint8Array; value: Uint8Array }> = []
  for (const [slotHashRaw, slotValueRlp] of slotsNested) {
    if (!(slotHashRaw instanceof Uint8Array) || !(slotValueRlp instanceof Uint8Array)) {
      return { ok: false, hasRight: false, reason: 'storage slot not bytes' }
    }
    if (slotValueRlp.length === 0) {
      return { ok: false, hasRight: false, reason: 'empty storage slot RLP' }
    }
    keys.push(slotHashRaw)
    values.push(slotValueRlp)
    let inner: Uint8Array
    try {
      const dec = RLP.decode(slotValueRlp)
      inner = dec instanceof Uint8Array ? dec : new Uint8Array(0)
    } catch {
      return { ok: false, hasRight: false, reason: 'storage slot inner decode failed' }
    }
    decodedSlots.push({ slotHash: slotHashRaw, value: inner })
  }
  let proof: Uint8Array[] | null = null
  if (Array.isArray(proofRaw)) {
    proof = proofRaw.map((n) => {
      if (!(n instanceof Uint8Array)) throw new Error('proof node not bytes')
      return n
    })
  }
  try {
    let hasRight: boolean
    if (proof !== null && proof.length === 0 && keys.length > 0) {
      hasRight = await verifyMerkleRangeProof(storageRoot, null, null, keys, values, null)
    } else if (proof !== null && proof.length > 0 && keys.length > 0) {
      const lastKey = keys[keys.length - 1]!
      hasRight = await verifyMerkleRangeProof(storageRoot, origin, lastKey, keys, values, proof)
    } else {
      return { ok: true, hasRight: false }
    }
    putBatch(decodedSlots)
    return { ok: true, hasRight, lastKey: keys[keys.length - 1] }
  } catch (err: unknown) {
    return {
      ok: false,
      hasRight: false,
      reason: err instanceof Error ? err.message : String(err),
    }
  }
}

function snapReplyRequestId(payload: Uint8Array): bigint | undefined {
  try {
    const decoded = RLP.decode(payload) as unknown[]
    const id = decoded[0]
    if (!(id instanceof Uint8Array)) return undefined
    if (id.length === 0) return 0n
    return bytesToBigInt(id)
  } catch {
    return undefined
  }
}

function bytesToHexShort(hash: Uint8Array): string {
  return `0x${Array.from(hash.slice(0, 4))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')}…`
}
