import type { ChainConfig } from '@ethereumjs/common'
import type { BALJSONBlockAccessList } from '@ethereumjs/util'

import type { EthySpine } from '../spine/types.ts'
import type { TwoColumnPair } from '../tui/layout.ts'
import { decodeBundle } from './decodeBundle.ts'
import { formatEthFromWei, formatGwei, shortAddress, trendArrow } from './format.ts'
import type { BlockEconomyRecord, EconomySnapshot, TopContractRow } from './types.ts'
import {
  ECONOMY_ADDRESS_MAP_CAP,
  ECONOMY_FEE_AVG_BLOCKS,
  ECONOMY_LEADERBOARD_SIZE,
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
}

export class ETHEconomyDataManager {
  private readonly spine: EthySpine
  private readonly chain: ChainConfig
  private readonly hardfork: string
  private readonly ring: BlockEconomyRecord[] = []
  private readonly addressAgg = new Map<string, AddressAgg>()
  private newestIngested: bigint | undefined

  constructor(opts: ETHEconomyDataManagerOpts) {
    this.spine = opts.spine
    this.chain = opts.chain
    this.hardfork = opts.hardfork
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
      }
      this.ring.unshift(record)
      while (this.ring.length > ECONOMY_WINDOW_BLOCKS) {
        const dropped = this.ring.pop()
        if (dropped !== undefined) this.revertBlock(dropped)
      }
      this.applyBlock(record)
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
    const snap = this.spine.economy
    if (snap === undefined || !snap.hasBlocks) {
      return [
        { label: 'Status', value: 'Awaiting first block…' },
        { label: 'Gas / Base', value: '—' },
        { label: 'Activity', value: '—' },
        { label: 'Contracts', value: '—' },
      ]
    }
    const gas =
      snap.baseFeeGwei !== undefined
        ? `${snap.baseFeeGwei}${trendArrow(snap.trend)} · ${snap.gasFullPct ?? 0}% full`
        : `${snap.gasFullPct ?? 0}% full`
    const activity =
      snap.hasTxBody === true && snap.txCount !== undefined && snap.tps !== undefined
        ? `${snap.txCount} txs (${snap.tps.toFixed(1)}/s) · ${snap.ethTransferredBlockEth ?? '0 ETH'}`
        : '—'
    const state =
      snap.activeAccounts !== undefined
        ? `${snap.activeAccounts} acc · ${snap.storageWrites ?? 0} writes · ${snap.newDeployments ?? 0} new`
        : '—'
    const hot = snap.topContracts[0]
    const hotValue =
      hot !== undefined
        ? `${shortAddress(hot.address)} (${Math.round(
            (hot.storageWrites + hot.storageReads) / Math.max(1, hot.blocksActive),
          )} slots/blk)`
        : '—'
    return [
      { label: 'Gas / Base', value: gas },
      { label: 'Activity', value: activity },
      { label: 'State / BAL', value: state },
      { label: 'Hot Contract', value: hotValue },
    ]
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
      } else {
        this.refreshBalanceBounds(c.address)
      }
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

  private buildTopContracts(): TopContractRow[] {
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
    return rows.slice(0, ECONOMY_LEADERBOARD_SIZE)
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
    const snap: EconomySnapshot = {
      hasBlocks: true,
      hasTxBody: latest.hasTxBody,
      latestBlockNumber: latest.blockNumber.toString(),
      baseFeeGwei:
        latest.baseFeeWei !== undefined
          ? formatGwei(latest.baseFeeWei).replace(' Gwei', '')
          : undefined,
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
      topContracts: this.buildTopContracts(),
      recentBlocks: this.ring.slice(0, 10).map((b) => ({
        blockNumber: b.blockNumber.toString(),
        baseFeeGwei:
          b.baseFeeWei !== undefined ? formatGwei(b.baseFeeWei).replace(' Gwei', '') : '—',
        gasFullPct: b.gasFullPct,
        txCount: b.txCount,
        ethTransferredEth: formatEthFromWei(b.ethTransferredWei),
      })),
      largestTransferEth:
        latest.largestTransferWei > 0n ? formatEthFromWei(latest.largestTransferWei) : undefined,
      largestTransferTo: latest.largestTransferTo,
      receiptSuccess: latest.receiptSuccess,
      receiptReverts: latest.receiptReverts,
    }
    this.spine.economy = snap
  }
}
