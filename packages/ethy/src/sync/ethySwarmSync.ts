import type { Devp2pWorkerClient } from '@ethereumjs/devp2p'
import { EthyMessageCodes } from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import type { FlatStateManager } from '@ethereumjs/statemanager'
import {
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToInt,
  equalsBytes,
  intToUnpaddedBytes,
} from '@ethereumjs/util'

import { activeHardfork, chainConfigForNetwork } from '../net/chainHardfork.ts'
import { peerIdToBytes } from '../net/pivotHeader.ts'
import type { SnapPivotStore } from '../persist/snapStore.ts'
import { syncBucketCursorFields } from '../spine/buckets.ts'
import { recordDiagnostic } from '../spine/diagnostics.ts'
import type { EthySpine } from '../spine/types.ts'
import type { IngestedAccountMeta } from './accountSync.ts'
import { applyBlockBal, pushBalWindow } from './balSync.ts'
import { headFieldsFromHeaderRlp } from './blockBundle.ts'
import { verifyProvenAccountChunkJob } from './snapVerifyJob.ts'
import { incrementKey32, ingestedMetaFromBinarySlab } from './syntheticPeer.ts'

const MAX_CHUNK_PIPELINE = 2
const MAX_BAL_RANGE = 32

export type EthySwarmSyncOpts = {
  spine: EthySpine
  stateManager: FlatStateManager
  client: Devp2pWorkerClient
  snapStore?: SnapPivotStore
  seederPeerId: string
  seedBucketsBitmask: number
  chunkStateRoot: Uint8Array
  pivotBlockNumber: bigint
  balThroughBlock: bigint
  onAccountsIngested?: (entries: IngestedAccountMeta[]) => void
  onBucketDone?: (bucketIndex: number) => void
  onAccountsComplete?: () => void
  onSwarmComplete?: () => void
}

type ManifestEntry = {
  originHash: Uint8Array
  lastHash: Uint8Array
  hasRight: number
}

type ChunkFlight = {
  bucketIndex: number
  originHash: Uint8Array
  reqId: bigint
}

function asBytes(v: unknown): Uint8Array | undefined {
  return v instanceof Uint8Array ? v : undefined
}

function parseBucketManifest(payload: Uint8Array):
  | {
      reqId: bigint
      bucketIndex: number
      entries: ManifestEntry[]
    }
  | undefined {
  let decoded: unknown
  try {
    decoded = RLP.decode(payload)
  } catch {
    return undefined
  }
  if (!Array.isArray(decoded) || decoded.length < 3) return undefined
  const reqIdRaw = decoded[0]
  const bucketRaw = decoded[1]
  const entriesRaw = decoded[2]
  if (!(reqIdRaw instanceof Uint8Array) || !(bucketRaw instanceof Uint8Array)) return undefined
  if (!Array.isArray(entriesRaw)) return undefined
  const entries: ManifestEntry[] = []
  for (const row of entriesRaw) {
    if (!Array.isArray(row) || row.length < 3) continue
    const origin = asBytes(row[0])
    const last = asBytes(row[1])
    const hasRightRaw = row[2]
    if (origin === undefined || last === undefined) continue
    const hasRight =
      hasRightRaw instanceof Uint8Array && hasRightRaw.length > 0 ? bytesToInt(hasRightRaw) : 0
    entries.push({ originHash: origin, lastHash: last, hasRight })
  }
  return {
    reqId: bytesToBigInt(reqIdRaw),
    bucketIndex: bytesToInt(bucketRaw),
    entries,
  }
}

function parseProvenAccountChunk(payload: Uint8Array):
  | {
      reqId: bigint
      bucketIndex: number
      originHash: Uint8Array
      lastHash: Uint8Array
      hasRight: number
      chunkStateRoot: Uint8Array
      chunkBlockNumber: bigint
      binaryAccountsSlab: Uint8Array
      proofNodes: Uint8Array[]
    }
  | undefined {
  let decoded: unknown
  try {
    decoded = RLP.decode(payload)
  } catch {
    return undefined
  }
  if (!Array.isArray(decoded) || decoded.length < 9) return undefined
  const reqIdRaw = decoded[0]
  const bucketRaw = decoded[1]
  const origin = asBytes(decoded[2])
  const last = asBytes(decoded[3])
  const hasRightRaw = decoded[4]
  const root = asBytes(decoded[5])
  const blockRaw = decoded[6]
  const slab = asBytes(decoded[7])
  const proofRaw = decoded[8]
  if (
    !(reqIdRaw instanceof Uint8Array) ||
    !(bucketRaw instanceof Uint8Array) ||
    origin === undefined ||
    last === undefined ||
    root === undefined ||
    slab === undefined ||
    !(blockRaw instanceof Uint8Array)
  ) {
    return undefined
  }
  if (!Array.isArray(proofRaw)) return undefined
  const proofNodes: Uint8Array[] = []
  for (const node of proofRaw) {
    if (!(node instanceof Uint8Array)) return undefined
    proofNodes.push(node)
  }
  const hasRight =
    hasRightRaw instanceof Uint8Array && hasRightRaw.length > 0 ? bytesToInt(hasRightRaw) : 0
  return {
    reqId: bytesToBigInt(reqIdRaw),
    bucketIndex: bytesToInt(bucketRaw),
    originHash: origin,
    lastHash: last,
    hasRight,
    chunkStateRoot: root,
    chunkBlockNumber: bytesToBigInt(blockRaw),
    binaryAccountsSlab: slab,
    proofNodes,
  }
}

function parseBalRange(payload: Uint8Array):
  | Array<{
      blockNumber: bigint
      headerRlp: Uint8Array
      balRlp: Uint8Array
    }>
  | undefined {
  let decoded: unknown
  try {
    decoded = RLP.decode(payload)
  } catch {
    return undefined
  }
  if (!Array.isArray(decoded) || decoded.length < 2) return undefined
  const rows = decoded[1]
  if (!Array.isArray(rows)) return undefined
  const out: Array<{ blockNumber: bigint; headerRlp: Uint8Array; balRlp: Uint8Array }> = []
  for (const row of rows) {
    if (!Array.isArray(row) || row.length < 3) continue
    const numRaw = row[0]
    const header = asBytes(row[1])
    const bal = asBytes(row[2])
    if (!(numRaw instanceof Uint8Array) || header === undefined || bal === undefined) continue
    out.push({
      blockNumber: bytesToBigInt(numRaw),
      headerRlp: header,
      balRlp: bal,
    })
  }
  return out
}

export class EthySwarmSynchronizer {
  private readonly opts: EthySwarmSyncOpts
  private nextReqId = 1n
  private readonly chunkFlights = new Map<string, ChunkFlight>()
  private readonly manifestOrigins = new Map<number, Uint8Array[]>()
  private readonly chunksDone = new Set<string>()
  private readonly bucketsDone = new Set<number>()
  private balNext: bigint
  private balInFlight = false
  private accountsPassComplete = false
  private stopped = false
  private lastRateAt = Date.now()
  private lastAccountCount = 0

  constructor(opts: EthySwarmSyncOpts) {
    this.opts = opts
    this.balNext = opts.pivotBlockNumber + 1n
    this.lastAccountCount = opts.spine.totalAccountsSynced
  }

  start(): void {
    for (let b = 0; b < 16; b++) {
      if ((this.opts.seedBucketsBitmask & (1 << b)) === 0) continue
      this.requestManifest(b)
    }
  }

  stop(): void {
    this.stopped = true
  }

  isActive(): boolean {
    if (this.stopped) return false
    if (!this.accountsPassComplete) return true
    return this.balNext <= this.opts.balThroughBlock
  }

  handleMessage(peerId: string, code: number, payload: Uint8Array): void {
    if (this.stopped || peerId.toLowerCase() !== this.opts.seederPeerId.toLowerCase()) return
    if (code === EthyMessageCodes.BUCKET_MANIFEST) {
      void this.onBucketManifest(payload)
      return
    }
    if (code === EthyMessageCodes.PROVEN_ACCOUNT_CHUNK) {
      void this.onProvenChunk(payload)
      return
    }
    if (code === EthyMessageCodes.BAL_RANGE) {
      void this.onBalRange(payload)
    }
  }

  private flightKey(reqId: bigint): string {
    return reqId.toString()
  }

  private chunkDoneKey(bucket: number, origin: Uint8Array): string {
    return `${bucket}:${Buffer.from(origin).toString('hex')}`
  }

  private requestManifest(bucketIndex: number): void {
    const reqId = this.nextReqId++
    const payload = RLP.encode([
      bigIntToUnpaddedBytes(reqId),
      intToUnpaddedBytes(bucketIndex),
    ] as never)
    this.opts.client.sendEthyMessage(
      peerIdToBytes(this.opts.seederPeerId),
      EthyMessageCodes.GET_BUCKET_MANIFEST,
      payload,
    )
  }

  private pumpChunks(bucketIndex: number): void {
    const all = this.manifestOrigins.get(bucketIndex)
    if (all === undefined || all.length === 0) return
    let inFlight = 0
    for (const flight of this.chunkFlights.values()) {
      if (flight.bucketIndex === bucketIndex) inFlight++
    }
    for (const origin of all) {
      if (inFlight >= MAX_CHUNK_PIPELINE) break
      if (this.chunksDone.has(this.chunkDoneKey(bucketIndex, origin))) continue
      const alreadyQueued = [...this.chunkFlights.values()].some(
        (f) => f.bucketIndex === bucketIndex && equalsBytes(f.originHash, origin),
      )
      if (alreadyQueued) continue
      const reqId = this.nextReqId++
      const payload = RLP.encode([
        bigIntToUnpaddedBytes(reqId),
        intToUnpaddedBytes(bucketIndex),
        origin,
      ] as never)
      this.opts.client.sendEthyMessage(
        peerIdToBytes(this.opts.seederPeerId),
        EthyMessageCodes.GET_PROVEN_ACCOUNT_CHUNK,
        payload,
      )
      this.chunkFlights.set(this.flightKey(reqId), { bucketIndex, originHash: origin, reqId })
      inFlight++
    }
  }

  private async onBucketManifest(payload: Uint8Array): Promise<void> {
    const parsed = parseBucketManifest(payload)
    if (parsed === undefined) return
    const origins = parsed.entries.map((e) => new Uint8Array(e.originHash))
    this.manifestOrigins.set(parsed.bucketIndex, origins)
    if (origins.length === 0) {
      const bucket = this.opts.spine.snapBuckets[parsed.bucketIndex]
      if (bucket !== undefined && !this.bucketsDone.has(parsed.bucketIndex)) {
        this.bucketsDone.add(parsed.bucketIndex)
        bucket.status = 'done'
        bucket.subRanges = []
        syncBucketCursorFields(bucket)
        this.opts.onBucketDone?.(parsed.bucketIndex)
      }
      this.maybeFinishAccountsPass()
      return
    }
    const bucket = this.opts.spine.snapBuckets[parsed.bucketIndex]
    if (bucket !== undefined && bucket.status === 'pending') {
      bucket.status = 'syncing'
      bucket.assignedPeerId = this.opts.seederPeerId
    }
    this.pumpChunks(parsed.bucketIndex)
  }

  private async onProvenChunk(payload: Uint8Array): Promise<void> {
    const parsed = parseProvenAccountChunk(payload)
    if (parsed === undefined) return
    this.chunkFlights.delete(this.flightKey(parsed.reqId))
    if (parsed.binaryAccountsSlab.length === 0) {
      this.pumpChunks(parsed.bucketIndex)
      return
    }
    const proofCopy = parsed.proofNodes.map((n) => {
      const c = new Uint8Array(n.length)
      c.set(n)
      return c
    })
    const result = await verifyProvenAccountChunkJob({
      chunkStateRoot: parsed.chunkStateRoot,
      originHash: parsed.originHash,
      binaryAccountsSlab: parsed.binaryAccountsSlab,
      proofNodes: proofCopy,
      hasRightHint: parsed.hasRight !== 0,
    })
    if (!result.ok || result.slab === undefined || result.count === 0) {
      recordDiagnostic(this.opts.spine, {
        subsystem: 'devp2p',
        severity: 'warn',
        message: result.reason ?? 'ETHY proven chunk verify failed',
        peerId: this.opts.seederPeerId,
        bucketIndex: parsed.bucketIndex,
      })
      this.pumpChunks(parsed.bucketIndex)
      return
    }
    this.opts.stateManager.putSnapBinaryAccountsFromSlab(result.slab)
    this.opts.onAccountsIngested?.(ingestedMetaFromBinarySlab(result.slab))
    const bucket = this.opts.spine.snapBuckets[parsed.bucketIndex]
    if (bucket !== undefined) {
      bucket.accountsLoaded += result.count
      this.opts.spine.totalAccountsSynced += result.count
      if (result.lastKey instanceof Uint8Array) {
        bucket.currentLastHash = new Uint8Array(result.lastKey)
        if (bucket.subRanges !== undefined && bucket.subRanges.length > 0) {
          bucket.subRanges[0]!.origin = incrementKey32(result.lastKey)
        }
      }
    }
    const now = Date.now()
    const dt = (now - this.lastRateAt) / 1000
    if (dt >= 0.25) {
      const delta = this.opts.spine.totalAccountsSynced - this.lastAccountCount
      if (delta > 0) {
        this.opts.spine.accountsPerSec = delta / dt
        this.opts.spine.accountsPerMin = (delta / dt) * 60
      }
      this.lastAccountCount = this.opts.spine.totalAccountsSynced
      this.lastRateAt = now
    }
    const proof =
      result.rangeOrigin !== undefined && result.lastKey instanceof Uint8Array
        ? {
            slabByteOffset: 0,
            slabByteLength: result.slab.length,
            originHash: result.rangeOrigin,
            lastHash: result.lastKey,
            hasRight: result.hasRight ? 1 : 0,
            chunkStateRoot: parsed.chunkStateRoot,
            chunkBlockNumber: parsed.chunkBlockNumber,
            proofNodes: proofCopy,
          }
        : undefined
    await this.opts.snapStore?.appendVerifiedSlabAsync(
      parsed.bucketIndex,
      result.slab,
      this.opts.spine.snapBuckets,
      'prefix',
      proof,
    )
    this.chunksDone.add(this.chunkDoneKey(parsed.bucketIndex, parsed.originHash))
    const pending = this.manifestOrigins.get(parsed.bucketIndex) ?? []
    const allDone =
      pending.length > 0 &&
      pending.every((o) => this.chunksDone.has(this.chunkDoneKey(parsed.bucketIndex, o)))
    const bucketFinished =
      allDone ||
      (result.hasRight && pending.length <= 1) ||
      (result.hasRight && pending.length === 0)
    if (bucketFinished && !this.bucketsDone.has(parsed.bucketIndex)) {
      this.bucketsDone.add(parsed.bucketIndex)
      if (bucket !== undefined) {
        bucket.status = 'done'
        bucket.subRanges = []
        syncBucketCursorFields(bucket)
      }
      this.opts.onBucketDone?.(parsed.bucketIndex)
    }
    this.pumpChunks(parsed.bucketIndex)
    this.maybeFinishAccountsPass()
  }

  private maybeFinishAccountsPass(): void {
    if (this.accountsPassComplete) return
    for (let b = 0; b < 16; b++) {
      if ((this.opts.seedBucketsBitmask & (1 << b)) === 0) continue
      if (!this.bucketsDone.has(b)) return
    }
    this.accountsPassComplete = true
    this.opts.spine.accountsPerSec = 0
    this.opts.onAccountsComplete?.()
    if (this.balNext > this.opts.balThroughBlock) {
      this.opts.onSwarmComplete?.()
      return
    }
    this.requestBalRange()
  }

  private requestBalRange(): void {
    if (this.stopped || this.balInFlight) return
    if (this.balNext > this.opts.balThroughBlock) return
    this.balInFlight = true
    const reqId = this.nextReqId++
    const count = Number(
      this.balNext + BigInt(MAX_BAL_RANGE) > this.opts.balThroughBlock
        ? this.opts.balThroughBlock - this.balNext + 1n
        : BigInt(MAX_BAL_RANGE),
    )
    const payload = RLP.encode([
      bigIntToUnpaddedBytes(reqId),
      bigIntToUnpaddedBytes(this.balNext),
      intToUnpaddedBytes(count),
    ] as never)
    this.opts.client.sendEthyMessage(
      peerIdToBytes(this.opts.seederPeerId),
      EthyMessageCodes.GET_BAL_RANGE,
      payload,
    )
  }

  private async onBalRange(payload: Uint8Array): Promise<void> {
    this.balInFlight = false
    const blocks = parseBalRange(payload)
    if (blocks === undefined || blocks.length === 0) {
      this.balNext = this.opts.balThroughBlock + 1n
      this.opts.onSwarmComplete?.()
      return
    }
    const chain = chainConfigForNetwork(this.opts.spine.network)
    const hardfork = activeHardfork(chain)
    for (const block of blocks) {
      if (block.balRlp.length > 0 && block.headerRlp.length > 0) {
        const applied = await applyBlockBal(
          this.opts.stateManager,
          block.headerRlp,
          block.balRlp,
          chain,
          hardfork,
          this.opts.spine.snapBuckets,
        )
        if (!applied.ok) {
          recordDiagnostic(this.opts.spine, {
            subsystem: 'bal',
            severity: 'warn',
            message: `ETHY BAL_RANGE block #${block.blockNumber.toString()} rejected: ${applied.reason ?? 'invalid'}`,
            peerId: this.opts.seederPeerId,
          })
          return
        }
        if (applied.balJson !== undefined) {
          pushBalWindow(this.opts.spine, block.blockNumber, applied.balJson)
          this.opts.spine.appliedBalCount = (this.opts.spine.appliedBalCount ?? 0) + 1
        }
        const fields = headFieldsFromHeaderRlp(block.headerRlp, chain, hardfork)
        const pivot = this.opts.spine.pivotBlockNumber
        if (
          fields !== null &&
          this.opts.spine.phase === 'SNAP_SYNCING' &&
          pivot !== undefined &&
          block.blockNumber > pivot
        ) {
          this.opts.snapStore?.appendHealBundle({
            blockNumber: block.blockNumber,
            blockHash: fields.blockHash,
            stateRoot: fields.stateRoot,
            headerRlp: block.headerRlp,
            balRlp: block.balRlp,
          })
        } else {
          this.opts.snapStore?.appendHealBal(block.blockNumber, block.balRlp)
        }
      }
      this.opts.spine.lastVerifiedBlockNumber = block.blockNumber
      this.opts.spine.headBlockNumber = block.blockNumber
      this.balNext = block.blockNumber + 1n
    }
    if (this.balNext <= this.opts.balThroughBlock) {
      this.requestBalRange()
    } else {
      this.opts.onSwarmComplete?.()
    }
  }
}
