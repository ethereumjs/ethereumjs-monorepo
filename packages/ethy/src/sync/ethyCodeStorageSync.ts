import {
  type Devp2pWorkerClient,
  EthyMessageCodes,
  type WorkerPeerSnapshot,
} from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import type { FlatStateManager } from '@ethereumjs/statemanager'
import {
  KECCAK256_NULL,
  KECCAK256_RLP,
  bigIntToUnpaddedBytes,
  bytesToUnprefixedHex,
  equalsBytes,
  hexToBytes,
  intToUnpaddedBytes,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

import { pickEthyCustodianForBucket } from '../custody/custodyPeerPick.ts'
import {
  parseProvenCodePairs,
  parseProvenStorageKind2Entries,
  storageSlotsFromKindSlab,
} from '../custody/custodyStorageCodec.ts'
import { peerIdToBytes } from '../net/pivotHeader.ts'
import type { SnapPivotStore } from '../persist/snapStore.ts'
import type { EthySpine } from '../spine/types.ts'
import type { IngestedAccountMeta } from './accountSync.ts'
import { verifyProvenStorageKind2Slab } from './snapVerifyJob.ts'

const MAX_CODE_BATCH = 64
const MAX_KIND2_PAIRS = 64

type StorageTask = { accountHash: Uint8Array; storageRoot: Uint8Array }

type PendingRow = {
  kind: 0 | 2
  bucketHint: number
  storageAccountKeys?: string[]
}

/** Background ETHY/0 code + storage plane sync for custody buckets (WP-16d). */
export class EthyCodeStorageSynchronizer {
  private readonly spine: EthySpine
  private readonly client: Devp2pWorkerClient
  private readonly stateManager: FlatStateManager
  private readonly snapStore?: SnapPivotStore
  private readonly buckets: number[]
  private readonly getPeers: () => WorkerPeerSnapshot[]
  private readonly onCodePlaneComplete?: (bucketIndex: number) => void
  private readonly onStoragePlaneComplete?: (bucketIndex: number) => void
  private running = false
  private nextReqId = 2000n
  private readonly pending = new Map<string, PendingRow>()
  private readonly codeQueueByBucket = new Map<number, Set<string>>()
  private readonly storageQueueByBucket = new Map<number, Map<string, StorageTask>>()
  private readonly codeInFlight = new Set<number>()
  private readonly storageInFlight = new Set<number>()

  constructor(opts: {
    spine: EthySpine
    client: Devp2pWorkerClient
    stateManager: FlatStateManager
    snapStore?: SnapPivotStore
    buckets: number[]
    getPeers: () => WorkerPeerSnapshot[]
    onCodeBatchForBucket?: (bucketIndex: number) => void
    onStorageBatchForBucket?: (bucketIndex: number) => void
  }) {
    this.spine = opts.spine
    this.client = opts.client
    this.stateManager = opts.stateManager
    this.snapStore = opts.snapStore
    this.buckets = opts.buckets
    this.getPeers = opts.getPeers
    this.onCodePlaneComplete = opts.onCodeBatchForBucket
    this.onStoragePlaneComplete = opts.onStorageBatchForBucket
    for (const b of opts.buckets) {
      this.codeQueueByBucket.set(b, new Set())
      this.storageQueueByBucket.set(b, new Map())
    }
  }

  start(): void {
    this.running = true
    this.spine.custodyBackgroundActive = true
    if (this.snapStore !== undefined) {
      const root = this.snapStore.activePivotRootDir()
      if (root !== undefined) {
        this.client.setSharedCodeDir(`${root}/code`)
        this.client.setEthyStorageDir(`${root}/storage`)
      }
    }
  }

  stop(): void {
    this.running = false
    this.spine.custodyBackgroundActive = false
    this.pending.clear()
    this.codeInFlight.clear()
    this.storageInFlight.clear()
  }

  isRunning(): boolean {
    return this.running
  }

  noteAccounts(entries: IngestedAccountMeta[]): void {
    if (!this.running) return
    for (const { accountHash, codeHash, storageRoot } of entries) {
      const bucket = accountHash[0]! >> 4
      if (!this.buckets.includes(bucket)) continue
      if (!equalsBytes(codeHash, KECCAK256_NULL)) {
        const already =
          this.stateManager.getCodeByHash(codeHash) !== undefined ||
          this.snapStore?.hasPersistedCode(codeHash) === true
        if (!already) {
          this.codeQueueByBucket.get(bucket)?.add(bytesToUnprefixedHex(codeHash))
        }
      }
      if (!equalsBytes(storageRoot, KECCAK256_RLP)) {
        const acctKey = bytesToUnprefixedHex(accountHash)
        const already = this.snapStore?.hasPersistedStorageAccount(accountHash) === true
        if (!already) {
          this.storageQueueByBucket.get(bucket)?.set(acctKey, {
            accountHash: new Uint8Array(accountHash),
            storageRoot: new Uint8Array(storageRoot),
          })
        }
      }
    }
    this.schedule()
  }

  requestCode(peerId: string, reqId: bigint, codeHash: Uint8Array): void {
    if (!this.running) return
    const bucket = codeHash[0]! >> 4
    this.codeInFlight.add(bucket)
    this.pending.set(this.reqKey(peerId, reqId), {
      kind: 0,
      bucketHint: bucket,
    })
    this.client.sendEthyMessage(
      peerIdToBytes(peerId),
      EthyMessageCodes.GET_PROVEN_STORAGE_OR_CODE,
      RLP.encode([bigIntToUnpaddedBytes(reqId), intToUnpaddedBytes(0), [codeHash]] as never),
    )
  }

  handleEthyResponse(peerId: string, code: number, payload: Uint8Array): void {
    if (code !== EthyMessageCodes.PROVEN_STORAGE_OR_CODE) return
    const decoded = RLP.decode(payload) as unknown[]
    const reqBytes = decoded[0]
    if (!(reqBytes instanceof Uint8Array)) return
    let reqId: bigint
    try {
      reqId = BigInt(`0x${bytesToUnprefixedHex(reqBytes)}`)
    } catch {
      return
    }
    const key = this.reqKey(peerId, reqId)
    const row = this.pending.get(key)
    if (row === undefined) return
    this.pending.delete(key)
    if (row.kind === 0) {
      void this.ingestCodeResponse(decoded, row.bucketHint).then(() => {
        this.codeInFlight.delete(row.bucketHint)
        this.maybeCompleteCodePlane(row.bucketHint)
        this.schedule()
      })
      return
    }
    void this.ingestStorageKind2(decoded, row.bucketHint, row.storageAccountKeys ?? []).then(() => {
      this.storageInFlight.delete(row.bucketHint)
      this.maybeCompleteStoragePlane(row.bucketHint)
      this.schedule()
    })
  }

  private async ingestCodeResponse(decoded: unknown[], bucketHint: number): Promise<void> {
    const pairs = parseProvenCodePairs(decoded)
    const queue = this.codeQueueByBucket.get(bucketHint)
    for (const [hash, bytecode] of pairs) {
      if (bytecode.length === 0) continue
      if (!equalsBytes(keccak_256(bytecode), hash)) continue
      this.snapStore?.appendCode(hash, bytecode)
      queue?.delete(bytesToUnprefixedHex(hash))
    }
  }

  private async ingestStorageKind2(
    decoded: unknown[],
    bucketHint: number,
    requestedKeys: string[],
  ): Promise<void> {
    const queue = this.storageQueueByBucket.get(bucketHint)
    const entries = parseProvenStorageKind2Entries(decoded)
    for (const entry of entries) {
      const acctKey = bytesToUnprefixedHex(entry.accountHash)
      if (entry.slotsSlab64B.length === 0) continue
      const verified = await verifyProvenStorageKind2Slab(entry.storageRoot, entry.slotsSlab64B)
      if (!verified.ok) continue
      const slots = storageSlotsFromKindSlab(entry.slotsSlab64B)
      await this.snapStore?.appendStorageSlots(entry.accountHash, slots)
      queue?.delete(acctKey)
    }
    for (const key of requestedKeys) {
      const task = queue?.get(key)
      if (task === undefined) continue
      const hit = entries.some((e) => bytesToUnprefixedHex(e.accountHash) === key)
      if (!hit) continue
      const slab = entries.find((e) => bytesToUnprefixedHex(e.accountHash) === key)?.slotsSlab64B
      if (slab !== undefined && slab.length === 0) {
        queue?.delete(key)
      }
    }
  }

  private schedule(): void {
    if (!this.running) return
    const peers = this.getPeers()
    for (const bucket of this.buckets) {
      if (!this.codeInFlight.has(bucket)) {
        const peer = pickEthyCustodianForBucket(peers, bucket, 'code')
        const codes = this.drainCodeBatch(bucket)
        if (peer !== undefined && codes.length > 0) {
          const reqId = this.allocReqId()
          this.codeInFlight.add(bucket)
          this.pending.set(this.reqKey(peer.id, reqId), { kind: 0, bucketHint: bucket })
          this.client.sendEthyMessage(
            peerIdToBytes(peer.id),
            EthyMessageCodes.GET_PROVEN_STORAGE_OR_CODE,
            RLP.encode([bigIntToUnpaddedBytes(reqId), intToUnpaddedBytes(0), codes] as never),
          )
        }
      }
      if (!this.storageInFlight.has(bucket)) {
        const peer = pickEthyCustodianForBucket(peers, bucket, 'storage')
        const pairs = this.drainStoragePairs(bucket)
        if (peer !== undefined && pairs.length > 0) {
          const reqId = this.allocReqId()
          this.storageInFlight.add(bucket)
          const accountKeys = pairs.map((p) => bytesToUnprefixedHex(p[0]))
          this.pending.set(this.reqKey(peer.id, reqId), {
            kind: 2,
            bucketHint: bucket,
            storageAccountKeys: accountKeys,
          })
          this.client.sendEthyMessage(
            peerIdToBytes(peer.id),
            EthyMessageCodes.GET_PROVEN_STORAGE_OR_CODE,
            RLP.encode([
              bigIntToUnpaddedBytes(reqId),
              intToUnpaddedBytes(2),
              pairs.map((p) => [p[0], p[1]]),
            ] as never),
          )
        }
      }
      this.maybeCompleteCodePlane(bucket)
      this.maybeCompleteStoragePlane(bucket)
    }
  }

  private drainCodeBatch(bucket: number): Uint8Array[] {
    const queue = this.codeQueueByBucket.get(bucket)
    if (queue === undefined || queue.size === 0) return []
    const out: Uint8Array[] = []
    for (const hex of queue) {
      if (out.length >= MAX_CODE_BATCH) break
      try {
        const hash = hexToBytes(`0x${hex}`)
        if (hash.length === 32) out.push(hash)
      } catch {
        queue.delete(hex)
      }
    }
    return out
  }

  private drainStoragePairs(bucket: number): Array<[Uint8Array, Uint8Array]> {
    const queue = this.storageQueueByBucket.get(bucket)
    if (queue === undefined || queue.size === 0) return []
    const out: Array<[Uint8Array, Uint8Array]> = []
    for (const task of queue.values()) {
      if (out.length >= MAX_KIND2_PAIRS) break
      out.push([task.accountHash, task.storageRoot])
    }
    return out
  }

  private maybeCompleteCodePlane(bucket: number): void {
    const queue = this.codeQueueByBucket.get(bucket)
    if (queue === undefined || queue.size > 0) return
    if (this.codeInFlight.has(bucket)) return
    if ([...this.pending.values()].some((p) => p.kind === 0 && p.bucketHint === bucket)) return
    this.onCodePlaneComplete?.(bucket)
  }

  private maybeCompleteStoragePlane(bucket: number): void {
    const queue = this.storageQueueByBucket.get(bucket)
    if (queue === undefined || queue.size > 0) return
    if (this.storageInFlight.has(bucket)) return
    if ([...this.pending.values()].some((p) => p.kind === 2 && p.bucketHint === bucket)) return
    this.onStoragePlaneComplete?.(bucket)
  }

  private allocReqId(): bigint {
    this.nextReqId += 1n
    return this.nextReqId
  }

  private reqKey(peerId: string, reqId: bigint): string {
    return `${peerId}:${reqId.toString(16)}`
  }
}
