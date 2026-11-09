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

export type BlockEconomyRecord = {
  blockNumber: bigint
  /** When false, block had header (+ optional BAL) only (no body txs). */
  hasTxBody: boolean
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
  activeAccounts?: number
  storageWrites?: number
  storageReads?: number
  newDeployments?: number
  contractContributions: ContractBlockContribution[]
}

export type TopContractRow = {
  address: string
  blocksActive: number
  storageWrites: number
  storageReads: number
  netEthDeltaWei: bigint
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
}

export const ECONOMY_WINDOW_BLOCKS = 64
export const ECONOMY_FEE_AVG_BLOCKS = 15
export const ECONOMY_TPS_BLOCKS = 10
export const ECONOMY_LEADERBOARD_SIZE = 10
export const ECONOMY_ADDRESS_MAP_CAP = 4096
export const SLOT_SECONDS = 12
