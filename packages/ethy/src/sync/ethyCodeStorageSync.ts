import { type Devp2pWorkerClient, EthyMessageCodes } from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import type { FlatStateManager } from '@ethereumjs/statemanager'
import {
  bigIntToUnpaddedBytes,
  bytesToUnprefixedHex,
  equalsBytes,
  intToUnpaddedBytes,
} from '@ethereumjs/util'
import { keccak_256 } from '@noble/hashes/sha3.js'

import { parseProvenCodePairs } from '../custody/custodyStorageCodec.ts'
import { peerIdToBytes } from '../net/pivotHeader.ts'
import type { SnapPivotStore } from '../persist/snapStore.ts'
import type { EthySpine } from '../spine/types.ts'

/** Background ETHY/0 code + storage plane sync for custody buckets (WP-16d). */
export class EthyCodeStorageSynchronizer {
  private readonly spine: EthySpine
  private readonly client: Devp2pWorkerClient
  private readonly snapStore?: SnapPivotStore
  private readonly buckets: number[]
  private readonly onCodeBatchForBucket?: (bucketIndex: number) => void
  private running = false
  private nextReqId = 2000n
  private readonly pending = new Map<string, { bucketHint: number }>()

  constructor(opts: {
    spine: EthySpine
    client: Devp2pWorkerClient
    stateManager: FlatStateManager
    snapStore?: SnapPivotStore
    buckets: number[]
    onCodeBatchForBucket?: (bucketIndex: number) => void
  }) {
    this.spine = opts.spine
    this.client = opts.client
    this.snapStore = opts.snapStore
    this.buckets = opts.buckets
    this.onCodeBatchForBucket = opts.onCodeBatchForBucket
    void opts.stateManager
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
  }

  isRunning(): boolean {
    return this.running
  }

  requestCodeBatch(peerId: string, codeHashes: Uint8Array[]): void {
    if (!this.running || codeHashes.length === 0) return
    const reqId = this.allocReqId()
    const bucketHint = codeHashes[0]![0]! >> 4
    this.pending.set(this.reqKey(peerId, reqId), { bucketHint })
    this.client.sendEthyMessage(
      peerIdToBytes(peerId),
      EthyMessageCodes.GET_PROVEN_STORAGE_OR_CODE,
      RLP.encode([bigIntToUnpaddedBytes(reqId), intToUnpaddedBytes(0), codeHashes] as never),
    )
  }

  requestCode(peerId: string, reqId: bigint, codeHash: Uint8Array): void {
    if (!this.running) return
    this.pending.set(this.reqKey(peerId, reqId), { bucketHint: codeHash[0]! >> 4 })
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
    if (this.pending.delete(key) === false) return
    const pairs = parseProvenCodePairs(decoded)
    let persisted = 0
    let bucketHint = 0
    for (const [hash, bytecode] of pairs) {
      if (bytecode.length === 0) continue
      if (!equalsBytes(keccak_256(bytecode), hash)) continue
      this.snapStore?.appendCode(hash, bytecode)
      bucketHint = hash[0]! >> 4
      persisted++
    }
    if (persisted > 0 && this.buckets.includes(bucketHint)) {
      this.onCodeBatchForBucket?.(bucketHint)
    }
  }

  private allocReqId(): bigint {
    this.nextReqId += 1n
    return this.nextReqId
  }

  private reqKey(peerId: string, reqId: bigint): string {
    return `${peerId}:${reqId.toString(16)}`
  }
}
