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
  bytesToBigInt,
  bytesToUnprefixedHex,
  equalsBytes,
  hexToBytes,
  intToUnpaddedBytes,
} from '@ethereumjs/util'

import { ethyKeccak256 } from '../crypto/keccak.ts'
import { pickEthyCustodianForBucket } from '../custody/custodyPeerPick.ts'
import {
  ethyWireKind,
  parseProvenCodePairs,
  parseProvenStorageKind2Entries,
  storageSlotsFromKindSlab,
} from '../custody/custodyStorageCodec.ts'
import { peerIdToBytes } from '../net/pivotHeader.ts'
import type { SnapPivotStore } from '../persist/snapStore.ts'
import type { EthySpine } from '../spine/types.ts'
import type { IngestedAccountMeta } from './accountSync.ts'
import { verifyProvenStorageKind1Job, verifyProvenStorageKind2Slab } from './snapVerifyJob.ts'
import { incrementKey32 } from './syntheticPeer.ts'

const MAX_CODE_BATCH = 64
const MAX_KIND2_PAIRS = 64

type StorageTask = { accountHash: Uint8Array; storageRoot: Uint8Array }

type PendingRow = {
  kind: 0 | 1 | 2
  bucketHint: number
  storageAccountKeys?: string[]
  storageKind1AccountKey?: string
}

type StorageKind1Task = StorageTask & { originSlotHash: Uint8Array }

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
  private readonly storageKind1ByBucket = new Map<number, Map<string, StorageKind1Task>>()
  private readonly storageKind1InFlight = new Set<number>()
  private readonly waitForAccountsFinish: boolean
  private readonly accountsFinished = new Set<number>()
  private readonly codePlaneCompleted = new Set<number>()
  private readonly storagePlaneCompleted = new Set<number>()

  constructor(opts: {
    spine: EthySpine
    client: Devp2pWorkerClient
    stateManager: FlatStateManager
    snapStore?: SnapPivotStore
    buckets: number[]
    getPeers: () => WorkerPeerSnapshot[]
    waitForAccountsFinish?: boolean
    onCodeBatchForBucket?: (bucketIndex: number) => void
    onStorageBatchForBucket?: (bucketIndex: number) => void
  }) {
    this.spine = opts.spine
    this.client = opts.client
    this.stateManager = opts.stateManager
    this.snapStore = opts.snapStore
    this.buckets = opts.buckets
    this.getPeers = opts.getPeers
    this.waitForAccountsFinish = opts.waitForAccountsFinish === true
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
      this.client.setSharedCodeDir(this.snapStore.sharedCodeDir())
      const storageChunksDir = this.snapStore.activePivotStorageChunksDir()
      if (storageChunksDir !== undefined) {
        this.client.setEthyStorageDir(storageChunksDir)
      }
    }
  }

  stop(): void {
    this.running = false
    this.spine.custodyBackgroundActive = false
    this.pending.clear()
    this.codeInFlight.clear()
    this.storageInFlight.clear()
    this.storageKind1ByBucket.clear()
    this.storageKind1InFlight.clear()
    this.accountsFinished.clear()
    this.codePlaneCompleted.clear()
    this.storagePlaneCompleted.clear()
  }

  /** Signal that the accounts plane for `bucket` has finished downloading all chunks. */
  markAccountsFinished(bucket: number): void {
    if (!this.buckets.includes(bucket)) return
    this.accountsFinished.add(bucket)
    if (!this.running) return
    this.maybeCompleteCodePlane(bucket)
    this.maybeCompleteStoragePlane(bucket)
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
      reqId = bytesToBigInt(reqBytes)
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
    if (row.kind === 2) {
      void this.ingestStorageKind2(decoded, row.bucketHint, row.storageAccountKeys ?? []).then(
        () => {
          this.storageInFlight.delete(row.bucketHint)
          this.maybeCompleteStoragePlane(row.bucketHint)
          this.schedule()
        },
      )
      return
    }
    void this.ingestStorageKind1(decoded, row.bucketHint, row.storageKind1AccountKey).then(() => {
      this.storageKind1InFlight.delete(row.bucketHint)
      this.maybeCompleteStoragePlane(row.bucketHint)
      this.schedule()
    })
  }

  private async ingestCodeResponse(decoded: unknown[], bucketHint: number): Promise<void> {
    const pairs = parseProvenCodePairs(decoded)
    const queue = this.codeQueueByBucket.get(bucketHint)
    for (const [hash, bytecode] of pairs) {
      if (bytecode.length === 0) continue
      if (!equalsBytes(ethyKeccak256(bytecode), hash)) continue
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
      this.snapStore?.appendProvenStorageComplete({
        accountHash: entry.accountHash,
        storageRoot: entry.storageRoot,
        chunkBlockNumber: this.spine.pivotBlockNumber ?? 0n,
        slotsSlab64B: entry.slotsSlab64B,
      })
      queue?.delete(acctKey)
    }
    for (const key of requestedKeys) {
      if (queue?.has(key) !== true) continue
      const entry = entries.find((e) => bytesToUnprefixedHex(e.accountHash) === key)
      if (entry === undefined || entry.slotsSlab64B.length === 0) {
        const task = queue.get(key)
        if (task !== undefined) {
          queue.delete(key)
          this.enqueueStorageKind1(bucketHint, key, task)
        }
      }
    }
  }

  private enqueueStorageKind1(bucket: number, accountKey: string, task: StorageTask): void {
    let row = this.storageKind1ByBucket.get(bucket)
    if (row === undefined) {
      row = new Map()
      this.storageKind1ByBucket.set(bucket, row)
    }
    if (!row.has(accountKey)) {
      row.set(accountKey, {
        accountHash: task.accountHash,
        storageRoot: task.storageRoot,
        originSlotHash: new Uint8Array(32),
      })
    }
  }

  private async ingestStorageKind1(
    decoded: unknown[],
    bucketHint: number,
    accountKey: string | undefined,
  ): Promise<void> {
    if (accountKey === undefined || ethyWireKind(decoded[1]) !== 1) return
    const kind1Row = this.storageKind1ByBucket.get(bucketHint)?.get(accountKey)
    const queue = this.storageQueueByBucket.get(bucketHint)
    const task = kind1Row ?? queue?.get(accountKey)
    if (task === undefined) return
    const storageRoot = decoded[3]
    if (!(storageRoot instanceof Uint8Array) || !equalsBytes(storageRoot, task.storageRoot)) {
      return
    }
    const origin = decoded[5]
    const last = decoded[6]
    const hasRight = ethyWireKind(decoded[7]) !== 0
    const slab = (decoded[8] as Uint8Array) ?? new Uint8Array(0)
    const proofs = (decoded[9] as Uint8Array[]) ?? []
    if (!(origin instanceof Uint8Array)) return
    const verified = await verifyProvenStorageKind1Job({
      storageRoot: task.storageRoot,
      originSlotHash: origin,
      slotsSlab64B: slab,
      proofNodes: proofs,
      hasRightHint: hasRight,
    })
    if (!verified.ok) return
    const chunkBlockField = decoded[4]
    const chunkBlockNumber =
      chunkBlockField instanceof Uint8Array && chunkBlockField.length > 0
        ? bytesToBigInt(chunkBlockField)
        : (this.spine.pivotBlockNumber ?? 0n)
    if (slab.length > 0) {
      const slots = storageSlotsFromKindSlab(slab)
      await this.snapStore?.appendStorageSlots(task.accountHash, slots)
    }
    if (last instanceof Uint8Array && last.length === 32) {
      this.snapStore?.appendProvenStorageChunk({
        accountHash: task.accountHash,
        storageRoot: task.storageRoot,
        chunkBlockNumber,
        originSlotHash: origin,
        lastSlotHash: last,
        hasRight: hasRight ? 1 : 0,
        slotsSlab64B: slab,
        proofNodes: proofs,
      })
    }
    if (hasRight && last instanceof Uint8Array) {
      const nextOrigin = incrementKey32(last)
      const row = this.storageKind1ByBucket.get(bucketHint)
      if (row?.has(accountKey)) {
        row.set(accountKey, {
          accountHash: task.accountHash,
          storageRoot: task.storageRoot,
          originSlotHash: nextOrigin,
        })
      }
      return
    }
    queue?.delete(accountKey)
    this.storageKind1ByBucket.get(bucketHint)?.delete(accountKey)
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
      if (!this.storageKind1InFlight.has(bucket)) {
        const peer = pickEthyCustodianForBucket(peers, bucket, 'storage')
        const crawl = this.drainStorageKind1(bucket)
        if (peer !== undefined && crawl !== undefined) {
          const reqId = this.allocReqId()
          this.storageKind1InFlight.add(bucket)
          const acctKey = bytesToUnprefixedHex(crawl.accountHash)
          this.pending.set(this.reqKey(peer.id, reqId), {
            kind: 1,
            bucketHint: bucket,
            storageKind1AccountKey: acctKey,
          })
          this.client.sendEthyMessage(
            peerIdToBytes(peer.id),
            EthyMessageCodes.GET_PROVEN_STORAGE_OR_CODE,
            RLP.encode([
              bigIntToUnpaddedBytes(reqId),
              intToUnpaddedBytes(1),
              crawl.accountHash,
              crawl.storageRoot,
              crawl.originSlotHash,
            ] as never),
          )
        }
      }
      this.maybeCompleteCodePlane(bucket)
      this.maybeCompleteStoragePlane(bucket)
    }
  }

  private drainStorageKind1(bucket: number): StorageKind1Task | undefined {
    const row = this.storageKind1ByBucket.get(bucket)
    if (row === undefined || row.size === 0) return undefined
    const first = row.values().next().value
    return first
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
    if (this.codePlaneCompleted.has(bucket)) return
    if (this.waitForAccountsFinish && !this.accountsFinished.has(bucket)) return
    const queue = this.codeQueueByBucket.get(bucket)
    if (queue === undefined || queue.size > 0) return
    if (this.codeInFlight.has(bucket)) return
    if ([...this.pending.values()].some((p) => p.kind === 0 && p.bucketHint === bucket)) return
    this.codePlaneCompleted.add(bucket)
    this.onCodePlaneComplete?.(bucket)
  }

  private maybeCompleteStoragePlane(bucket: number): void {
    if (this.storagePlaneCompleted.has(bucket)) return
    if (this.waitForAccountsFinish && !this.accountsFinished.has(bucket)) return
    const queue = this.storageQueueByBucket.get(bucket)
    const kind1 = this.storageKind1ByBucket.get(bucket)
    if (queue === undefined || queue.size > 0) return
    if (kind1 !== undefined && kind1.size > 0) return
    if (this.storageInFlight.has(bucket)) return
    if (this.storageKind1InFlight.has(bucket)) return
    if (
      [...this.pending.values()].some(
        (p) => (p.kind === 2 || p.kind === 1) && p.bucketHint === bucket,
      )
    ) {
      return
    }
    this.storagePlaneCompleted.add(bucket)
    this.onStoragePlaneComplete?.(bucket)
  }

  private allocReqId(): bigint {
    this.nextReqId += 1n
    return this.nextReqId
  }

  private reqKey(peerId: string, reqId: bigint): string {
    return `${peerId.toLowerCase()}:${reqId.toString(16)}`
  }
}
