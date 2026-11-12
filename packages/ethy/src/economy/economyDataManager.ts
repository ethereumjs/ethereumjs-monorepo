import type { ChainConfig } from '@ethereumjs/common'
import type { FlatStateManager } from '@ethereumjs/statemanager'
import type { BALJSONBlockAccessList } from '@ethereumjs/util'

import {
  type ContractAddressAgg,
  archetypeLabelFromCode,
  buildCodeLookup,
  createFingerprintCache,
  enrichTopContracts,
  macroArchetypeBucket,
} from '../contracts/contractIntelligence.ts'
import { formatCalldataPreview, formatLogPreview } from '../contracts/localAbi.ts'
import { TOPIC } from '../contracts/signatureCatalog.ts'
import type { EthySpine } from '../spine/types.ts'
import type { TwoColumnPair } from '../tui/layout.ts'
import { economyCockpitPairs } from './cockpitPairs.ts'
import { decodeBundle } from './decodeBundle.ts'
import { formatBaseFeeNumber, formatEthFromWei } from './format.ts'
import { detectBlockMoments } from './momentDetector.ts'
import type { BlockEconomyRecord, BlockMoment, EconomySnapshot, TopContractRow } from './types.ts'
import {
  ECONOMY_ADDRESS_MAP_CAP,
  ECONOMY_CLASSIFY_POOL,
  ECONOMY_FEE_AVG_BLOCKS,
  ECONOMY_LEADERBOARD_SIZE,
  ECONOMY_MOMENTS_RING,
  ECONOMY_SKYLINE_BLOCKS,
  ECONOMY_TPS_BLOCKS,
  ECONOMY_WINDOW_BLOCKS,
  SLOT_SECONDS,
} from './types.ts'

type AddressAgg = {
  blocksActive: number
  slotWrites: number
  slotReads: number
  firstPost?: bigint
  lastPost?: bigint
  /** Block numbers where address had contract activity (for blocksActive). */
  blockNumbers: Set<string>
}

export type EconomyNoteInput = {
  blockNumber: bigint
  headerRlp: Uint8Array
  bodyRlp?: Uint8Array
  receiptsEth69Rlp?: Uint8Array
  balJson?: BALJSONBlockAccessList
  balRlp?: Uint8Array
}

export type ETHEconomyDataManagerOpts = {
  spine: EthySpine
  chain: ChainConfig
  hardfork: string
  stateManager?: FlatStateManager
}

function emptyContractAgg(): ContractAddressAgg {
  return {
    selectorCounts: new Map(),
    topicCounts: new Map(),
    coTouched: new Set(),
    maxTransferLogsInTx: 0,
    soleCalleeBlocks: 0,
    inboundCalls: 0,
    swapEmittersInTx: new Set(),
    callPreviews: [],
    eventPreviews: [],
  }
}

export class ETHEconomyDataManager {
  private readonly spine: EthySpine
  private readonly chain: ChainConfig
  private readonly hardfork: string
  private readonly stateManager?: FlatStateManager
  private readonly ring: BlockEconomyRecord[] = []
  private readonly addressAgg = new Map<string, AddressAgg>()
  private readonly contractAgg = new Map<string, ContractAddressAgg>()
  private readonly fingerprintCache = createFingerprintCache()
  private newestIngested: bigint | undefined
  private readonly momentFeed: BlockMoment[] = []

  constructor(opts: ETHEconomyDataManagerOpts) {
    this.spine = opts.spine
    this.chain = opts.chain
    this.hardfork = opts.hardfork
    this.stateManager = opts.stateManager
  }

  /** Exposed for `/contract` microscope (read-only). */
  getContractAgg(address: string): ContractAddressAgg | undefined {
    return this.contractAgg.get(address.toLowerCase())
  }

  /** Ingest one verified block; never throws. */
  noteBundle(input: EconomyNoteInput): void {
    try {
      if (this.newestIngested !== undefined && input.blockNumber < this.newestIngested) {
        return
      }
      const record = decodeBundle({
        ...input,
        chain: this.chain,
        hardfork: this.hardfork,
      })
      const existingIdx = this.ring.findIndex((r) => r.blockNumber === input.blockNumber)
      if (existingIdx >= 0) {
        this.revertBlock(this.ring[existingIdx]!)
        this.ring.splice(existingIdx, 1)
        const blockKey = input.blockNumber.toString()
        for (let i = this.momentFeed.length - 1; i >= 0; i--) {
          if (this.momentFeed[i]!.blockNumber === blockKey) this.momentFeed.splice(i, 1)
        }
      }
      this.ring.unshift(record)
      while (this.ring.length > ECONOMY_WINDOW_BLOCKS) {
        const dropped = this.ring.pop()
        if (dropped !== undefined) this.revertBlock(dropped)
      }
      this.applyBlock(record)
      this.applyContractSignals(record)
      this.ingestMoments(record, input.balJson ?? record.resolvedBalJson)
      this.enforceAddressCap()
      if (this.newestIngested === undefined || input.blockNumber >= this.newestIngested) {
        this.newestIngested = input.blockNumber
      }
      this.publish()
    } catch {
      // economy ingest must not break sync
    }
  }

  cockpitPairs(): TwoColumnPair[] {
    return economyCockpitPairs(this.spine.economy)
  }

  private applyBlock(record: BlockEconomyRecord): void {
    const blockKey = record.blockNumber.toString()
    for (const c of record.contractContributions) {
      let row = this.addressAgg.get(c.address)
      if (row === undefined) {
        row = {
          blocksActive: 0,
          slotWrites: 0,
          slotReads: 0,
          blockNumbers: new Set(),
        }
        this.addressAgg.set(c.address, row)
      }
      if (!row.blockNumbers.has(blockKey)) {
        row.blockNumbers.add(blockKey)
        row.blocksActive += 1
      }
      row.slotWrites += c.writes
      row.slotReads += c.reads
      if (c.postBalance !== undefined) {
        if (row.firstPost === undefined) row.firstPost = c.postBalance
        row.lastPost = c.postBalance
      }
    }
  }

  private revertBlock(record: BlockEconomyRecord): void {
    const blockKey = record.blockNumber.toString()
    for (const c of record.contractContributions) {
      const row = this.addressAgg.get(c.address)
      if (row === undefined) continue
      if (row.blockNumbers.has(blockKey)) {
        row.blockNumbers.delete(blockKey)
        row.blocksActive -= 1
      }
      row.slotWrites -= c.writes
      row.slotReads -= c.reads
      if (row.slotWrites < 0) row.slotWrites = 0
      if (row.slotReads < 0) row.slotReads = 0
      if (row.blocksActive <= 0) {
        this.addressAgg.delete(c.address)
        this.contractAgg.delete(c.address)
      } else {
        this.refreshBalanceBounds(c.address)
      }
    }
    this.rebuildContractAgg()
  }

  private bumpMap(map: Map<string, number>, key: string, delta = 1): void {
    const k = key.toLowerCase()
    map.set(k, (map.get(k) ?? 0) + delta)
  }

  private ensureContractAgg(address: string): ContractAddressAgg {
    const key = address.toLowerCase()
    let row = this.contractAgg.get(key)
    if (row === undefined) {
      row = emptyContractAgg()
      this.contractAgg.set(key, row)
    }
    return row
  }

  private applyContractSignals(record: BlockEconomyRecord): void {
    const obs = record.observations
    if (obs !== undefined) {
      const touchAddresses = obs.blockAddresses
      const coTouchCap = Math.min(touchAddresses.length, 48)
      for (let i = 0; i < coTouchCap; i++) {
        const a = touchAddresses[i]!
        const agg = this.ensureContractAgg(a)
        for (let j = 0; j < coTouchCap; j++) {
          if (i === j) continue
          agg.coTouched.add(touchAddresses[j]!)
        }
      }
      for (const call of obs.calls) {
        const agg = this.ensureContractAgg(call.to)
        this.bumpMap(agg.selectorCounts, call.selector)
        agg.inboundCalls += 1
        if (call.data.length >= 4) {
          const preview = formatCalldataPreview(call.data, 64)
          if (!agg.callPreviews.includes(preview)) {
            agg.callPreviews.unshift(preview)
            if (agg.callPreviews.length > 5) agg.callPreviews.pop()
          }
        }
      }
      for (const log of obs.logs) {
        const agg = this.ensureContractAgg(log.emitter)
        this.bumpMap(agg.topicCounts, log.topic0)
        const preview = formatLogPreview(log.topics, log.data, 64)
        if (!agg.eventPreviews.includes(preview)) {
          agg.eventPreviews.unshift(preview)
          if (agg.eventPreviews.length > 5) agg.eventPreviews.pop()
        }
      }
      for (const slice of obs.txSlices) {
        if (slice.to === undefined) continue
        const agg = this.ensureContractAgg(slice.to)
        let transfers = 0
        const swapEmitters = new Set<string>()
        for (const log of slice.logs) {
          if (log.topic0.toLowerCase() === TOPIC.transferErc20.toLowerCase()) transfers += 1
          if (
            log.topic0.toLowerCase() === TOPIC.swapV2.toLowerCase() ||
            log.topic0.toLowerCase() === TOPIC.swapV3.toLowerCase()
          ) {
            swapEmitters.add(log.emitter)
          }
        }
        if (transfers > agg.maxTransferLogsInTx) agg.maxTransferLogsInTx = transfers
        if (swapEmitters.size >= 2) {
          for (const e of swapEmitters) agg.swapEmittersInTx.add(e)
        }
        const txsTo = obs.txSlices.filter((s) => s.to === slice.to).length
        if (txsTo === 1) {
          const contrib = record.contractContributions.find((c) => c.address === slice.to)
          if (contrib !== undefined && contrib.writes >= 15) agg.soleCalleeBlocks += 1
        }
      }
    }
    if (record.balSnapshots !== undefined) {
      for (const snap of record.balSnapshots) {
        const agg = this.ensureContractAgg(snap.address)
        if (snap.code !== undefined) agg.latestBalCode = snap.code
        if (snap.implSlot !== undefined) agg.implSlotValue = snap.implSlot
      }
    }
    if (record.observations !== undefined) {
      for (const log of record.observations.logs) {
        if (log.topic0.toLowerCase() === TOPIC.upgradedEip1967.toLowerCase()) {
          const rawImpl = log.topics[1]
          if (rawImpl !== undefined && rawImpl.length >= 42) {
            const agg = this.ensureContractAgg(log.emitter)
            agg.implSlotValue = `0x${rawImpl.slice(-40).toLowerCase()}`
          }
        }
      }
    }
  }

  private rebuildContractAgg(): void {
    this.contractAgg.clear()
    for (const block of this.ring) {
      this.applyContractSignals(block)
    }
  }

  private refreshBalanceBounds(address: string): void {
    const row = this.addressAgg.get(address)
    if (row === undefined) return
    row.firstPost = undefined
    row.lastPost = undefined
    for (let i = this.ring.length - 1; i >= 0; i--) {
      const block = this.ring[i]!
      for (const c of block.contractContributions) {
        if (c.address !== address || c.postBalance === undefined) continue
        row.lastPost = c.postBalance
        break
      }
    }
    for (let i = 0; i < this.ring.length; i++) {
      const block = this.ring[i]!
      for (const c of block.contractContributions) {
        if (c.address !== address || c.postBalance === undefined) continue
        row.firstPost = c.postBalance
        break
      }
    }
  }

  private enforceAddressCap(): void {
    while (this.addressAgg.size > ECONOMY_ADDRESS_MAP_CAP) {
      let drop: string | undefined
      let dropScore: [number, number] | undefined
      for (const [addr, agg] of this.addressAgg) {
        const score: [number, number] = [agg.blocksActive, agg.slotWrites + agg.slotReads]
        if (
          dropScore === undefined ||
          score[0] < dropScore[0] ||
          (score[0] === dropScore[0] && score[1] < dropScore[1]!)
        ) {
          drop = addr
          dropScore = score
        }
      }
      if (drop === undefined) break
      this.addressAgg.delete(drop)
    }
  }

  private computeTrend(currentBase?: bigint): {
    trend: 'up' | 'down' | 'flat'
    percent?: number
  } {
    const fees: bigint[] = []
    for (const block of this.ring) {
      if (block.baseFeeWei === undefined) continue
      fees.push(block.baseFeeWei)
    }
    if (currentBase === undefined || fees.length < 2) {
      return { trend: 'flat' }
    }
    const prior = fees.slice(1, 1 + ECONOMY_FEE_AVG_BLOCKS)
    if (prior.length === 0) return { trend: 'flat' }
    let sum = 0n
    for (const f of prior) sum += f
    const mean = sum / BigInt(prior.length)
    if (mean === 0n) return { trend: 'flat' }
    if (currentBase < 100_000n && mean < 100_000n) return { trend: 'flat' }
    const absDiff = currentBase >= mean ? currentBase - mean : mean - currentBase
    if (absDiff < 10_000n) return { trend: 'flat' }
    const diff = currentBase - mean
    const pct = Number((diff * 10000n) / mean) / 100
    if (Math.abs(pct) < 0.5) return { trend: 'flat' }
    return {
      trend: pct > 0 ? 'up' : 'down',
      percent: Math.round(Math.abs(pct)),
    }
  }

  private computeTps(): number {
    let n = 0
    let txs = 0
    for (const block of this.ring) {
      if (!block.hasTxBody) continue
      txs += block.txCount
      n += 1
      if (n >= ECONOMY_TPS_BLOCKS) break
    }
    if (n === 0) return 0
    return txs / (n * SLOT_SECONDS)
  }

  private buildTopContracts(limit: number): TopContractRow[] {
    const rows: TopContractRow[] = []
    for (const [address, agg] of this.addressAgg) {
      let net = 0n
      if (agg.firstPost !== undefined && agg.lastPost !== undefined) {
        net = agg.lastPost - agg.firstPost
      }
      rows.push({
        address,
        blocksActive: agg.blocksActive,
        storageWrites: agg.slotWrites,
        storageReads: agg.slotReads,
        netEthDeltaWei: net,
      })
    }
    rows.sort((a, b) => {
      if (b.blocksActive !== a.blocksActive) return b.blocksActive - a.blocksActive
      const bSlots = b.storageWrites + b.storageReads
      const aSlots = a.storageWrites + a.storageReads
      if (bSlots !== aSlots) return bSlots - aSlots
      const absA = a.netEthDeltaWei < 0n ? -a.netEthDeltaWei : a.netEthDeltaWei
      const absB = b.netEthDeltaWei < 0n ? -b.netEthDeltaWei : b.netEthDeltaWei
      if (absB !== absA) return absB > absA ? 1 : -1
      return a.address.localeCompare(b.address)
    })
    return rows.slice(0, limit)
  }

  private buildArchetypeMix(classified: TopContractRow[]): EconomySnapshot['archetypeMix'] {
    if (classified.length === 0) return undefined
    const counts = new Map<string, number>()
    for (const row of classified) {
      const bucket = macroArchetypeBucket(row.archetype, row.proxyKind)
      counts.set(bucket, (counts.get(bucket) ?? 0) + 1)
    }
    const total = classified.length
    const mix = [...counts.entries()]
      .map(([archetype, count]) => ({
        archetype,
        count,
        sharePct: Math.round((count * 1000) / total) / 10,
      }))
      .filter((e) => e.sharePct > 0)
      .sort((a, b) => b.count - a.count)
    return mix.length > 0 ? mix : undefined
  }

  private buildMomentContext(): {
    classifyCode: (code: Uint8Array) => string | undefined
    addressArchetypes: ReadonlyMap<string, string>
  } {
    const addressArchetypes = new Map<string, string>()
    const pool = this.buildTopContracts(ECONOMY_CLASSIFY_POOL)
    if (this.stateManager !== undefined) {
      const lookup = buildCodeLookup(this.stateManager, this.chain)
      const enriched = enrichTopContracts(pool, this.contractAgg, lookup, this.fingerprintCache)
      for (const row of enriched) {
        if (row.archetype !== undefined) {
          addressArchetypes.set(row.address.toLowerCase(), row.archetype)
        }
      }
    } else {
      const fallbackLookup = {
        chainId: BigInt(this.chain.chainId),
        getCodeForAddress: () => undefined,
      }
      const enriched = enrichTopContracts(
        pool,
        this.contractAgg,
        fallbackLookup,
        this.fingerprintCache,
      )
      for (const row of enriched) {
        if (row.archetype !== undefined) {
          addressArchetypes.set(row.address.toLowerCase(), row.archetype)
        }
      }
    }
    const classifyCode = (code: Uint8Array) => archetypeLabelFromCode(code, this.fingerprintCache)
    return { classifyCode, addressArchetypes }
  }

  private computeWindowStats(): Pick<
    EconomySnapshot,
    | 'windowBlockCount'
    | 'avgGasFullPct'
    | 'windowTxCount'
    | 'windowRevertPct'
    | 'windowPeakTransferEth'
  > {
    const n = this.ring.length
    if (n === 0) {
      return {}
    }
    let gasSum = 0
    let windowTxCount = 0
    let reverts = 0
    let successes = 0
    let peakWei = 0n
    for (const block of this.ring) {
      gasSum += block.gasFullPct
      if (block.hasTxBody) windowTxCount += block.txCount
      if (block.receiptReverts !== undefined) reverts += block.receiptReverts
      if (block.receiptSuccess !== undefined) successes += block.receiptSuccess
      if (block.largestTransferWei > peakWei) peakWei = block.largestTransferWei
    }
    const revertDenom = reverts + successes
    return {
      windowBlockCount: n,
      avgGasFullPct: Math.round(gasSum / n),
      windowTxCount,
      windowRevertPct:
        revertDenom > 0 ? Math.round((reverts * 1000) / revertDenom) / 10 : undefined,
      windowPeakTransferEth: formatEthFromWei(peakWei),
    }
  }

  private ingestMoments(record: BlockEconomyRecord, balJson?: BALJSONBlockAccessList): void {
    const ctx = this.buildMomentContext()
    const fresh = detectBlockMoments({ record, balJson, ...ctx })
    for (let i = fresh.length - 1; i >= 0; i--) {
      const m = fresh[i]!
      const dup = this.momentFeed.findIndex((x) => x.id === m.id)
      if (dup >= 0) this.momentFeed.splice(dup, 1)
      this.momentFeed.unshift(m)
    }
    while (this.momentFeed.length > ECONOMY_MOMENTS_RING) {
      this.momentFeed.pop()
    }
  }

  private buildSkyline(): EconomySnapshot['skyline'] {
    const slice = this.ring.slice(0, ECONOMY_SKYLINE_BLOCKS).reverse()
    return slice.map((b) => ({
      gasFullPct: b.gasFullPct,
      mutation: (b.storageWrites ?? 0) + (b.activeAccounts ?? 0),
    }))
  }

  private buildNibbleHeat(): number[] {
    const heat = new Array<number>(16).fill(0)
    for (const block of this.ring) {
      const touches = block.nibbleTouches
      if (touches === undefined) continue
      for (let i = 0; i < 16; i++) {
        heat[i]! += touches[i] ?? 0
      }
    }
    return heat
  }

  private enrichedTopContracts(): {
    top: TopContractRow[]
    archetypeMix?: EconomySnapshot['archetypeMix']
  } {
    const pool = this.buildTopContracts(ECONOMY_CLASSIFY_POOL)
    const lookup =
      this.stateManager !== undefined
        ? buildCodeLookup(this.stateManager, this.chain)
        : { chainId: BigInt(this.chain.chainId), getCodeForAddress: () => undefined }
    const classified = enrichTopContracts(pool, this.contractAgg, lookup, this.fingerprintCache)
    return {
      top: classified.slice(0, ECONOMY_LEADERBOARD_SIZE),
      archetypeMix: this.buildArchetypeMix(classified),
    }
  }

  private publish(): void {
    const latest = this.ring[0]
    if (latest === undefined) {
      this.spine.economy = { hasBlocks: false, topContracts: [], recentBlocks: [] }
      return
    }
    let windowWei = 0n
    for (const b of this.ring) windowWei += b.ethTransferredWei
    const trend = this.computeTrend(latest.baseFeeWei)
    const windowStats = this.computeWindowStats()
    const { top: topContracts, archetypeMix } = this.enrichedTopContracts()
    const snap: EconomySnapshot = {
      hasBlocks: true,
      hasTxBody: latest.hasTxBody,
      latestBlockNumber: latest.blockNumber.toString(),
      baseFeeGwei:
        latest.baseFeeWei !== undefined ? formatBaseFeeNumber(latest.baseFeeWei) : undefined,
      trend: trend.trend,
      trendPercent: trend.percent,
      gasFullPct: latest.gasFullPct,
      blobGasUsed: latest.blobGasUsed?.toString(),
      txCount: latest.hasTxBody ? latest.txCount : undefined,
      tps: latest.hasTxBody && this.ring.some((b) => b.hasTxBody) ? this.computeTps() : undefined,
      ethTransferredBlockEth:
        latest.ethTransferredWei > 0n || latest.txCount > 0
          ? formatEthFromWei(latest.ethTransferredWei)
          : formatEthFromWei(0n),
      ethTransferredWindowEth: formatEthFromWei(windowWei),
      txTypeSplit: latest.txTypeSplit,
      activeAccounts: latest.activeAccounts,
      storageWrites: latest.storageWrites,
      storageReads: latest.storageReads,
      newDeployments: latest.newDeployments,
      topContracts,
      ...windowStats,
      archetypeMix,
      recentBlocks: this.ring.slice(0, 10).map((b) => ({
        blockNumber: b.blockNumber.toString(),
        baseFeeGwei: b.baseFeeWei !== undefined ? formatBaseFeeNumber(b.baseFeeWei) : '—',
        gasFullPct: b.gasFullPct,
        txCount: b.txCount,
        ethTransferredEth: formatEthFromWei(b.ethTransferredWei),
      })),
      largestTransferEth:
        latest.largestTransferWei > 0n ? formatEthFromWei(latest.largestTransferWei) : undefined,
      largestTransferTo: latest.largestTransferTo,
      receiptSuccess: latest.receiptSuccess,
      receiptReverts: latest.receiptReverts,
      moments: [...this.momentFeed],
      nibbleHeat: this.buildNibbleHeat(),
      skyline: this.buildSkyline(),
      latestProposerGraffiti: latest.extraDataAscii,
      latestBlockTimestamp: latest.timestamp,
      latestExtraDataHex: latest.extraDataHex,
    }
    this.spine.economy = snap
  }
}
