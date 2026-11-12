import type { WorkerDiscoverySnapshot, WorkerServingSnapshot } from '@ethereumjs/devp2p'
import type { BALJSONBlockAccessList } from '@ethereumjs/util'

import type { EconomySnapshot } from '../economy/types.ts'

export type CapabilityId = 'state' | 'economy' | 'p2p'

export type CapabilityMarkId = CapabilityId | 'ai'

export const DOMAIN_ORDER: readonly CapabilityId[] = ['economy', 'state', 'p2p']

export const CAPABILITY_PILL_ORDER: readonly CapabilityMarkId[] = ['economy', 'state', 'p2p', 'ai']

export const MAX_VIEW_HISTORY = 12

export type EthyPhase = 'BOOTING' | 'P2P_WARMUP' | 'SNAP_SYNCING' | 'BAL_CATCHUP' | 'HEAD_FOLLOWING'

export type SyncTransport = 'unset' | 'ethy' | 'snap'

export type CapabilityReadiness = 'locked' | 'partial' | 'ready'

export type SnapBucketStatus = 'pending' | 'syncing' | 'verifying_proof' | 'done' | 'stalled'

export interface PeerTelemetry {
  id: string
  clientName: string
  caps: string[]
  /** Snap subprotocol is on the live session, not only in the HELLO cap list. */
  snapSession?: boolean
  /** ETHY/0 subprotocol is on the live session. */
  ethySession?: boolean
  /** Remote ETHY/0 STATUS snapshot when negotiated. */
  ethyStatus?: {
    basePivotBlock: string
    basePivotStateRoot: string
    bucketsBitmask: string
    balEarliestBlock: string
    balLatestBlock: string
    latestBlockHash: string
  }
  /** ETH STATUS completed with a usable head hash. */
  hasHead?: boolean
  /** Latest block number reported by the peer's ETH STATUS / BLOCK_RANGE_UPDATE. */
  latestBlock?: bigint
  snapRequestsSent: number
  snapResponsesOk: number
  snapTimeouts: number
  avgLatencyMs: number
  lastError?: string
}

/** Non-overlapping snap/1 sub-range within one nibble bucket (WP-04h). */
export type SnapRangeCursor = {
  id: number
  bucketIndex: number
  origin: Uint8Array
  limit: Uint8Array
  /** `prefix` → `accounts/<nibble>.bin`; else segment file key under that nibble. */
  journal: 'prefix' | string
  inFlightReqKey?: string
  /** In-flight Merkle verifies not yet committed (WP-06e). */
  verifyingCount?: number
  /** Origin advanced on wire peek while verify runs (WP-06e). */
  pipelinedVerify?: boolean
  /** One-account storage/code refresh after BAL during snap (WP-04k). */
  refresh?: boolean
}

export interface SnapBucket {
  index: number
  prefix: string
  status: SnapBucketStatus
  accountsLoaded: number
  startHash: Uint8Array
  currentLastHash: Uint8Array
  limitHash: Uint8Array
  assignedPeerId?: string
  lastStallReason?: string
  /** When set, network concurrency is tracked per cursor (WP-04h). */
  subRanges?: SnapRangeCursor[]
}

export type DiagnosticSubsystem = 'devp2p' | 'snap' | 'ethy' | 'bal' | 'mpt' | 'cl' | 'ai'

export interface DiagnosticEvent {
  timestamp: number
  subsystem: DiagnosticSubsystem
  severity: 'info' | 'warn' | 'error' | 'anomaly'
  peerId?: string
  bucketIndex?: number
  message: string
  rawPayloadHex?: string
}

export interface CapabilityState {
  status: CapabilityReadiness
  label: string
  progressPct?: number
}

export type BalWindowEntry = {
  blockNumber: bigint
  accountCount: number
  /** Full JSON for the latest head block only. */
  balJson?: BALJSONBlockAccessList
}

/** In-flight rolling pivot heal. `nextBlock` is the next block to fetch. */
export type PivotHealProgress = {
  fromBlock: bigint
  nextBlock: bigint
  toBlock: bigint
}

/** Fast-forward saved pivot via BALs before resuming `snap/1` (WP-06d). */
export type PivotBridgingProgress = {
  fromBlock: bigint
  currentBlock: bigint
  targetBlock: bigint
  blocksPerSec?: number
}

/**
 * Accounts that survived a finished heal (`kept`), or journals on the previous
 * pivot that resume did not load (`previous`).
 */
export type PivotCarry = {
  kind: 'kept' | 'previous'
  accounts: number
}

export interface EthySpine {
  clientName: string
  clientVersion: string
  network: string
  chainId: bigint
  phase: EthyPhase
  /** Locked base-state download path (WP-06c). Phase stays `SNAP_SYNCING` for both. */
  syncTransport?: SyncTransport
  /** Local servable ETHY/0 account buckets (`1 << nibble`). */
  ethyBucketsBitmask?: number
  currentSlot: number
  pivotBlockNumber?: bigint
  pivotStateRoot?: Uint8Array
  /** Short Node Pulse hint while pivot is not anchored (live P2P). */
  pivotStatusHint?: string
  /** Set while a rolling pivot heal is walking blocks. Cleared when it finishes or fails. */
  pivotHeal?: PivotHealProgress
  /** BAL bridge into the live snap window; snap schedulers stay idle (WP-06d). */
  pivotBridging?: PivotBridgingProgress
  /** Set after a heal that held accounts, or when the previous pivot still has unloaded journals. */
  pivotCarry?: PivotCarry
  /** `--demo` uses {@link currentSlot} as a synthetic clock in the capability bar. */
  demoClock?: boolean
  headBlockNumber?: bigint
  headStateRoot?: Uint8Array
  /** Last block whose header+BAL were verified and applied (persisted on disk). */
  lastVerifiedBlockNumber?: bigint
  /** Best peer head from telemetry (Node Pulse drift). */
  bestPeerHead?: bigint
  /** Post-snap BAL walk toward network head. */
  balCatchUp?: {
    fromBlock: bigint
    applied: number
    total: number
    /** Live catch-up throughput for Node Pulse (WP-07e). */
    blocksPerSec?: number
  }
  /** Rolling pivot steps completed during snap (WP-04k). */
  pivotStepsCompleted?: number
  streamedBalCount?: number
  appliedBalCount?: number
  bufferedBalCount?: number
  /** One-shot celebration payload for Zone 2 after snap completes (WP-04k). */
  headFlipSummary?: WidgetSpec
  capabilities: {
    state: CapabilityState
    economy: CapabilityState
    p2p: CapabilityState
    ai: CapabilityState
  }
  peers: Map<string, PeerTelemetry>
  /** Latest worker discovery counters (live P2P only). */
  discovery?: WorkerDiscoverySnapshot
  /** Rolling-window eth serve telemetry from the worker (live P2P only). */
  serving?: WorkerServingSnapshot
  snapBuckets: SnapBucket[]
  /** Snap peers currently rested after a range timeout (live scheduler). */
  snapPeersResting?: number
  totalAccountsSynced: number
  accountsPerSec: number
  /** Smoothed per-minute account rate (refreshed every ~5s to stay steady in the TUI). */
  accountsPerMin?: number
  /** Smoothed ETA in minutes for the active snap sync stage (refreshed every ~5s). */
  snapEtaMinutes?: number
  codesSynced: number
  /** Total unique contract code hashes discovered (WP-06f). */
  codesTotal?: number
  /** Code hashes still queued or in flight. */
  codesQueued: number
  storageSlotsSynced: number
  /** Storage-bearing accounts completed (WP-06f). */
  storageAccountsSynced?: number
  /** Total storage-bearing accounts discovered (WP-06f). */
  storageAccountsTotal?: number
  /** Storage accounts still queued or in flight. */
  storageQueued: number
  /** Combined code + storage account completion rate during code/storage phase (WP-06f). */
  contractsPerSec?: number
  storageEtaMinutes?: number
  /** Rolling BAL summaries for `/bal` and `/account` (newest first, max 64). */
  balWindow: BalWindowEntry[]
  /** Live Ethereum economy lens (WP-07a). */
  economy?: EconomySnapshot
  snapPaused: boolean
  /** When true, deriveCapabilities shows AI pill as Local LLM (WP-07c pulse). */
  llmPulseReady?: boolean
  diagnosticRingBuffer: DiagnosticEvent[]
  /** Consensus light client witness (WP-05b). */
  clStatus?: 'verified' | 'syncing' | 'p2p_only' | 'mismatch'
  clFinalizedBlockNumber?: bigint
  clOptimisticBlockNumber?: bigint
  clFinalizedSlot?: number
  clOptimisticSlot?: number
  clParticipationPct?: number
  clPeriod?: number
  /** Optimistic EL block hash from BLS-verified light client header. */
  clHeadBlockHash?: Uint8Array
  /** Finalized EL block hash from BLS-verified light client header. */
  clFinalizedBlockHash?: Uint8Array
  clEndpoint?: string
  /** Optional sink hook for the persistent Flight Recorder log files. */
  onDiagnosticRecorded?: (entry: DiagnosticEvent) => void
  /** Active logs directory path (`~/.ethy/networks/<net>/logs`). */
  logsDirPath?: string
  /** Loopback JSON-RPC 2.0 telemetry (WP-08a). */
  rpc?: RpcTelemetry
}

export type RpcMethodStat = {
  calls: number
  errors: number
  lastLatencyMs: number
}

export type RpcRecentCall = {
  timestamp: number
  method: string
  status: 'ok' | 'err'
  durationMs: number
}

export type RpcTelemetry = {
  enabled: boolean
  listening: boolean
  host: string
  port: number
  url: string
  totalRequests: number
  totalErrors: number
  lastMethod?: string
  lastRequestAt?: number
  methodStats: Record<string, RpcMethodStat>
  recentCalls: RpcRecentCall[]
}

export type DebugSectionSpec = {
  title: string
  entries: Array<{ key: string; value: string }>
}

export type InteractionPage = 'main' | 'debug'

export type DomainHelpSection = {
  title: string
  rows?: Array<{ command: string; detail: string }>
  prompts?: string[]
  column?: 'left' | 'right'
  domain?: CapabilityId
}

export type InteractionHistoryEntry =
  | {
      kind: 'slash'
      command: string
      label: string
      page: InteractionPage
      /** Frozen EVM snapshot for `/simulate` and `/send` (WP-08b). */
      frozenWidget?: WidgetSpec
    }
  | {
      kind: 'ai'
      prompt: string
      viewTitle: string
      widget: WidgetSpec
      overviewNote?: string
      page: InteractionPage
    }

export interface AiOverviewSections {
  state?: string
  economy?: string
  p2p?: string
  focusNote?: { domain: CapabilityId; text: string }
}

export type WidgetSpec =
  | {
      kind: 'onboarding_carousel'
      lines: Array<{ group: 'P2P' | 'SNAP' | 'HEAD'; command: string; prose: string }>
      assistantComment?: string
      debugPage?: DebugSectionSpec[]
    }
  | {
      kind: 'table'
      title?: string
      headers: string[]
      rows: string[][]
      assistantComment?: string
      /** @deprecated WP-07b: use `debugPage` instead of footer discovery rows. */
      footer?: 'discovery'
      preface?: Array<{ key: string; value: string }>
      secondaryTable?: {
        title?: string
        headers: string[]
        rows: string[][]
      }
      debugPage?: DebugSectionSpec[]
    }
  | {
      kind: 'key_value'
      title?: string
      entries: Array<{ key: string; value: string }>
      assistantComment?: string
      debugPage?: DebugSectionSpec[]
    }
  | {
      kind: 'domain_help'
      domain?: CapabilityId
      unified?: boolean
      sections: DomainHelpSection[]
      aiExamples?: string[]
      debugPage?: DebugSectionSpec[]
    }
  | {
      kind: 'start_page'
      debugPage?: DebugSectionSpec[]
    }
  | {
      kind: 'live_plaza'
      debugPage?: DebugSectionSpec[]
    }

export interface TuiViewState {
  activeDomain: CapabilityId
  activeWidget: WidgetSpec | null
  interactionPage: InteractionPage
  /** Three-domain situational prose for the full-height AI box (refreshed in session). */
  aiOverviewSections?: AiOverviewSections
  showingHelp: boolean
  viewHistory: InteractionHistoryEntry[]
  viewHistoryIndex: number
  promptDraft: string
  carouselTick: number
  history: string[]
  historyIndex: number
  shouldExit: boolean
  /** Last command or prompt that opened the interaction view (title chrome). */
  interactionLabel?: string
  /** LLM-suggested short title for NL queries (WP-07c). */
  interactionTitle?: string
}
