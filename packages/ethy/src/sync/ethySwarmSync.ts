import type { Devp2pWorkerClient } from '@ethereumjs/devp2p'
import { EthyMessageCodes } from '@ethereumjs/devp2p'
import { RLP } from '@ethereumjs/rlp'
import type { FlatStateManager } from '@ethereumjs/statemanager'
import {
  bigIntToUnpaddedBytes,
  bytesToBigInt,
  bytesToInt,
  bytesToUnprefixedHex,
  equalsBytes,
  intToUnpaddedBytes,
} from '@ethereumjs/util'

import { createBlockLevelAccessListFromRLP } from '@ethereumjs/util'
import type { ETHEconomyDataManager } from '../economy/economyDataManager.ts'
import { activeHardfork, chainConfigForNetwork } from '../net/chainHardfork.ts'
import { peerIdToBytes } from '../net/pivotHeader.ts'
import type { SnapPivotStore } from '../persist/snapStore.ts'
import { computeAccountRangeFraction, syncBucketCursorFields } from '../spine/buckets.ts'
import { setPhase } from '../spine/createSpine.ts'
import { recordDiagnostic } from '../spine/diagnostics.ts'
import type { EthySpine } from '../spine/types.ts'
import type { IngestedAccountMeta } from './accountSync.ts'
import { applyBlockBal, extractBlockAccessListHashFromHeaderRlp, pushBalWindow } from './balSync.ts'
import { headFieldsFromHeaderRlp } from './blockBundle.ts'
import { verifyProvenAccountChunkJob } from './snapVerifyJob.ts'
import type { SnapVerifyPool } from './snapVerifyWorker.ts'
import { incrementKey32, ingestedMetaFromBinarySlab } from './syntheticPeer.ts'

const MAX_CHUNK_PIPELINE = 1
const MAX_TOTAL_CHUNKS_IN_FLIGHT = 16
const MAX_CHUNK_RETRIES = 2
const MAX_BAL_RANGE = 32
const ACCOUNT_SLAB_STRIDE = 136
const RATE_WINDOW_MS = 10_000

export type EthySwarmSyncOpts = {
  spine: EthySpine
  stateManager: FlatStateManager
  client: Devp2pWorkerClient
  snapStore?: SnapPivotStore
  verifyPool?: SnapVerifyPool
  seederPeerId: string
  seedBucketsBitmask: number
  chunkStateRoot: Uint8Array
  pivotBlockNumber: bigint
  balThroughBlock: bigint
  onAccountsIngested?: (entries: IngestedAccountMeta[]) => void
  onBucketDone?: (bucketIndex: number) => void
  onAccountsComplete?: () => void
  onSwarmComplete?: () => void
  economy?: ETHEconomyDataManager
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

function filterSlabToBucket(slab: Uint8Array, bucketIndex: number): Uint8Array {
  let allMatch = true
  let matchCount = 0
  for (let off = 0; off + ACCOUNT_SLAB_STRIDE <= slab.length; off += ACCOUNT_SLAB_STRIDE) {
    if (slab[off]! >> 4 === bucketIndex) {
      matchCount++
    } else {
      allMatch = false
    }
  }
  if (allMatch) return slab
  if (matchCount === 0) return new Uint8Array(0)
  const out = new Uint8Array(matchCount * ACCOUNT_SLAB_STRIDE)
  let outOff = 0
  for (let off = 0; off + ACCOUNT_SLAB_STRIDE <= slab.length; off += ACCOUNT_SLAB_STRIDE) {
    if (slab[off]! >> 4 === bucketIndex) {
      out.set(slab.subarray(off, off + ACCOUNT_SLAB_STRIDE), outOff)
      outOff += ACCOUNT_SLAB_STRIDE
    }
  }
  return out
}

export class EthySwarmSynchronizer {
  private readonly opts: EthySwarmSyncOpts
  private nextReqId = 1n
  private readonly chunkFlights = new Map<string, ChunkFlight>()
  private readonly manifestOrigins = new Map<number, Uint8Array[]>()
  private readonly nextOriginCursor = new Map<number, number>()
  private readonly retryQueue = new Map<number, Uint8Array[]>()
  private readonly chunkRetries = new Map<string, number>()
  private readonly chunksDone = new Set<string>()
  private readonly bucketDoneCount = new Map<number, number>()
  private readonly bucketsDone = new Set<number>()
  private roundRobinBucket = 0
  private expectedManifestCount = 0
  private manifestsLogged = false
  private balNext: bigint
  private balInFlight = false
  private lastBalBatchAt = 0
  private accountsPassComplete = false
  private stopped = false
  private lastRateAt = Date.now()
  private lastAccountCount = 0
  private readonly rateSamples: Array<{ at: number; count: number }> = []

  constructor(opts: EthySwarmSyncOpts) {
    this.opts = opts
    this.balNext =
      opts.spine.lastVerifiedBlockNumber !== undefined &&
      opts.spine.lastVerifiedBlockNumber > opts.pivotBlockNumber
        ? opts.spine.lastVerifiedBlockNumber + 1n
        : opts.pivotBlockNumber + 1n
    this.lastAccountCount = opts.spine.totalAccountsSynced
    for (const b of opts.spine.snapBuckets) {
      if (b.status === 'done') {
        this.bucketsDone.add(b.index)
      }
    }
  }

  start(): void {
    let seededCount = 0
    for (let b = 0; b < 16; b++) {
      if ((this.opts.seedBucketsBitmask & (1 << b)) === 0) continue
      if (this.bucketsDone.has(b)) continue
      seededCount++
    }
    this.expectedManifestCount = seededCount
    if (seededCount === 0) {
      this.maybeFinishAccountsPass()
      return
    }
    recordDiagnostic(this.opts.spine, {
      subsystem: 'ethy',
      severity: 'info',
      peerId: this.opts.seederPeerId,
      message: `ETHY swarm sync started at pivot #${this.opts.pivotBlockNumber.toString()} (${seededCount}/16 buckets remaining)`,
    })
    for (let b = 0; b < 16; b++) {
      if ((this.opts.seedBucketsBitmask & (1 << b)) === 0) continue
      if (this.bucketsDone.has(b)) continue
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
    return `${bucket}:${bytesToUnprefixedHex(origin)}`
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

  private pumpChunks(bucketIndex: number): boolean {
    if (this.stopped || this.bucketsDone.has(bucketIndex)) return false
    if (this.chunkFlights.size >= MAX_TOTAL_CHUNKS_IN_FLIGHT) return false
    const all = this.manifestOrigins.get(bucketIndex)
    if (all === undefined || all.length === 0) return false
    let inFlight = 0
    for (const flight of this.chunkFlights.values()) {
      if (flight.bucketIndex === bucketIndex) inFlight++
    }
    if (inFlight >= MAX_CHUNK_PIPELINE) return false

    let sentAny = false
    const retries = this.retryQueue.get(bucketIndex)
    while (
      inFlight < MAX_CHUNK_PIPELINE &&
      this.chunkFlights.size < MAX_TOTAL_CHUNKS_IN_FLIGHT &&
      retries !== undefined &&
      retries.length > 0
    ) {
      const origin = retries.shift()!
      if (this.chunksDone.has(this.chunkDoneKey(bucketIndex, origin))) continue
      const alreadyQueued = [...this.chunkFlights.values()].some(
        (f) => f.bucketIndex === bucketIndex && equalsBytes(f.originHash, origin),
      )
      if (alreadyQueued) continue
      this.sendChunkRequest(bucketIndex, origin)
      inFlight++
      sentAny = true
    }

    let cursor = this.nextOriginCursor.get(bucketIndex) ?? 0
    while (
      inFlight < MAX_CHUNK_PIPELINE &&
      this.chunkFlights.size < MAX_TOTAL_CHUNKS_IN_FLIGHT &&
      cursor < all.length
    ) {
      const origin = all[cursor]!
      cursor++
      if (this.chunksDone.has(this.chunkDoneKey(bucketIndex, origin))) continue
      const alreadyQueued = [...this.chunkFlights.values()].some(
        (f) => f.bucketIndex === bucketIndex && equalsBytes(f.originHash, origin),
      )
      if (alreadyQueued) continue
      this.sendChunkRequest(bucketIndex, origin)
      inFlight++
      sentAny = true
    }
    this.nextOriginCursor.set(bucketIndex, cursor)
    return sentAny
  }

  private sendChunkRequest(bucketIndex: number, origin: Uint8Array): void {
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
  }

  private pumpAllBuckets(): void {
    if (this.stopped || this.accountsPassComplete) return
    for (let pass = 0; pass < 2; pass++) {
      for (let step = 0; step < 16; step++) {
        if (this.chunkFlights.size >= MAX_TOTAL_CHUNKS_IN_FLIGHT) return
        const b = (this.roundRobinBucket + step) & 0x0f
        if ((this.opts.seedBucketsBitmask & (1 << b)) === 0) continue
        if (this.bucketsDone.has(b)) continue
        this.pumpChunks(b)
      }
      this.roundRobinBucket = (this.roundRobinBucket + 1) & 0x0f
    }
  }

  private async onBucketManifest(payload: Uint8Array): Promise<void> {
    const parsed = parseBucketManifest(payload)
    if (parsed === undefined) return
    const origins = parsed.entries.map((e) => new Uint8Array(e.originHash))
    this.manifestOrigins.set(parsed.bucketIndex, origins)
    this.nextOriginCursor.set(parsed.bucketIndex, 0)
    this.bucketDoneCount.set(parsed.bucketIndex, 0)
    if (
      !this.manifestsLogged &&
      this.expectedManifestCount > 0 &&
      this.manifestOrigins.size >= this.expectedManifestCount
    ) {
      this.manifestsLogged = true
      let totalChunks = 0
      for (const list of this.manifestOrigins.values()) totalChunks += list.length
      recordDiagnostic(this.opts.spine, {
        subsystem: 'ethy',
        severity: 'info',
        peerId: this.opts.seederPeerId,
        message: `ETHY manifests received: ${totalChunks.toLocaleString('en-US')} chunks across ${this.manifestOrigins.size} buckets`,
      })
    }
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
    this.pumpAllBuckets()
  }

  private async onProvenChunk(payload: Uint8Array): Promise<void> {
    const parsed = parseProvenAccountChunk(payload)
    if (parsed === undefined) return
    this.chunkFlights.delete(this.flightKey(parsed.reqId))
    const doneKey = this.chunkDoneKey(parsed.bucketIndex, parsed.originHash)
    if (parsed.binaryAccountsSlab.length === 0) {
      this.noteChunkFailure(parsed.bucketIndex, parsed.originHash, doneKey, 'empty proven chunk')
      return
    }
    const proofCopy = parsed.proofNodes.map((n) => {
      const c = new Uint8Array(n.length)
      c.set(n)
      return c
    })
    const verifyArgs = {
      chunkStateRoot: parsed.chunkStateRoot,
      originHash: parsed.originHash,
      binaryAccountsSlab: parsed.binaryAccountsSlab,
      proofNodes: proofCopy,
      hasRightHint: parsed.hasRight !== 0,
    }
    const result =
      this.opts.verifyPool !== undefined
        ? await this.opts.verifyPool.verifyProvenAccountChunk(verifyArgs)
        : await verifyProvenAccountChunkJob(verifyArgs)
    if (this.stopped) return
    if (!result.ok || result.slab === undefined || result.count === 0) {
      this.noteChunkFailure(
        parsed.bucketIndex,
        parsed.originHash,
        doneKey,
        result.reason ?? 'ETHY proven chunk verify failed',
      )
      return
    }
    const bucketSlab = filterSlabToBucket(result.slab, parsed.bucketIndex)
    const bucketCount = bucketSlab.length / ACCOUNT_SLAB_STRIDE
    if (bucketSlab.length > 0) {
      if (
        this.opts.snapStore !== undefined &&
        this.opts.snapStore.enabled &&
        this.opts.stateManager.residentAccountCount() >= 450_000
      ) {
        this.opts.stateManager.setSyncedAccountCount(
          this.opts.stateManager.accountCount() + bucketCount,
        )
      } else {
        this.opts.stateManager.putSnapBinaryAccountsFromSlab(bucketSlab)
      }
      this.opts.onAccountsIngested?.(ingestedMetaFromBinarySlab(bucketSlab))
    }
    const bucket = this.opts.spine.snapBuckets[parsed.bucketIndex]
    if (bucket !== undefined) {
      bucket.accountsLoaded += bucketCount
      this.opts.spine.totalAccountsSynced += bucketCount
      const lastInBucket =
        bucketSlab.length >= ACCOUNT_SLAB_STRIDE
          ? bucketSlab.subarray(
              bucketSlab.length - ACCOUNT_SLAB_STRIDE,
              bucketSlab.length - ACCOUNT_SLAB_STRIDE + 32,
            )
          : result.lastKey
      if (lastInBucket instanceof Uint8Array) {
        bucket.currentLastHash = new Uint8Array(lastInBucket)
        if (bucket.subRanges !== undefined && bucket.subRanges.length > 0) {
          bucket.subRanges[0]!.origin = incrementKey32(lastInBucket)
        }
      }
    }
    const now = Date.now()
    const dt = (now - this.lastRateAt) / 1000
    if (dt >= 0.5) {
      this.rateSamples.push({ at: now, count: this.opts.spine.totalAccountsSynced })
      const cutoff = now - RATE_WINDOW_MS
      while (this.rateSamples.length > 2 && this.rateSamples[1]!.at <= cutoff) {
        this.rateSamples.shift()
      }
      const anchor = this.rateSamples[0]
      const windowSec = anchor !== undefined && now > anchor.at ? (now - anchor.at) / 1000 : dt
      const windowDelta =
        anchor !== undefined && now > anchor.at
          ? this.opts.spine.totalAccountsSynced - anchor.count
          : this.opts.spine.totalAccountsSynced - this.lastAccountCount
      if (windowDelta > 0 && windowSec > 0) {
        const rawRateSec = windowDelta / windowSec
        const prevSec = this.opts.spine.accountsPerSec
        const rateSec = prevSec > 0 ? 0.65 * prevSec + 0.35 * rawRateSec : rawRateSec
        this.opts.spine.accountsPerSec = rateSec
        this.opts.spine.accountsPerMin = rateSec * 60
        const frac = computeAccountRangeFraction(this.opts.spine.snapBuckets)
        if (frac >= 0.005 && frac < 1 && rateSec > 0) {
          const remaining = this.opts.spine.totalAccountsSynced * ((1 - frac) / frac)
          const rawEta = remaining / (rateSec * 60)
          const prevEta = this.opts.spine.snapEtaMinutes
          this.opts.spine.snapEtaMinutes =
            prevEta !== undefined && prevEta > 0 ? 0.75 * prevEta + 0.25 * rawEta : rawEta
        }
      }
      this.lastAccountCount = this.opts.spine.totalAccountsSynced
      this.lastRateAt = now
    }
    const proof =
      result.rangeOrigin !== undefined && result.lastKey instanceof Uint8Array
        ? {
            slabByteOffset: 0,
            slabByteLength: bucketSlab.length,
            originHash: result.rangeOrigin,
            lastHash: result.lastKey,
            hasRight: result.hasRight ? 1 : 0,
            chunkStateRoot: parsed.chunkStateRoot,
            chunkBlockNumber: parsed.chunkBlockNumber,
            proofNodes: proofCopy,
          }
        : undefined
    if (bucketSlab.length > 0) {
      void this.opts.snapStore?.appendVerifiedSlabAsync(
        parsed.bucketIndex,
        bucketSlab,
        this.opts.spine.snapBuckets,
        'prefix',
        proof,
      )
    }
    if (!this.chunksDone.has(doneKey)) {
      this.chunksDone.add(doneKey)
      this.bucketDoneCount.set(
        parsed.bucketIndex,
        (this.bucketDoneCount.get(parsed.bucketIndex) ?? 0) + 1,
      )
    }
    const pending = this.manifestOrigins.get(parsed.bucketIndex) ?? []
    const doneInBucket = this.bucketDoneCount.get(parsed.bucketIndex) ?? 0
    const allDone = pending.length > 0 && doneInBucket >= pending.length
    const bucketFinished = allDone || (result.hasRight && pending.length === 0)
    if (bucketFinished && !this.bucketsDone.has(parsed.bucketIndex)) {
      this.bucketsDone.add(parsed.bucketIndex)
      if (bucket !== undefined) {
        bucket.status = 'done'
        bucket.subRanges = []
        syncBucketCursorFields(bucket)
      }
      recordDiagnostic(this.opts.spine, {
        subsystem: 'ethy',
        severity: 'info',
        peerId: this.opts.seederPeerId,
        bucketIndex: parsed.bucketIndex,
        message: `ETHY bucket 0x${parsed.bucketIndex.toString(16)} complete (${(bucket?.accountsLoaded ?? 0).toLocaleString('en-US')} accounts, ${this.bucketsDone.size}/16 buckets)`,
      })
      this.opts.onBucketDone?.(parsed.bucketIndex)
    }
    this.pumpAllBuckets()
    this.maybeFinishAccountsPass()
  }

  private noteChunkFailure(
    bucketIndex: number,
    originHash: Uint8Array,
    doneKey: string,
    reason: string,
  ): void {
    const attempts = (this.chunkRetries.get(doneKey) ?? 0) + 1
    this.chunkRetries.set(doneKey, attempts)
    recordDiagnostic(this.opts.spine, {
      subsystem: 'ethy',
      severity: 'warn',
      message: `${reason} (origin=0x${bytesToUnprefixedHex(originHash).slice(0, 12)}… attempt=${attempts}/${MAX_CHUNK_RETRIES + 1})`,
      peerId: this.opts.seederPeerId,
      bucketIndex,
    })
    if (attempts <= MAX_CHUNK_RETRIES) {
      const q = this.retryQueue.get(bucketIndex) ?? []
      q.push(originHash)
      this.retryQueue.set(bucketIndex, q)
    } else if (!this.chunksDone.has(doneKey)) {
      this.chunksDone.add(doneKey)
      this.bucketDoneCount.set(bucketIndex, (this.bucketDoneCount.get(bucketIndex) ?? 0) + 1)
    }
    this.pumpAllBuckets()
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
    this.opts.spine.snapEtaMinutes = undefined
    recordDiagnostic(this.opts.spine, {
      subsystem: 'ethy',
      severity: 'info',
      peerId: this.opts.seederPeerId,
      message: `ETHY accounts pass complete (${this.opts.spine.totalAccountsSynced.toLocaleString('en-US')} accounts)`,
    })
    const latestPeerHead = this.opts.spine.bestPeerHead
    if (latestPeerHead !== undefined && latestPeerHead > this.opts.balThroughBlock) {
      this.opts.balThroughBlock = latestPeerHead
    }
    this.opts.onAccountsComplete?.()
    if (this.balNext > this.opts.balThroughBlock) {
      this.opts.onSwarmComplete?.()
      return
    }
    const total = Number(this.opts.balThroughBlock - this.balNext + 1n)
    setPhase(this.opts.spine, 'BAL_CATCHUP')
    this.opts.spine.balCatchUp = {
      fromBlock: this.balNext,
      applied: 0,
      total,
    }
    this.lastBalBatchAt = Date.now()
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
    const batchBalJson: import('@ethereumjs/util').BALJSONBlockAccessList[] = []
    const verifiedRows: Array<{
      block: (typeof blocks)[number]
      fields: ReturnType<typeof headFieldsFromHeaderRlp>
      balJson?: import('@ethereumjs/util').BALJSONBlockAccessList
    }> = []

    for (const block of blocks) {
      const fields =
        block.headerRlp.length > 0
          ? headFieldsFromHeaderRlp(block.headerRlp, chain, hardfork)
          : null
      if (block.balRlp.length > 0 && block.headerRlp.length > 0) {
        const expectedBalHash = extractBlockAccessListHashFromHeaderRlp(
          block.headerRlp,
          chain,
          hardfork,
        )
        const bal = createBlockLevelAccessListFromRLP(block.balRlp)
        if (expectedBalHash !== null && !equalsBytes(bal.hash(), expectedBalHash)) {
          recordDiagnostic(this.opts.spine, {
            subsystem: 'bal',
            severity: 'warn',
            message: `ETHY BAL_RANGE block #${block.blockNumber.toString()} rejected: BAL hash mismatch`,
            peerId: this.opts.seederPeerId,
          })
          return
        }
        const balJson = bal.toJSON()
        batchBalJson.push(balJson)
        verifiedRows.push({ block, fields, balJson })
      } else {
        verifiedRows.push({ block, fields })
      }
    }

    if (batchBalJson.length > 0) {
      await this.opts.stateManager.consumeBALBatch(batchBalJson)
    }

    for (let i = 0; i < verifiedRows.length; i++) {
      const { block, fields, balJson } = verifiedRows[i]!
      if (balJson !== undefined) {
        pushBalWindow(this.opts.spine, block.blockNumber, balJson)
        this.opts.spine.appliedBalCount = (this.opts.spine.appliedBalCount ?? 0) + 1
      }
      const nearHead = this.opts.balThroughBlock <= block.blockNumber + 64n
      if (block.headerRlp.length > 0 && nearHead) {
        this.opts.economy?.noteBundle({
          blockNumber: block.blockNumber,
          headerRlp: block.headerRlp,
          balJson,
          balRlp: block.balRlp,
        })
      }
      const pivot = this.opts.spine.pivotBlockNumber
      if (
        fields !== null &&
        pivot !== undefined &&
        block.blockNumber > pivot &&
        block.balRlp.length > 0
      ) {
        this.opts.snapStore?.appendHealBundle({
          blockNumber: block.blockNumber,
          blockHash: fields.blockHash,
          stateRoot: fields.stateRoot,
          headerRlp: block.headerRlp,
          balRlp: block.balRlp,
        })
      } else if (block.balRlp.length > 0) {
        this.opts.snapStore?.appendHealBal(block.blockNumber, block.balRlp)
      }
      this.opts.spine.lastVerifiedBlockNumber = block.blockNumber
      this.opts.spine.headBlockNumber = block.blockNumber
      if (fields !== null) {
        this.opts.spine.headStateRoot = fields.stateRoot
      }
      this.balNext = block.blockNumber + 1n
    }

    const now = Date.now()
    const dt = (now - this.lastBalBatchAt) / 1000
    this.lastBalBatchAt = now
    const latestPeerHead = this.opts.spine.bestPeerHead
    if (latestPeerHead !== undefined && latestPeerHead > this.opts.balThroughBlock) {
      this.opts.balThroughBlock = latestPeerHead
    }
    if (this.opts.spine.balCatchUp !== undefined) {
      const from = this.opts.spine.balCatchUp.fromBlock
      this.opts.spine.balCatchUp.total = Math.max(1, Number(this.opts.balThroughBlock - from + 1n))
      this.opts.spine.balCatchUp.applied = Math.min(
        this.opts.spine.balCatchUp.total,
        Number(this.balNext - from),
      )
      if (dt > 0 && blocks.length > 0) {
        this.opts.spine.balCatchUp.blocksPerSec = blocks.length / dt
      }
    }
    if (this.balNext <= this.opts.balThroughBlock) {
      this.requestBalRange()
    } else {
      this.opts.onSwarmComplete?.()
    }
  }
}
