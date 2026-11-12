import type { BALJSONBlockAccessList } from '@ethereumjs/util'

export type DomainPermission = 'read' | 'write'

export type BaseFeeTrend = 'up' | 'down' | 'flat'

export type TxTypeSplit = {
  legacy: number
  accessList: number
  feeMarket: number
  blob: number
  setCode: number
  other: number
}

export type ContractBlockContribution = {
  address: string
  writes: number
  reads: number
  codeChanged: boolean
  postBalance?: bigint
}

export type BlockMomentKind =
  | 'birth'
  | 'choreography'
  | 'whale'
  | 'first_step'
  | 'veteran'
  | 'eip7702'
  | 'graffiti_note'
  | 'blob_anchor'
  | 'revert'
  | 'heartbeat'

export type BlockMoment = {
  id: string
  blockNumber: string
  timestampSec: number
  kind: BlockMomentKind
  /** Fixed 6-char ASCII badge (color applied in TUI). */
  badge: string
  headline: string
  address?: string
}

export type EconomySkylinePoint = {
  gasFullPct: number
  mutation: number
}

export type BlockEconomyRecord = {
  blockNumber: bigint
  /** When false, block had header (+ optional BAL) only (no body txs). */
  hasTxBody: boolean
  timestamp?: number
  extraDataAscii?: string
  extraDataHex?: string
  /** Per-bucket account touches in this block (`keccak(address)[0] >> 4`). */
  nibbleTouches?: number[]
  /** Decoded BAL JSON when resolved from `balJson` or `balRlp` (WP-07h). */
  resolvedBalJson?: BALJSONBlockAccessList
  baseFeeWei?: bigint
  gasFullPct: number
  blobGasUsed?: bigint
  txCount: number
  ethTransferredWei: bigint
  txTypeSplit: TxTypeSplit
  largestTransferWei: bigint
  largestTransferTo?: string
  receiptSuccess?: number
  receiptReverts?: number
  /** First reverted tx `to` from receipt walk (when available). */
  firstRevertTo?: string
  contractCreationCount?: number
  activeAccounts?: number
  storageWrites?: number
  storageReads?: number
  newDeployments?: number
  contractContributions: ContractBlockContribution[]
  observations?: BlockContractObservations
  balSnapshots?: Array<{ address: string; code?: Uint8Array; implSlot?: string }>
}

export type ContractConfidence = 'high' | 'medium' | 'low'

export type TopContractRow = {
  address: string
  blocksActive: number
  storageWrites: number
  storageReads: number
  netEthDeltaWei: bigint
  archetype?: string
  confidence?: ContractConfidence
  knownName?: string
  topSelectors?: string[]
  proxyKind?: string
  proxyTarget?: string
}

export type TxCallObservation = {
  to: string
  selector: string
  data: Uint8Array
}

export type LogObservation = {
  emitter: string
  topic0: string
  topics: string[]
  data: Uint8Array
  transferDestinations: string[]
}

export type TxObservationSlice = {
  to?: string
  selector?: string
  data?: Uint8Array
  logs: LogObservation[]
}

export type BlockContractObservations = {
  calls: TxCallObservation[]
  logs: LogObservation[]
  blockAddresses: string[]
  txSlices: TxObservationSlice[]
}

export type EconomyRecentBlockRow = {
  blockNumber: string
  baseFeeGwei: string
  gasFullPct: number
  txCount: number
  ethTransferredEth: string
}

export type EconomySnapshot = {
  hasBlocks: boolean
  hasTxBody?: boolean
  latestBlockNumber?: string
  baseFeeGwei?: string
  trend?: BaseFeeTrend
  trendPercent?: number
  gasFullPct?: number
  blobGasUsed?: string
  txCount?: number
  tps?: number
  ethTransferredBlockEth?: string
  ethTransferredWindowEth?: string
  txTypeSplit?: TxTypeSplit
  activeAccounts?: number
  storageWrites?: number
  storageReads?: number
  newDeployments?: number
  topContracts: TopContractRow[]
  recentBlocks: EconomyRecentBlockRow[]
  largestTransferEth?: string
  largestTransferTo?: string
  receiptSuccess?: number
  receiptReverts?: number
  moments?: BlockMoment[]
  nibbleHeat?: number[]
  skyline?: EconomySkylinePoint[]
  latestProposerGraffiti?: string
  latestBlockTimestamp?: number
  latestExtraDataHex?: string
  windowBlockCount?: number
  avgGasFullPct?: number
  windowTxCount?: number
  windowRevertPct?: number
  windowPeakTransferEth?: string
  archetypeMix?: Array<{ archetype: string; count: number; sharePct: number }>
}

export const ECONOMY_MOMENTS_RING = 24
export const ECONOMY_SKYLINE_BLOCKS = 36

export const ECONOMY_WINDOW_BLOCKS = 64
export const ECONOMY_FEE_AVG_BLOCKS = 15
export const ECONOMY_TPS_BLOCKS = 10
export const ECONOMY_LEADERBOARD_SIZE = 10
export const ECONOMY_CLASSIFY_POOL = 24
export const ECONOMY_ADDRESS_MAP_CAP = 4096
export const SLOT_SECONDS = 12
